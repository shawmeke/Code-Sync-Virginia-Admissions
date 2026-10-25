import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/Section';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';
import { getSource } from '@/data/colleges';
import { formatShare, majorShare, topFields } from '@/lib/majors';
import type { College } from '@/types/college';

// What a college's students earn their degrees in, from its Common Data Set
// (J1): the student's chosen major first, then the five largest fields.
export function DegreeFields({ college, major }: { college: College; major: string | null }) {
  const theme = useTheme();
  const fields = college.degreeFields;
  const share = majorShare(college, major);

  if (!fields) {
    return (
      <Section title="What students study">
        <Text style={[styles.body, { color: theme.muted }]}>
          {college.name} leaves its degrees-by-field table blank in its Common Data Set.
        </Text>
      </Section>
    );
  }

  const top = topFields(college, 5);
  const source = getSource(fields.sourceId);
  const yours =
    share?.status === 'reported' ? `${formatShare(share.percent)} of bachelor's degrees` : "No bachelor's degrees reported in this field";
  return (
    <Section title="What students study">
      {share && major && (
        <View
          style={[styles.yours, { backgroundColor: theme.goldSoft }]}
          accessible
          accessibilityLabel={`Your major, ${major}: ${yours}`}>
          <Text style={[styles.yoursLabel, { color: theme.goldText }]}>Your major: {major}</Text>
          <Text style={[styles.yoursValue, { color: theme.ink }]}>{yours}</Text>
        </View>
      )}
      {top.map((f, i) => (
        <View
          key={f.label}
          style={[styles.row, i < top.length - 1 && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair }]}
          accessible
          accessibilityLabel={`${f.label}: ${formatShare(f.percent)}`}>
          <View style={styles.rowTop}>
            <Text style={[styles.label, { color: theme.ink2 }]}>{f.label}</Text>
            <Text style={[styles.value, { color: theme.ink }]}>{formatShare(f.percent)}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: theme.band }]}>
            <View style={[styles.fill, { width: `${f.percent}%`, backgroundColor: theme.accent }]} />
          </View>
        </View>
      ))}
      <Text style={[styles.caption, { color: theme.muted, borderTopColor: theme.rule }]}>
        Share of {fields.cohort.charAt(0).toLowerCase() + fields.cohort.slice(1)}
        {source ? `, from the ${source.title}` : ''}.{fields.note ? ` ${fields.note}` : ''}
      </Text>
    </Section>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, paddingVertical: spacing.md },
  yours: { marginTop: spacing.md, marginBottom: spacing.xs, padding: spacing.md, borderRadius: radius.card },
  yoursLabel: { fontFamily: fonts.control, fontSize: type.xs },
  yoursValue: { fontFamily: fonts.monoMedium, fontSize: type.md, marginTop: 2 },
  row: { paddingVertical: spacing.md },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md },
  label: { fontFamily: fonts.bodyMedium, fontSize: type.sm, flexShrink: 1 },
  value: { fontFamily: fonts.monoMedium, fontSize: type.sm, fontVariant: ['tabular-nums'] },
  track: { height: 6, borderRadius: 3, marginTop: spacing.sm, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  caption: {
    fontFamily: fonts.body,
    fontSize: type.xs,
    lineHeight: type.xs * 1.45,
    paddingVertical: spacing.md,
    borderTopWidth: rules.hair,
  },
});
