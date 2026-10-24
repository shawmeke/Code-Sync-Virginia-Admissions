import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useTheme } from '@/constants/theme';
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

// The big Academic Match number on a college's page, with what it means
// written out next to it.
export function MatchScore({ match, collegeName }: { match: AcademicMatch; collegeName: string }) {
  const theme = useTheme();
  const based = describeMeasures(match.measures);
  return (
    <View style={styles.match}>
      <View
        style={[styles.matchCircle, { borderColor: theme.primary }]}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Academic Match ${match.score} out of 100`}>
        <Text style={[styles.matchNumber, { color: theme.text }]}>{match.score}</Text>
        <Text style={[styles.matchOutOf, { color: theme.textMuted }]}>of 100</Text>
      </View>
      <View style={styles.matchText}>
        <Text style={[styles.matchTitle, { color: theme.text }]}>Academic Match</Text>
        <Text style={[styles.body, { color: theme.text }]}>
          On average, your numbers are higher than about {match.score}% of {collegeName}'s enrolled students.
        </Text>
        <Text style={[styles.small, { color: theme.textMuted }]}>
          Based on your {based}. This compares your numbers with past students. It isn't your chance of admission.
        </Text>
      </View>
    </View>
  );
}

// A compact score for the college list.
export function MatchPill({ match }: { match: AcademicMatch }) {
  const theme = useTheme();
  return (
    <View
      style={[styles.pill, { backgroundColor: theme.primary }]}
      accessible
      accessibilityLabel={`Academic Match ${match.score} out of 100`}>
      <Text style={[styles.pillNumber, { color: theme.onPrimary }]}>{match.score}</Text>
      <Text style={[styles.pillLabel, { color: theme.onPrimary }]}>Match</Text>
    </View>
  );
}

// Where a percentile falls on a 0–100 line, with the middle 50% shaded.
export function PercentileBar({ percentile }: { percentile: number }) {
  const theme = useTheme();
  return (
    <View
      style={styles.barWrap}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Estimated at ${formatPercentile(percentile)}`}>
      <View style={[styles.track, { backgroundColor: theme.barTrack }]}>
        <View style={[styles.middle, { backgroundColor: theme.bar, opacity: 0.25 }]} />
        <View style={[styles.marker, { left: `${percentile}%`, backgroundColor: theme.bar, borderColor: theme.surface }]} />
      </View>
      <View style={styles.ticks}>
        <Text style={[styles.tick, { color: theme.textMuted }]}>0</Text>
        <Text style={[styles.tick, { color: theme.textMuted }]}>Middle 50%</Text>
        <Text style={[styles.tick, { color: theme.textMuted }]}>100</Text>
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

// One measure's result: the plain-English summary, a percentile bar when one
// could be estimated, and every caveat that applies.
export function MetricRow({ metric, last }: { metric: MetricResult; last?: boolean }) {
  const theme = useTheme();
  const status = STATUS_LABELS[metric.status];
  return (
    <View style={[styles.row, !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={styles.rowTop}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{metric.label}</Text>
        {metric.percentile !== null ? (
          <Text style={[styles.rowValue, { color: theme.text }]}>{formatPercentileShort(metric.percentile)}</Text>
        ) : (
          status !== '' && <Text style={[styles.rowStatus, { color: theme.textMuted }]}>{status}</Text>
        )}
      </View>
      <Text style={[styles.body, { color: theme.text }]}>{metric.summary}</Text>
      {metric.percentile !== null && <PercentileBar percentile={metric.percentile} />}
      {metric.caveats.map((c, i) => (
        <Text key={`${i}-${c}`} style={[styles.small, { color: theme.textMuted }]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  match: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center', paddingVertical: spacing.md },
  matchCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchNumber: { fontSize: 30, fontWeight: '800', fontVariant: ['tabular-nums'] },
  matchOutOf: { fontSize: 11, marginTop: -2 },
  matchText: { flex: 1 },
  matchTitle: { fontSize: 17, fontWeight: '700', marginBottom: spacing.xs },
  pill: { borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' },
  pillNumber: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  pillLabel: { fontSize: 10, fontWeight: '600', marginTop: -2 },
  barWrap: { marginTop: spacing.sm, marginBottom: spacing.xs },
  track: { height: 10, borderRadius: radius.pill, justifyContent: 'center' },
  middle: { position: 'absolute', left: '25%', width: '50%', top: 0, bottom: 0 },
  marker: { position: 'absolute', width: 16, height: 16, marginLeft: -8, borderRadius: 8, borderWidth: 2 },
  ticks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  tick: { fontSize: 11 },
  row: { paddingVertical: spacing.md },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md, marginBottom: 4 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowValue: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  rowStatus: { fontSize: 13 },
  body: { fontSize: 15, lineHeight: 22 },
  small: { fontSize: 12, lineHeight: 17, marginTop: spacing.xs },
});
