import { Link, Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CollegeCard } from '@/components/CollegeCard';
import { Segmented } from '@/components/Controls';
import { useProfile } from '@/components/ProfileContext';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';
import { colleges } from '@/data/colleges';
import { alignWithCollege } from '@/lib/admissions';
import type { College } from '@/types/college';

type ControlFilter = 'all' | College['control'];
type SortOrder = 'match' | 'name';

const FILTERS: { key: ControlFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'public', label: 'Public' },
  { key: 'private', label: 'Private' },
];

const SORTS: { key: SortOrder; label: string }[] = [
  { key: 'match', label: 'Best match' },
  { key: 'name', label: 'A–Z' },
];

export default function CollegesScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ControlFilter>('all');
  const [sort, setSort] = useState<SortOrder>('match');
  const { profile, ready, seenWelcome } = useProfile();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Colleges with no Academic Match go last when sorting by match.
    const score = (c: College) => (ready ? (alignWithCollege(profile, c).match?.score ?? -1) : -1);
    return colleges
      .filter((c) => filter === 'all' || c.control === filter)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
      .sort((a, b) =>
        ready && sort === 'match' ? score(b) - score(a) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name),
      );
  }, [query, filter, sort, profile, ready]);

  if (!seenWelcome) return <Redirect href="/welcome" />;

  return (
    <FlatList
      style={{ backgroundColor: theme.paper }}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => <CollegeCard college={item} />}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View>
          <Text style={[styles.intro, { color: theme.ink2 }]}>
            Published admissions figures for Virginia colleges, with the source and year for each number. Score ranges
            show the middle 50% of students.
          </Text>
          {!ready && (
            <Link href="/profile" asChild>
              <Pressable accessibilityRole="link" style={styles.promptPress}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.prompt,
                      { backgroundColor: pressed ? theme.paper2 : theme.sheet, borderTopColor: theme.accent },
                    ]}>
                    <Text style={[styles.promptTitle, { color: theme.ink }]}>See how you compare</Text>
                    <Text style={[styles.promptBody, { color: theme.ink2 }]}>
                      Add your GPA, test scores or class rank to get an Academic Match for each college.
                    </Text>
                  </View>
                )}
              </Pressable>
            </Link>
          )}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or city"
            placeholderTextColor={theme.muted}
            accessibilityLabel="Search colleges by name or city"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
            style={[styles.search, { backgroundColor: theme.sheet, borderColor: theme.muted, color: theme.ink }]}
          />
          <View style={styles.controls}>
            <Segmented
              label="Filter colleges"
              options={FILTERS}
              selected={filter}
              onSelect={(k) => setFilter(k as ControlFilter)}
            />
            {ready && (
              <Segmented label="Sort colleges" options={SORTS} selected={sort} onSelect={(k) => setSort(k as SortOrder)} />
            )}
          </View>
          <View style={[styles.ledgerHead, { borderBottomColor: theme.ink }]}>
            <Text style={[styles.ledgerLabel, { color: theme.muted }]}>
              {results.length} {results.length === 1 ? 'college' : 'colleges'}
            </Text>
            {ready && <Text style={[styles.ledgerLabel, { color: theme.muted }]}>Your match</Text>}
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.muted }]}>
          {filter === 'private' && !query
            ? 'No private colleges have been added yet.'
            : 'No colleges match your search.'}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  intro: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5, marginBottom: spacing.lg },
  promptPress: { marginBottom: spacing.lg },
  prompt: { padding: spacing.md, borderTopWidth: rules.bar },
  promptTitle: { fontFamily: fonts.display, fontSize: type.lg },
  promptBody: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.45, marginTop: 2 },
  search: {
    borderWidth: rules.hair,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: type.md,
  },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  ledgerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    borderBottomWidth: rules.bar,
  },
  ledgerLabel: { fontFamily: fonts.bodyMedium, fontSize: type.sm },
  empty: { textAlign: 'center', marginTop: spacing.xl, fontFamily: fonts.body, fontSize: type.md },
});
