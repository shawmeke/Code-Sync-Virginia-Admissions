import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AlignmentDots } from '@/components/AlignmentDots';
import { Icon } from '@/components/Icon';
import { useProfile } from '@/components/ProfileContext';
import { SchoolBadge } from '@/components/SchoolBadge';
import { fonts, radius, rules, shadow, spacing, type, useTheme } from '@/constants/theme';
import { alignWithCollege, describeAlignment, matchBasis } from '@/lib/admissions';
import { formatPercent, formatRange } from '@/lib/format';
import type { College } from '@/types/college';

// One college in the search results, laid out like a listing: the school
// name as the headline, its key figures on one line, your Academic Match in
// gold, and a bar of actions underneath.
export function CollegeCard({ college }: { college: College }) {
  const theme = useTheme();
  const { profile, ready, saved, toggleSaved } = useProfile();
  const control = college.control === 'public' ? 'Public' : 'Private';
  const alignment = ready ? alignWithCollege(profile, college) : null;
  const isSaved = saved.includes(college.id);
  const figures = [
    college.offerRate && { label: 'Offer rate', value: formatPercent(college.offerRate.value) },
    college.sat && { label: 'SAT', value: formatRange(college.sat.value) },
    college.act && { label: 'ACT', value: formatRange(college.act.value) },
  ].filter((f): f is { label: string; value: string } => !!f);

  return (
    <View style={[styles.card, { backgroundColor: theme.sheet, borderBottomColor: theme.rule }]}>
      <Link href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
        <Pressable accessibilityRole="link" accessibilityHint="Opens admissions details">
          {/* Styles live on an inner View because Link doesn't pass a style function through on web. */}
          {({ pressed }) => (
            <View style={[styles.main, { backgroundColor: pressed ? theme.paper2 : 'transparent' }]}>
              <View style={styles.top}>
                <SchoolBadge collegeId={college.id} />
                <View style={styles.title}>
                  <Text style={[styles.name, { color: theme.accent }]}>{college.name}</Text>
                  <View style={styles.metaRow}>
                    <Icon name="location" color={theme.muted} size={14} />
                    <Text style={[styles.meta, { color: theme.muted }]}>
                      {college.city}, VA · {control} · Figures for {college.cycle}
                    </Text>
                  </View>
                </View>
                {alignment?.match && (
                  <View
                    style={[styles.matchPill, { backgroundColor: theme.goldFill }]}
                    accessible
                    accessibilityLabel={`Academic Match ${alignment.match.score}`}>
                    <Text style={[styles.matchNumber, { color: theme.goldInk }]}>{alignment.match.score}</Text>
                    <Text style={[styles.matchLabel, { color: theme.goldInk }]}>Match</Text>
                  </View>
                )}
              </View>

              <Text style={styles.figures}>
                {figures.map((f, i) => (
                  <Text key={f.label}>
                    {i > 0 && <Text style={{ color: theme.muted }}> · </Text>}
                    <Text style={[styles.figureLabel, { color: theme.muted }]}>{f.label} </Text>
                    <Text style={[styles.figureValue, { color: theme.ink }]}>{f.value}</Text>
                  </Text>
                ))}
              </Text>

              {alignment?.match && (
                <>
                  {matchBasis(alignment.match) && (
                    <Text style={[styles.basis, { color: theme.goldText }]}>Match from your {matchBasis(alignment.match)}</Text>
                  )}
                  <AlignmentDots score={alignment.match.score} compact />
                </>
              )}
              {alignment && !alignment.match && (
                <Text style={[styles.summary, { color: theme.muted }]}>{describeAlignment(alignment)}</Text>
              )}
            </View>
          )}
        </Pressable>
      </Link>

      <View style={[styles.actions, { borderTopColor: theme.rule }]}>
        <Action
          label="How you compare"
          color={theme.accent}
          onPress={() => router.push({ pathname: '/college/[id]', params: { id: college.id } })}
        />
        <View style={[styles.divider, { backgroundColor: theme.rule }]} />
        <Action
          label="Compare"
          color={theme.accent}
          onPress={() => router.navigate({ pathname: '/compare', params: { first: college.id } })}
        />
        <View style={[styles.divider, { backgroundColor: theme.rule }]} />
        <Action
          label={isSaved ? 'Saved' : 'Save'}
          a11yLabel={isSaved ? `Remove ${college.name} from saved schools` : `Save ${college.name}`}
          color={theme.goldText}
          icon={isSaved ? 'heartFilled' : 'heart'}
          active={isSaved}
          onPress={() => toggleSaved(college.id)}
        />
      </View>
    </View>
  );
}

type ActionProps = {
  label: string;
  color: string;
  onPress: () => void;
  icon?: 'heart' | 'heartFilled';
  // Saved: a pale gold fill, since some icon sets draw the filled heart as an outline.
  active?: boolean;
  a11yLabel?: string;
};

function Action({ label, color, onPress, icon, active, a11yLabel }: ActionProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel ?? label}
      accessibilityState={active === undefined ? undefined : { selected: active }}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: pressed ? theme.paper2 : active ? theme.goldSoft : 'transparent' },
      ]}>
      {icon && <Icon name={icon} color={color} size={16} />}
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: -spacing.lg, borderBottomWidth: rules.hair, marginBottom: spacing.md, boxShadow: shadow.card },
  main: { paddingTop: spacing.lg, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: type.lg + 2, lineHeight: (type.lg + 2) * 1.2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  meta: { fontFamily: fonts.body, fontSize: type.xs, flexShrink: 1 },
  matchPill: { borderRadius: radius.control, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center', minWidth: 52, boxShadow: shadow.soft },
  matchNumber: { fontFamily: fonts.monoMedium, fontSize: type.xl, fontVariant: ['tabular-nums'], lineHeight: type.xl * 1.1 },
  matchLabel: { fontFamily: fonts.control, fontSize: 11 },
  figures: { marginTop: spacing.md, lineHeight: type.sm * 1.5 },
  figureLabel: { fontFamily: fonts.body, fontSize: type.sm },
  figureValue: { fontFamily: fonts.monoMedium, fontSize: type.sm, fontVariant: ['tabular-nums'] },
  basis: { fontFamily: fonts.control, fontSize: type.xs, marginTop: spacing.sm },
  summary: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.4, marginTop: spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'stretch', borderTopWidth: rules.hair },
  action: { flex: 1, minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionText: { fontFamily: fonts.control, fontSize: type.sm },
  divider: { width: rules.hair, marginVertical: spacing.sm },
});
