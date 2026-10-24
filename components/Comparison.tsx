import { StyleSheet, Text, View } from 'react-native';

import { ScoreRing } from '@/components/ScoreRing';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import type { AcademicMatch, MatchMeasure, MetricResult } from '@/lib/admissions';
import { formatPercentile, formatPercentileShort } from '@/lib/format';

const MEASURE_LABELS: Record<MatchMeasure, string> = {
  test: 'test score',
  gpa: 'GPA',
  classRank: 'class rank',
};

export function describeMeasures(measures: MatchMeasure[]): string {
  const names = measures.map((m) => MEASURE_LABELS[m]);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// The Academic Match on a college's page: the gold ring with the score set
// in mono, and what it means written out beside it.
export function MatchScore({ match, collegeName }: { match: AcademicMatch; collegeName: string }) {
  const theme = useTheme();
  const based = describeMeasures(match.measures);
  return (
    <View style={styles.match}>
      <View accessible accessibilityRole="image" accessibilityLabel={`Academic Match ${match.score} out of 100`}>
        <ScoreRing value={match.score} size={104} strokeWidth={7} color={theme.gold} trackColor={theme.rule}>
          <Text style={[styles.matchNumber, { color: theme.ink }]}>{match.score}</Text>
          <Text style={[styles.matchOutOf, { color: theme.muted }]}>of 100</Text>
        </ScoreRing>
      </View>
      <View style={styles.matchText}>
        <Text style={[styles.matchTitle, { color: theme.ink }]}>Academic Match</Text>
        <Text style={[styles.body, { color: theme.ink2 }]}>
          On average, your numbers are higher than about {match.score}% of {collegeName}'s enrolled students.
        </Text>
        <Text style={[styles.small, { color: theme.muted }]}>
          Based on your {based}. This compares your numbers with past students. It isn't your chance of admission.
        </Text>
      </View>
    </View>
  );
}

// The score in the college ledger: a mono figure on a gold fill.
export function MatchPill({ match }: { match: AcademicMatch }) {
  const theme = useTheme();
  return (
    <View
      style={[styles.pill, { backgroundColor: theme.goldFill }]}
      accessible
      accessibilityLabel={`Academic Match ${match.score} out of 100`}>
      <Text style={[styles.pillNumber, { color: theme.goldInk }]}>{match.score}</Text>
    </View>
  );
}

// A 0–100 scale with the middle 50% shaded and a gold mark where you fall.
export function PercentileBar({ percentile }: { percentile: number }) {
  const theme = useTheme();
  return (
    <View
      style={styles.barWrap}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Estimated at ${formatPercentile(percentile)}`}>
      <View style={[styles.track, { borderBottomColor: theme.rule2 }]}>
        <View style={[styles.middle, { backgroundColor: theme.band }]} />
        {[25, 50, 75].map((t) => (
          <View key={t} style={[styles.tickMark, { left: `${t}%`, backgroundColor: theme.rule2 }]} />
        ))}
        <View
          style={[styles.marker, { left: `${percentile}%`, backgroundColor: theme.gold, borderColor: theme.sheet }]}
        />
      </View>
      <View style={styles.ticks}>
        {['0', '25', '50', '75', '100'].map((t) => (
          <Text key={t} style={[styles.tick, { color: theme.muted }]}>
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
}

const STATUS_LABELS: Record<MetricResult['status'], string> = {
  compared: '',
  'context-only': 'Context only',
  'student-missing': 'Not entered',
  'college-missing': 'Not published',
  incompatible: "Can't compare",
};

// One measure's result: the plain-English summary, the scale when a
// percentile could be estimated, and every caveat that applies.
export function MetricRow({ metric, last }: { metric: MetricResult; last?: boolean }) {
  const theme = useTheme();
  const status = STATUS_LABELS[metric.status];
  return (
    <View style={[styles.row, !last && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair }]}>
      <View style={styles.rowTop}>
        <Text style={[styles.rowLabel, { color: theme.ink }]}>{metric.label}</Text>
        {metric.percentile !== null ? (
          <Text style={[styles.rowValue, { color: theme.ink }]}>{formatPercentileShort(metric.percentile)}</Text>
        ) : (
          status !== '' && <Text style={[styles.rowStatus, { color: theme.muted }]}>{status}</Text>
        )}
      </View>
      <Text style={[styles.body, { color: theme.ink2 }]}>{metric.summary}</Text>
      {metric.percentile !== null && <PercentileBar percentile={metric.percentile} />}
      {metric.caveats.map((c, i) => (
        <Text key={`${i}-${c}`} style={[styles.small, { color: theme.muted }]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  match: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center', paddingVertical: spacing.lg },
  matchNumber: { fontFamily: fonts.monoMedium, fontSize: 32, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  matchOutOf: { fontFamily: fonts.body, fontSize: type.xs, marginTop: -2 },
  matchText: { flex: 1 },
  matchTitle: { fontFamily: fonts.display, fontSize: type.lg, marginBottom: spacing.xs },
  pill: { minWidth: 40, paddingHorizontal: 6, paddingVertical: 3, alignItems: 'center' },
  pillNumber: { fontFamily: fonts.monoMedium, fontSize: type.lg, fontVariant: ['tabular-nums'] },
  barWrap: { marginTop: spacing.md, marginBottom: spacing.xs },
  track: { height: 16, borderBottomWidth: rules.bar, justifyContent: 'center' },
  middle: { position: 'absolute', left: '25%', width: '50%', top: 0, bottom: 0 },
  tickMark: { position: 'absolute', bottom: 0, width: rules.hair, height: 8 },
  marker: { position: 'absolute', width: 14, height: 14, marginLeft: -7, top: 1, borderWidth: 2 },
  ticks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  tick: { fontFamily: fonts.mono, fontSize: 11, fontVariant: ['tabular-nums'] },
  row: { paddingVertical: spacing.lg },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md, marginBottom: 4 },
  rowLabel: { fontFamily: fonts.display, fontSize: type.md },
  rowValue: { fontFamily: fonts.monoMedium, fontSize: type.sm, fontVariant: ['tabular-nums'] },
  rowStatus: { fontFamily: fonts.bodyItalic, fontSize: type.sm },
  body: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5 },
  small: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.xs },
});
