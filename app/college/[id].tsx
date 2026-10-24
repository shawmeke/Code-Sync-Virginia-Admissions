import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AlignmentDots } from '@/components/AlignmentDots';
import { MatchScore, MetricRow } from '@/components/Comparison';
import { Button } from '@/components/Controls';
import { ExternalLink } from '@/components/ExternalLink';
import { GpaBands } from '@/components/GpaBands';
import { Icon } from '@/components/Icon';
import { useProfile } from '@/components/ProfileContext';
import { SchoolBadge } from '@/components/SchoolBadge';
import { Section } from '@/components/Section';
import { SourceList } from '@/components/SourceList';
import { StatRow } from '@/components/StatRow';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';
import { getCollege, sourcesForCollege } from '@/data/colleges';
import { campusPhotos } from '@/data/photos';
import { alignWithCollege, describeAlignment, type MetricResult } from '@/lib/admissions';
import { formatCount, formatPercent, formatRange, TEST_POLICY_LABELS } from '@/lib/format';
import type { ClassRankProfile, GpaScale } from '@/types/college';

const GPA_SCALE_NOTES: Record<GpaScale, string> = {
  weighted:
    "These appear to include weighted GPAs: the average or the top group is above 4.0. The college doesn't say which it reports.",
  unweighted: 'These are unweighted GPAs on a 4.0 scale.',
  unknown: "The college doesn't say whether these GPAs are weighted or unweighted.",
};

type Tab = 'overview' | 'admissions' | 'sources';
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'sources', label: 'Sources' },
];

const showPercent = (n: number | null) => (n === null ? 'Not available' : formatPercent(n));

