import { Link, Redirect, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Icon, type IconName } from '@/components/Icon';
import { PromptCard } from '@/components/PromptCard';
import { useProfile } from '@/components/ProfileContext';
import { SchoolBadge } from '@/components/SchoolBadge';
import { fonts, radius, rules, shadow, spacing, type, useTheme } from '@/constants/theme';
import { colleges } from '@/data/colleges';
import { alignWithCollege, matchBasis } from '@/lib/admissions';

// Green for finding and filling in, gold for your own lists.
const ACTIONS: { label: string; icon: IconName; href: Href; tone: 'green' | 'gold' }[] = [
  { label: 'My profile', icon: 'person', href: '/profile', tone: 'green' },
  { label: 'College search', icon: 'search', href: '/search', tone: 'green' },
  { label: 'Compare schools', icon: 'compare', href: '/compare', tone: 'gold' },
  { label: 'Saved schools', icon: 'heart', href: '/search?filter=saved', tone: 'gold' },
];

// The home screen: a feature card that leads to your profile (or your top
// match once you have one), four quick actions, and the schools in the app.
export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, ready, seenWelcome } = useProfile();

  if (!seenWelcome) return <Redirect href="/welcome" />;

  const ranked = colleges
    .map((c) => {
      const match = ready ? alignWithCollege(profile, c).match : null;
      return { college: c, score: match?.score ?? null, basis: match ? matchBasis(match) : null };
    })
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.college.name.localeCompare(b.college.name));

  return (
    <ScrollView
      style={{ backgroundColor: theme.paper }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.hello, { color: theme.ink }]} accessibilityRole="header">
            Code-Sync
          </Text>
          <Text style={[styles.sub, { color: theme.muted }]}>Virginia college admissions, from official data</Text>
        </View>
        <BrandMark size={44} color={theme.gold} trackColor={theme.rule2} ink={theme.accent} />
      </View>

      <View style={styles.featurePress}>
        <PromptCard
          href={ready ? '/search' : '/profile'}
          title={ready ? 'Your Academic Match is ready' : 'Find your best fit'}
          body={
            ready
              ? 'See how your numbers compare at each Virginia school, sorted by match.'
              : 'Add your GPA, test scores or class rank to see how you compare at Virginia colleges.'
          }
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.ink }]}>Quick actions</Text>
      <View style={styles.actions}>
        {ACTIONS.map((a) => (
          <Link key={a.label} href={a.href} asChild>
            <Pressable accessibilityRole="link" style={styles.action}>
              {({ pressed }) => (
                <>
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: pressed ? theme.paper2 : a.tone === 'gold' ? theme.goldSoft : theme.accentSoft },
                    ]}>
                    <Icon name={a.icon} color={a.tone === 'gold' ? theme.goldText : theme.accent} size={24} />
                  </View>
                  <Text style={[styles.actionLabel, { color: theme.ink2 }]}>{a.label}</Text>
                </>
              )}
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.listHead}>
        <Text style={[styles.sectionTitle, styles.listTitle, { color: theme.ink }]}>
          {ready ? 'Your top matches' : 'Colleges'}
        </Text>
        <Link href="/search" style={[styles.seeAll, { color: theme.accent }]}>
          See all
        </Link>
      </View>
      <View style={[styles.list, { backgroundColor: theme.sheet }]}>
        {ranked.slice(0, 3).map(({ college, score, basis }, i) => (
          <Link key={college.id} href={{ pathname: '/college/[id]', params: { id: college.id } }} asChild>
            <Pressable accessibilityRole="link">
              {({ pressed }) => (
                <View
                  style={[
                    styles.row,
                    { backgroundColor: pressed ? theme.paper2 : 'transparent' },
                    i > 0 && { borderTopColor: theme.rule, borderTopWidth: rules.hair },
                  ]}>
                  <SchoolBadge collegeId={college.id} size={38} />
                  <View style={styles.rowText}>
                    <Text style={[styles.rowName, { color: theme.ink }]}>{college.name}</Text>
                    <Text style={[styles.rowMeta, { color: score === null ? theme.muted : theme.accent }]}>
                      {score === null ? `${college.city}, VA` : basis ? `Match ${score} · ${basis}` : `Match ${score}`}
                    </Text>
                  </View>
                  <Icon name="chevron" color={theme.muted} size={16} />
                </View>
              )}
            </Pressable>
          </Link>
        ))}
      </View>

      <Link href="/about" style={[styles.about, { color: theme.muted }]}>
        About the data and sources
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  headerText: { flex: 1 },
  hello: { fontFamily: fonts.display, fontSize: type.xxl, letterSpacing: -0.5 },
  sub: { fontFamily: fonts.body, fontSize: type.sm, marginTop: 2 },
  featurePress: { marginBottom: spacing.xl },
  sectionTitle: { fontFamily: fonts.display, fontSize: type.lg, marginBottom: spacing.md },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  action: { width: '23%', alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', boxShadow: shadow.soft },
  actionLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, textAlign: 'center', marginTop: spacing.sm },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  listTitle: { marginBottom: 0 },
  seeAll: { fontFamily: fonts.control, fontSize: type.sm, paddingVertical: 14, paddingLeft: spacing.lg },
  // A full-width white band, rows split by faint lines.
  list: { marginHorizontal: -spacing.lg, boxShadow: shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  rowText: { flex: 1 },
  rowName: { fontFamily: fonts.control, fontSize: type.md },
  rowMeta: { fontFamily: fonts.bodyMedium, fontSize: type.sm, marginTop: 2 },
  about: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    textDecorationLine: 'underline',
  },
});
