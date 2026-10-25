import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '@/components/ProfileContext';
import { SchoolBadge } from '@/components/SchoolBadge';
import { fonts, radius, rules, schoolBadges, spacing, type, useTheme } from '@/constants/theme';
import { colleges, getCollege } from '@/data/colleges';
import { alignWithCollege } from '@/lib/admissions';
import { formatCount, formatEarlyPlan, formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { College } from '@/types/college';

type Row = { label: string; value: (c: College) => string };

const ROWS: Row[] = [
  { label: 'Offer rate', value: (c) => (c.offerRate ? formatPercent(c.offerRate.value) : 'Not available') },
  { label: 'Applicants', value: (c) => (c.applicants ? formatCount(c.applicants.value) : 'Not available') },
  { label: 'SAT middle 50%', value: (c) => (c.sat ? formatRange(c.sat.value) : 'Not available') },
  { label: 'ACT middle 50%', value: (c) => (c.act ? formatRange(c.act.value) : 'Not available') },
  { label: 'Average GPA', value: (c) => (c.gpaAverage ? c.gpaAverage.value.toFixed(2) : 'Not available') },
  {
    label: 'In top 10% of class',
    value: (c) => (c.classRank?.value.topTenth != null ? formatPercent(c.classRank.value.topTenth) : 'Not available'),
  },
  { label: 'Testing', value: (c) => TEST_POLICY_LABELS[c.testPolicy] },
  { label: 'Application fee', value: (c) => (c.applying?.value.fee == null ? 'Not available' : c.applying.value.fee === 0 ? 'No fee' : `$${c.applying.value.fee}`) },
  { label: 'Regular deadline', value: (c) => c.applying?.value.regularDeadline ?? 'Not available' },
  { label: 'Early decision', value: (c) => formatEarlyPlan(c.applying?.value.earlyDecision) },
  { label: 'Early action', value: (c) => formatEarlyPlan(c.applying?.value.earlyAction) },
  { label: 'Figures for', value: (c) => c.cycle },
];

// Two schools side by side. Pick each one from the row of badges.
export default function CompareScreen() {
  const theme = useTheme();
  const { profile, ready, saved } = useProfile();
  // Start with the first two saved schools, else the first two in the app.
  const initial = [...saved, ...colleges.map((c) => c.id).filter((id) => !saved.includes(id))];
  const [left, setLeft] = useState(initial[0]);
  const [right, setRight] = useState(initial[1]);
  // A college row's "Compare" button opens this tab with that school first.
  // The tab stays mounted, so follow each new request, not only the first.
  const params = useLocalSearchParams<{ first?: string }>();
  useEffect(() => {
    const first = params.first;
    if (!first || !getCollege(first)) return;
    setLeft(first);
    setRight((r) => (r === first ? (colleges.find((c) => c.id !== first)?.id ?? r) : r));
  }, [params.first]);
  const a = getCollege(left)!;
  const b = getCollege(right)!;
  const match = (c: College) => (ready ? (alignWithCollege(profile, c).match?.score ?? null) : null);

  return (
    <ScrollView style={{ backgroundColor: theme.paper }} contentContainerStyle={styles.content}>
      <Picker label="First school" value={left} other={right} onChange={setLeft} />
      <Picker label="Second school" value={right} other={left} onChange={setRight} />

      <View style={[styles.table, { backgroundColor: theme.sheet }]}>
        <View style={[styles.headRow, { borderBottomColor: theme.rule }]}>
          <View style={styles.labelCell} />
          {[a, b].map((c) => (
            <View key={c.id} style={styles.headCell}>
              <SchoolBadge collegeId={c.id} size={48} />
              <Text style={[styles.headName, { color: theme.ink }]}>{c.name}</Text>
            </View>
          ))}
        </View>
        {ready && (
          <CompareRow
            label="Your Academic Match"
            schools={[a.name, b.name]}
            values={[a, b].map((c) => (match(c) === null ? 'Not enough data' : String(match(c))))}
            highlight
          />
        )}
        {ROWS.map((r, i) => (
          <CompareRow
            key={r.label}
            label={r.label}
            schools={[a.name, b.name]}
            values={[r.value(a), r.value(b)]}
            last={i === ROWS.length - 1}
          />
        ))}
      </View>
      <Text style={[styles.note, { color: theme.muted }]}>
        Figures come from each school's Common Data Set and may describe different years; see each college's page for
        the sources.
      </Text>
    </ScrollView>
  );
}

function Picker({ label, value, other, onChange }: { label: string; value: string; other: string; onChange: (id: string) => void }) {
  const theme = useTheme();
  return (
    <View style={styles.picker}>
      <Text style={[styles.pickerLabel, { color: theme.muted }]}>{label}</Text>
      {/* Scrolls sideways: fifteen schools don't fit across a phone. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pickerScroll}
        contentContainerStyle={styles.pickerRow}
        accessibilityRole="radiogroup"
        accessibilityLabel={label}>
        {colleges.map((c) => {
          const selected = c.id === value;
          const disabled = c.id === other;
          return (
            <Pressable
              key={c.id}
              onPress={() => onChange(c.id)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityLabel={c.name}
              accessibilityState={{ selected, disabled }}
              style={[
                styles.pickerItem,
                { borderColor: selected ? theme.accent : 'transparent', opacity: disabled ? 0.35 : 1 },
              ]}>
              <SchoolBadge collegeId={c.id} size={40} />
              <Text style={[styles.pickerName, { color: selected ? theme.accent : theme.muted }]} numberOfLines={1}>
                {schoolBadges[c.id]?.initials ?? c.id.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

type CompareRowProps = { label: string; schools: string[]; values: string[]; highlight?: boolean; last?: boolean };

// One row of the table. Screen readers hear it as one sentence that names
// each school, since the column headers aren't read with each cell.
function CompareRow({ label, schools, values, highlight, last }: CompareRowProps) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${schools.map((s, i) => `${s} ${values[i]}`).join(', ')}`}
      style={[
        styles.row,
        highlight && { backgroundColor: theme.accentSoft },
        !last && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair },
      ]}>
      <Text style={[styles.labelCell, styles.rowLabel, { color: theme.muted }]}>{label}</Text>
      {values.map((v, i) => (
        <Text
          key={i}
          style={[styles.valueCell, { color: highlight ? theme.accent : v === 'Not available' ? theme.muted : theme.ink }]}>
          {v}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 720, width: '100%', alignSelf: 'center' },
  picker: { marginBottom: spacing.md },
  pickerLabel: { fontFamily: fonts.bodyMedium, fontSize: type.sm, marginBottom: spacing.xs },
  // Runs to the screen edges so the next school peeks out, showing the row scrolls.
  pickerScroll: { marginHorizontal: -spacing.lg },
  pickerRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  pickerItem: { borderWidth: 2, borderRadius: radius.card + 2, padding: 2, alignItems: 'center', width: 52 },
  pickerName: { fontFamily: fonts.control, fontSize: 11, marginTop: 2 },
  // A full-width white band; rows split by faint lines.
  table: { marginHorizontal: -spacing.lg, marginTop: spacing.md },
  headRow: { flexDirection: 'row', paddingVertical: spacing.lg, borderBottomWidth: rules.hair },
  headCell: { flex: 1, alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xs },
  headName: { fontFamily: fonts.control, fontSize: type.sm, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  labelCell: { width: '34%' },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: type.xs },
  valueCell: { flex: 1, textAlign: 'center', fontFamily: fonts.monoMedium, fontSize: type.sm, fontVariant: ['tabular-nums'] },
  note: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.md },
});
