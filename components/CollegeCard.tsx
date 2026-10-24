import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AlignmentDots } from '@/components/AlignmentDots';
import { Icon } from '@/components/Icon';
import { useProfile } from '@/components/ProfileContext';
import { SchoolBadge } from '@/components/SchoolBadge';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import { alignWithCollege, describeAlignment, matchBasis } from '@/lib/admissions';
import { formatPercent, formatRange } from '@/lib/format';
import type { College } from '@/types/college';

// One college in the list: its badge, name and details, the published
// figures, and your Academic Match with the dotted alignment bar once you've
// entered a profile.
export function CollegeCard({ college }: { college: College }) {
  const theme = useTheme();
  const { profile, ready, saved } = useProfile();
  const control = college.control === 'public' ? 'Public' : 'Private';
  const alignment = ready ? alignWithCollege(profile, college) : null;
  const isSaved = saved.includes(college.id);
  const figures = [
    college.offerRate && `Offer rate ${formatPercent(college.offerRate.value)}`,
    college.sat && `SAT ${formatRange(college.sat.value)}`,
    college.act && `ACT ${formatRange(college.act.value)}`,
  ].filter(Boolean);

  return (
    <Link href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityHint="Opens admissions details" style={styles.pressable}>
        {/* Card styles live on an inner View because Link doesn't pass a style function through on web. */}
        {({ pressed }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: pressed ? theme.paper2 : theme.sheet, borderBottomColor: theme.rule },
            ]}>
            <View style={styles.top}>
              <SchoolBadge collegeId={college.id} />
              <View style={styles.title}>
                <Text style={[styles.name, { color: theme.ink }]}>{college.name}</Text>
                {alignment?.match && (
                  <Text style={[styles.match, { color: theme.accent }]}>
                    Match {alignment.match.score}
                    {matchBasis(alignment.match) && (
                      <Text style={[styles.basis, { color: theme.muted }]}> · {matchBasis(alignment.match)}</Text>
                    )}
                  </Text>
                )}
                <Text style={[styles.meta, { color: theme.muted }]}>
                  {control} · {college.city}, VA
                </Text>
              </View>
              {isSaved && <Icon name="heartFilled" color={theme.accent} size={18} />}
              <Icon name="chevron" color={theme.muted} size={16} />
            </View>
            <Text style={[styles.figures, { color: theme.ink2 }]}>{figures.join('   ')}</Text>
            {alignment?.match && <AlignmentDots score={alignment.match.score} compact />}
            {alignment && !alignment.match && (
              <Text style={[styles.summary, { color: theme.muted }]}>{describeAlignment(alignment)}</Text>
            )}
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: { marginHorizontal: -spacing.lg },
  card: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderBottomWidth: rules.hair },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1 },
  name: { fontFamily: fonts.control, fontSize: type.md },
  match: { fontFamily: fonts.control, fontSize: type.sm, marginTop: 2 },
  basis: { fontFamily: fonts.body, fontSize: type.xs },
  meta: { fontFamily: fonts.body, fontSize: type.xs, marginTop: 2 },
  figures: { fontFamily: fonts.bodyMedium, fontSize: type.xs, marginTop: spacing.md, fontVariant: ['tabular-nums'] },
  summary: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.4, marginTop: spacing.sm },
});
