import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MatchPill } from '@/components/Comparison';
import { useProfile } from '@/components/ProfileContext';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import { alignWithCollege, describeAlignment } from '@/lib/admissions';
import { formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { College } from '@/types/college';

// One row of the college ledger: the school, its published figures in mono
// columns, and your Academic Match once you've entered a profile.
export function CollegeCard({ college }: { college: College }) {
  const theme = useTheme();
  const { profile, ready } = useProfile();
  const control = college.control === 'public' ? 'public' : 'private';
  const alignment = ready ? alignWithCollege(profile, college) : null;

  return (
    <Link href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityHint="Opens admissions details">
        {/* Row styles live on an inner View because Link doesn't pass a style function through on web. */}
        {({ pressed }) => (
          <View
            style={[
              styles.row,
              { borderBottomColor: theme.rule, backgroundColor: pressed ? theme.paper2 : theme.sheet },
            ]}>
            <View style={styles.top}>
              <View style={styles.title}>
                <Text style={[styles.name, { color: theme.ink }]}>{college.name}</Text>
                <Text style={[styles.meta, { color: theme.muted }]}>
                  {college.city}, {control}, {TEST_POLICY_LABELS[college.testPolicy].toLowerCase()}
                </Text>
              </View>
              {alignment?.match && <MatchPill match={alignment.match} />}
            </View>
            <View style={styles.figures}>
              <Figure label="Offer rate" value={college.offerRate ? formatPercent(college.offerRate.value) : null} />
              <Figure label="SAT middle 50%" value={college.sat ? formatRange(college.sat.value) : null} />
              <Figure label="ACT middle 50%" value={college.act ? formatRange(college.act.value) : null} />
            </View>
            {alignment && <Text style={[styles.summary, { color: theme.ink2 }]}>{describeAlignment(alignment)}</Text>}
          </View>
        )}
      </Pressable>
    </Link>
  );
}

function Figure({ label, value }: { label: string; value: string | null }) {
  const theme = useTheme();
  return (
    <View style={styles.figure}>
      <Text style={[styles.figureLabel, { color: theme.muted }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.figureValue, { color: value ? theme.ink : theme.muted }]}>
        {value ?? 'Not published'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderBottomWidth: rules.hair },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  title: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: type.lg, letterSpacing: -0.2 },
  meta: { fontFamily: fonts.body, fontSize: type.sm, marginTop: 2 },
  figures: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  figure: { flexShrink: 1 },
  figureLabel: { fontFamily: fonts.body, fontSize: type.xs },
  figureValue: { fontFamily: fonts.monoMedium, fontSize: type.md, fontVariant: ['tabular-nums'], marginTop: 1 },
  summary: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: spacing.md },
});
