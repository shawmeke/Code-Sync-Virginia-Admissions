import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useTheme } from '@/constants/theme';
import { formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { College } from '@/types/college';

export function CollegeCard({ college }: { college: College }) {
  const theme = useTheme();
  const control = college.control === 'public' ? 'Public' : 'Private';

  return (
    <Link href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityHint="Opens admissions details" style={styles.pressable}>
        {/* Card styles live on an inner View because Link doesn't pass a style function through on web. */}
        {({ pressed }) => (
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 }]}>
            <Text style={[styles.name, { color: theme.text }]}>{college.name}</Text>
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {college.city} · {control} · {TEST_POLICY_LABELS[college.testPolicy]}
            </Text>
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
  card: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  name: { fontSize: 17, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 2 },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  figure: { flex: 1, borderRadius: radius.sm, paddingVertical: spacing.sm, paddingHorizontal: 6 },
  figureValue: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  figureLabel: { fontSize: 11, marginTop: 2 },
});
