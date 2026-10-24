import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GpaBands } from '@/components/GpaBands';
import { Section } from '@/components/Section';
import { SourceList } from '@/components/SourceList';
import { StatRow } from '@/components/StatRow';
import { radius, spacing, useTheme } from '@/constants/theme';
import { getCollege, sourcesForCollege } from '@/data/colleges';
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
  const college = getCollege(id);

  if (!college) {
    return (
      <View style={[styles.missing, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={[styles.body, { color: theme.text }]}>This college isn't in the app.</Text>
      </View>
    );
  }

  const control = college.control === 'public' ? 'Public' : 'Private';
  const rank = college.classRank;
  const gpaKnown = college.gpaAverage || college.gpaBands;

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: college.name }} />

      <View style={styles.hero}>
        <Text style={[styles.name, { color: theme.text }]} accessibilityRole="header">
          {college.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {college.city}, Virginia · {control}
        </Text>
        <View style={styles.tags}>
          <Tag text={TEST_POLICY_LABELS[college.testPolicy]} />
          <Tag text={`Figures for ${college.cycle}`} />
        </View>
      </View>

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
            <Text style={[styles.blockTitle, { color: theme.text }]}>Share of students in each GPA range</Text>
            <GpaBands bands={college.gpaBands.value} />
            <Text style={[styles.small, { color: theme.textMuted }]}>{college.gpaBands.cohort}</Text>
            {college.gpaBands.note && (
              <Text style={[styles.small, { color: theme.textMuted }]}>{college.gpaBands.note}</Text>
            )}
          </View>
        )}
        {gpaKnown && (
          <Text style={[styles.small, styles.footnote, { color: theme.textMuted }]}>{GPA_SCALE_NOTES[college.gpaScale]}</Text>
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
              <Text style={[styles.blockTitle, { color: theme.text }]}>{p.program}</Text>
              <Text style={[styles.body, { color: theme.text }]}>{p.note}</Text>
            </View>
          ))}
        </Section>
      )}

      {college.notes.length > 0 && (
        <Section title="Good to know">
          {college.notes.map((n) => (
            <Text key={n} style={[styles.body, styles.block, { color: theme.text }]}>
              {n}
            </Text>
          ))}
        </Section>
      )}

      <Section title="Sources">
        <SourceList sources={sourcesForCollege(college)} />
      </Section>

      <Text style={[styles.small, { color: theme.textMuted }]}>
        These figures describe students from a past admissions cycle. They are not cutoffs, and they can't tell you
        whether you will be admitted.
      </Text>
    </ScrollView>
  );
}

function Tag({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: theme.surfaceMuted }]}>
      <Text style={[styles.tagText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  missing: { flex: 1, padding: spacing.lg },
  hero: { marginBottom: spacing.xl },
  name: { fontSize: 26, fontWeight: '800' },
  meta: { fontSize: 15, marginTop: spacing.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  tag: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '600' },
  block: { paddingVertical: spacing.md },
  blockTitle: { fontSize: 15, fontWeight: '600', marginBottom: spacing.xs },
  body: { fontSize: 15, lineHeight: 22 },
  small: { fontSize: 12, lineHeight: 17, marginTop: spacing.xs },
  footnote: { paddingBottom: spacing.md },
});