export default function CollegeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { profile, ready, saved, toggleSaved } = useProfile();
  const [tab, setTab] = useState<Tab>('overview');
  const { width, height } = useWindowDimensions();
  // In landscape the photo would fill the screen, so it gets shorter.
  const photoHeight = width > height ? Math.min(210, Math.round(height * 0.35)) : 210;
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
  const photo = campusPhotos[college.id];
  const isSaved = saved.includes(college.id);
  const alignment = ready ? alignWithCollege(profile, college) : null;
  // Hide measures the student left blank, except the SAT row when no test was
  // entered at all, since it explains the college's testing policy.
  const shown = (m: MetricResult) =>
    m.status !== 'student-missing' || (m.metric === 'sat' && profile.sat === null && profile.act === null);
  const metrics = alignment?.metrics.filter(shown) ?? [];
  const saveLabel = isSaved ? `Remove ${college.name} from saved schools` : `Save ${college.name}`;

  return (
    <ScrollView style={{ backgroundColor: theme.paper }} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: 'College details',
          // The web's built-in back arrow is a 30px target; this one is 44.
          // Phones keep the system back button and its swipe gesture.
          ...(Platform.OS === 'web' && {
            headerLeft: () => (
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/search'))}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={styles.headerButton}>
                <Icon name="back" color={theme.ink} size={24} />
              </Pressable>
            ),
          }),
          headerRight: () => (
            <Pressable
              onPress={() => toggleSaved(college.id)}
              accessibilityRole="button"
              accessibilityLabel={saveLabel}
              style={styles.headerButton}>
              <Icon name={isSaved ? 'heartFilled' : 'heart'} color={theme.accent} size={24} />
            </Pressable>
          ),
        }}
      />

      {photo && (
        <View>
          <Image
            source={photo.image}
            style={[styles.photo, { height: photoHeight }]}
            resizeMode="cover"
            accessibilityLabel={`${photo.title}. Photo by ${photo.artist}.`}
          />
        </View>
      )}

      <View style={[styles.hero, photo && styles.heroOverlap]}>
        <View style={[styles.badgeRing, { backgroundColor: theme.paper }]}>
          <SchoolBadge collegeId={college.id} size={64} />
        </View>
        <Text style={[styles.name, { color: theme.ink }]} accessibilityRole="header">
          {college.name}
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          {control} · {college.city}, Virginia · {TEST_POLICY_LABELS[college.testPolicy]} · Figures for {college.cycle}
        </Text>
        {photo && (
          <Text style={[styles.credit, { color: theme.muted }]}>
            Photo: {photo.artist}, {photo.license}, via Wikimedia Commons
          </Text>
        )}
      </View>

      {alignment ? (
        <View style={[styles.matchCard, { backgroundColor: theme.sheet }]}>
          {alignment.match ? (
            <>
              <MatchScore match={alignment.match} collegeName={college.name} />
              <AlignmentDots score={alignment.match.score} />
            </>
          ) : (
            <Text style={[styles.body, { color: theme.ink2 }]}>
              {college.name} doesn't publish enough figures to estimate an Academic Match from what you entered.
            </Text>
          )}
        </View>
      ) : (
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="link" style={styles.promptPress}>
            {({ pressed }) => (
              <View style={[styles.prompt, { backgroundColor: theme.hero, opacity: pressed ? 0.9 : 1 }]}>
                <View style={styles.promptText}>
                  <Text style={[styles.promptTitle, { color: theme.heroInk }]}>See how you compare</Text>
                  <Text style={[styles.promptBody, { color: theme.heroMuted }]}>
                    Add your profile to see where your numbers fall among {college.name}'s students.
                  </Text>
                </View>
                <View style={[styles.promptArrow, { backgroundColor: theme.goldFill }]}>
                  <Icon name="chevron" color={theme.goldInk} size={16} />
                </View>
              </View>
            )}
          </Pressable>
        </Link>
      )}

      <View style={[styles.tabs, { borderBottomColor: theme.rule }]} accessibilityRole="tablist">
        {TABS.map((t) => {
          const selected = t.key === tab;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.tab, selected && { borderBottomColor: theme.accent }]}>
              <Text style={[styles.tabText, { color: selected ? theme.accent : theme.muted }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.pad}>
      {tab === 'overview' &&
        (alignment ? (
          <Section title="How you compare">
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
          <Section title="At a glance">
            <StatRow label="Offer rate" stat={college.offerRate} format={formatPercent} icon="percent" />
            <StatRow label="SAT middle 50%" stat={college.sat} format={formatRange} icon="pencil" />
            <StatRow label="ACT middle 50%" stat={college.act} format={formatRange} icon="pencil" last />
          </Section>
        ))}

      {tab === 'admissions' && (
        <>
          <Section title="Applications">
            <StatRow label="Applicants" stat={college.applicants} format={formatCount} icon="people" />
            <StatRow label="Offers of admission" stat={college.admitted} format={formatCount} icon="envelope" />
            <StatRow label="Enrolled first-years" stat={college.enrolled} format={formatCount} icon="graduation" />
            <StatRow label="Offer rate" stat={college.offerRate} format={formatPercent} icon="percent" last />
          </Section>

          <Section title="Test scores (middle 50%)">
            <StatRow label="SAT total" stat={college.sat} format={formatRange} icon="pencil" />
            <StatRow label="ACT composite" stat={college.act} format={formatRange} icon="pencil" />
            <StatRow label="Submitted SAT" stat={college.satSubmitShare} format={formatPercent} icon="doc" />
            <StatRow label="Submitted ACT" stat={college.actSubmitShare} format={formatPercent} icon="doc" last />
          </Section>

          <Section title="High school GPA">
            <StatRow
              label="Average GPA"
              stat={college.gpaAverage}
              format={(v) => v.toFixed(2)}
              icon="chart"
              last={!college.gpaBands}
            />
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
            <StatRow<ClassRankProfile> label="In top 10% of class" stat={rank} format={(r) => showPercent(r.topTenth)} icon="rank" />
            <StatRow<ClassRankProfile> label="In top 25% of class" stat={rank} format={(r) => showPercent(r.topQuarter)} icon="rank" />
            <StatRow<ClassRankProfile> label="In top 50% of class" stat={rank} format={(r) => showPercent(r.topHalf)} icon="rank" />
            <StatRow<ClassRankProfile>
              label="Students who reported a rank"
              stat={rank}
              format={(r) => showPercent(r.reportedShare)}
              icon="people"
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
        </>
      )}

      {tab === 'sources' && (
        <>
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
          {photo && (
            <Section title="Photo">
              <View style={styles.block}>
                <Text style={[styles.body, { color: theme.ink2 }]}>
                  {photo.title}, by {photo.artist}. Licensed {photo.license}.
                </Text>
                <ExternalLink href={photo.page} style={[styles.link, { color: theme.accent }]}>
                  View on Wikimedia Commons
                </ExternalLink>
              </View>
            </Section>
          )}
        </>
      )}

      </View>

      <View style={styles.save}>
        <Button label={isSaved ? 'Saved' : 'Save school'} variant={isSaved ? 'secondary' : 'primary'} onPress={() => toggleSaved(college.id)} />
        <Text style={[styles.saveNote, { color: theme.muted }]}>
          {isSaved
            ? 'Find it under Saved in Search. Saved schools clear when you close the app.'
            : 'Saved schools stay in your list until you close the app.'}
        </Text>
      </View>

      <Text style={[styles.small, styles.disclaimer, { color: theme.muted }]}>
        These figures describe students from a past admissions cycle. They are not cutoffs, and they can't tell you
        whether you will be admitted.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl * 2, maxWidth: 720, width: '100%', alignSelf: 'center' },
  missing: { flex: 1, padding: spacing.lg },
  photo: { width: '100%' },
  headerButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  credit: { fontFamily: fonts.body, fontSize: 11, marginTop: spacing.xs },
  hero: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  heroOverlap: { marginTop: -44 },
  badgeRing: { alignSelf: 'flex-start', borderRadius: 40, padding: 4 },
  name: { fontFamily: fonts.display, fontSize: type.xxl, letterSpacing: -0.5, marginTop: spacing.sm },
  meta: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: spacing.xs },
  matchCard: { marginBottom: spacing.lg, padding: spacing.lg },
  promptPress: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  prompt: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.card, padding: spacing.lg },
  promptText: { flex: 1 },
  promptTitle: { fontFamily: fonts.display, fontSize: type.lg },
  promptBody: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: 4 },
  promptArrow: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.lg, marginBottom: spacing.lg, borderBottomWidth: rules.hair },
  tab: { paddingVertical: spacing.md, marginRight: spacing.xl, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabText: { fontFamily: fonts.control, fontSize: type.md },
  block: { paddingVertical: spacing.md },
  blockTitle: { fontFamily: fonts.control, fontSize: type.md, marginBottom: spacing.xs },
  body: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5 },
  small: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.xs },
  footnote: { paddingVertical: spacing.md, borderBottomWidth: rules.hair },
  gpaNote: { paddingBottom: spacing.md },
  disclaimer: { paddingHorizontal: spacing.lg },
  pad: { paddingHorizontal: spacing.lg },
  link: { fontFamily: fonts.control, fontSize: type.sm, marginTop: spacing.xs, textDecorationLine: 'underline' },
  save: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  saveNote: { fontFamily: fonts.body, fontSize: type.xs, textAlign: 'center', marginTop: spacing.sm },
});
