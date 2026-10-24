import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MatchScore, MetricRow } from '@/components/Comparison';
import { GpaBands } from '@/components/GpaBands';
import { useProfile } from '@/components/ProfileContext';
import { Section } from '@/components/Section';
import { SourceList } from '@/components/SourceList';
import { StatRow } from '@/components/StatRow';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import { getCollege, sourcesForCollege } from '@/data/colleges';
import { alignWithCollege, describeAlignment, type MetricResult } from '@/lib/admissions';
import { formatCount, formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { ClassRankProfile, GpaScale } from '@/types/college';

const GPA_SCALE_NOTES: Record<GpaScale, string> = {
  weighted: 'These are weighted GPAs.',
  unweighted: 'These are unweighted GPAs on a 4.0 scale.',
  unknown: "The college doesn't say whether these GPAs are weighted or unweighted.",
};

const showPercent = (n: number | null) => (n === null ? 'Not available' : formatPercent(n));

export default function CollegeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { profile, ready } = useProfile();
  const college = getCollege(id);

  if (!college) {
    return (
      <View style={[styles.missing, { backgroundColor: theme.paper }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={[styles.body, { color: theme.ink2 }]}>This college isn't in the app.</Text>
      </View>
    );
  }

  const control = college.control === 'public' ? 'Public' : 'Private';
  const rank = college.classRank;
  const gpaKnown = college.gpaAverage || college.gpaBands;
  const alignment = ready ? alignWithCollege(profile, college) : null;
  // Hide measures the student left blank, except the SAT row when no test was
  // entered at all, since it explains the college's testing policy.
  const shown = (m: MetricResult) =>
    m.status !== 'student-missing' || (m.metric === 'sat' && profile.sat === null && profile.act === null);
  const metrics = alignment?.metrics.filter(shown) ?? [];

  return (
    <ScrollView style={{ backgroundColor: theme.paper }} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: college.name }} />

      <View style={styles.hero}>
        <Text style={[styles.name, { color: theme.ink }]} accessibilityRole="header">
          {college.name}
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          {college.city}, Virginia. {control} university.
        </Text>
        <View style={[styles.facts, { borderTopColor: theme.rule2 }]}>
          <Fact label="Testing" value={TEST_POLICY_LABELS[college.testPolicy]} />
          <Fact label="Figures for" value={college.cycle} />
        </View>
      </View>

      {alignment ? (
        <Section title="How you compare" sheet>
          {alignment.match ? (
            <MatchScore match={alignment.match} collegeName={college.name} />
          ) : (
            <Text style={[styles.body, styles.block, { color: theme.ink2 }]}>
              {college.name} doesn't publish enough figures to estimate an Academic Match from what you entered.
            </Text>
          )}
          <Text style={[styles.small, styles.footnote, { color: theme.muted, borderBottomColor: theme.rule }]}>
            {describeAlignment(alignment)}
          </Text>
          {metrics.map((m, i) => (
            <MetricRow
              key={m.metric}
              metric={m}
              last={i === metrics.length - 1 && !alignment.contextNotes.length && !alignment.programNotes.length}
            />
          ))}
          {[...alignment.programNotes.map((p) => `${p.program}: ${p.note}`), ...alignment.contextNotes].map((n, i) => (
            <Text key={`${i}-${n}`} style={[styles.body, styles.block, { color: theme.ink2 }]}>
              {n}
            </Text>
          ))}
        </Section>
      ) : (
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="link" style={styles.promptPress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.prompt,
                  { backgroundColor: pressed ? theme.paper2 : theme.sheet, borderTopColor: theme.accent },
                ]}>
                <Text style={[styles.blockTitle, { color: theme.ink }]}>See how you compare</Text>
                <Text style={[styles.body, { color: theme.ink2 }]}>
                  Add your profile to see where your numbers fall among {college.name}'s students.
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      )}

      <Section title="Applications">
        <StatRow label="Applicants" stat={college.applicants} format={formatCount} />
        <StatRow label="Offers of admission" stat={college.admitted} format={formatCount} />
        <StatRow label="Enrolled first-years" stat={college.enrolled} format={formatCount} />
        <StatRow label="Offer rate" stat={college.offerRate} format={formatPercent} last />
      </Section>

      <Section title="Test scores (middle 50%)">
        <StatRow label="SAT total" stat={college.sat} format={formatRange} />
        <StatRow label="ACT composite" stat={college.act} format={formatRange} />
        <StatRow label="Submitted SAT" stat={college.satSubmitShare} format={formatPercent} />
        <StatRow label="Submitted ACT" stat={college.actSubmitShare} format={formatPercent} last />
      </Section>

      <Section title="High school GPA">
        <StatRow label="Average GPA" stat={college.gpaAverage} format={(v) => v.toFixed(2)} last={!college.gpaBands} />
        {college.gpaBands && (
          <View style={styles.block}>
            <Text style={[styles.blockTitle, { color: theme.ink }]}>Share of students in each GPA range</Text>
            <GpaBands bands={college.gpaBands.value} />
            <Text style={[styles.small, { color: theme.muted }]}>{college.gpaBands.cohort}</Text>
            {college.gpaBands.note && <Text style={[styles.small, { color: theme.muted }]}>{college.gpaBands.note}</Text>}
          </View>
        )}
        {gpaKnown && (
          <Text style={[styles.small, styles.gpaNote, { color: theme.muted }]}>{GPA_SCALE_NOTES[college.gpaScale]}</Text>
        )}
      </Section>

      <Section title="Class rank">
        <StatRow<ClassRankProfile> label="In top 10% of class" stat={rank} format={(r) => showPercent(r.topTenth)} />
        <StatRow<ClassRankProfile> label="In top 25% of class" stat={rank} format={(r) => showPercent(r.topQuarter)} />
        <StatRow<ClassRankProfile> label="In top 50% of class" stat={rank} format={(r) => showPercent(r.topHalf)} />
        <StatRow<ClassRankProfile>
          label="Students who reported a rank"
          stat={rank}
          format={(r) => showPercent(r.reportedShare)}
          last
        />
      </Section>

      {college.programNotes.length > 0 && (
        <Section title="Program-specific notes">
          {college.programNotes.map((p) => (
            <View key={p.program} style={styles.block}>
              <Text style={[styles.blockTitle, { color: theme.ink }]}>{p.program}</Text>
              <Text style={[styles.body, { color: theme.ink2 }]}>{p.note}</Text>
            </View>
          ))}
        </Section>
      )}

      {college.notes.length > 0 && (
        <Section title="Good to know">
          {college.notes.map((n, i) => (
            <Text key={`${i}-${n}`} style={[styles.body, styles.block, { color: theme.ink2 }]}>
              {n}
            </Text>
          ))}
        </Section>
      )}

      <Section title="Sources">
        <SourceList sources={sourcesForCollege(college)} />
      </Section>

      <Text style={[styles.small, { color: theme.muted }]}>
        These figures describe students from a past admissions cycle. They are not cutoffs, and they can't tell you
        whether you will be admitted.
      </Text>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.fact, { borderBottomColor: theme.rule }]}>
      <Text style={[styles.factLabel, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.factValue, { color: theme.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 680, width: '100%', alignSelf: 'center' },
  missing: { flex: 1, padding: spacing.lg },
  hero: { marginBottom: spacing.xl + spacing.sm },
  name: { fontFamily: fonts.display, fontSize: type.display, lineHeight: type.display * 1.05, letterSpacing: -0.8 },
  meta: { fontFamily: fonts.body, fontSize: type.md, marginTop: spacing.xs },
  facts: { marginTop: spacing.lg, borderTopWidth: rules.bar },
  fact: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: rules.hair },
  factLabel: { fontFamily: fonts.body, fontSize: type.md },
  factValue: { fontFamily: fonts.bodyMedium, fontSize: type.md },
  block: { paddingVertical: spacing.md },
  blockTitle: { fontFamily: fonts.display, fontSize: type.md, marginBottom: spacing.xs },
  body: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5 },
  small: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.xs },
  footnote: { paddingBottom: spacing.md, borderBottomWidth: rules.hair },
  gpaNote: { paddingBottom: spacing.md },
  promptPress: { marginBottom: spacing.xl },
  prompt: { padding: spacing.md, borderTopWidth: rules.bar },
});
