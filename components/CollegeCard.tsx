import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MatchPill } from '@/components/Comparison';
import { useProfile } from '@/components/ProfileContext';
import { accentFor, radius, spacing, useTheme } from '@/constants/theme';
import { alignWithCollege, describeAlignment } from '@/lib/admissions';
import { formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { College } from '@/types/college';

export function CollegeCard({ college }: { college: College }) {
  const theme = useTheme();
  const { profile, ready } = useProfile();
  const control = college.control === 'public' ? 'Public' : 'Private';
  const alignment = ready ? alignWithCollege(profile, college) : null;

  return (
    <Link href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityHint="Opens admissions details" style={styles.pressable}>
        {/* Card styles live on an inner View because Link doesn't pass a style function through on web. */}
        {({ pressed }) => (
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 }]}>
            <View style={[styles.accent, { backgroundColor: accentFor(college.id, theme) }]} />
            <View style={styles.top}>
              <View style={styles.title}>
                <Text style={[styles.name, { color: theme.text }]}>{college.name}</Text>
                <Text style={[styles.meta, { color: theme.textMuted }]}>
                  {college.city} · {control} · {TEST_POLICY_LABELS[college.testPolicy]}
                </Text>
              </View>
              {alignment?.match && <MatchPill match={alignment.match} />}
            </View>
            {alignment && (
              <Text style={[styles.summary, { color: theme.text }]}>{describeAlignment(alignment)}</Text>
            )}
            <View style={styles.stats}>
              <Figure label="Offer rate" value={college.offerRate ? formatPercent(college.offerRate.value) : null} />
              <Figure label="SAT range" value={college.sat ? formatRange(college.sat.value) : null} />
              <Figure label="ACT range" value={college.act ? formatRange(college.act.value) : null} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

function Figure({ label, value }: { label: string; value: string | null }) {
  const theme = useTheme();
  return (
    <View style={[styles.figure, { backgroundColor: theme.surfaceMuted }]}>
      <Text numberOfLines={1} style={[styles.figureValue, { color: value ? theme.text : theme.textMuted }]}>{value ?? '—'}</Text>
      <Text style={[styles.figureLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: { marginBottom: spacing.md },
  card: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, paddingLeft: spacing.md + 6, overflow: 'hidden' },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  title: { flex: 1 },
  summary: { fontSize: 13, lineHeight: 18, marginTop: spacing.sm },
  name: { fontSize: 18, fontWeight: '800' },
  meta: { fontSize: 13, marginTop: 2 },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  figure: { flex: 1, borderRadius: radius.sm, paddingVertical: spacing.sm, paddingHorizontal: 6 },
  figureValue: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  figureLabel: { fontSize: 11, marginTop: 2 },
});
