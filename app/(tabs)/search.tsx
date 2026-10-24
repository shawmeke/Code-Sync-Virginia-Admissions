import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { CollegeCard } from '@/components/CollegeCard';
import { Icon } from '@/components/Icon';
import { PromptCard } from '@/components/PromptCard';
import { Segmented } from '@/components/Controls';
import { useProfile } from '@/components/ProfileContext';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';
import { colleges } from '@/data/colleges';
import { alignWithCollege } from '@/lib/admissions';
import { filterColleges, type CollegeFilter } from '@/lib/collegeFilter';
import type { College } from '@/types/college';

type ControlFilter = CollegeFilter;
type SortOrder = 'match' | 'name';

const FILTERS: { key: ControlFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'public', label: 'Public' },
  { key: 'private', label: 'Private' },
  { key: 'saved', label: 'Saved' },
];

const SORTS: { key: SortOrder; label: string }[] = [
  { key: 'match', label: 'Best match' },
  { key: 'name', label: 'A–Z' },
];

export default function CollegesScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  // The Home screen's "Saved schools" opens this list already filtered.
  const params = useLocalSearchParams<{ filter?: string }>();
  const [filter, setFilter] = useState<ControlFilter>(params.filter === 'saved' ? 'saved' : 'all');
  // The tab stays mounted, so follow the link's filter each time it arrives,
  // not only on first open.
  useEffect(() => {
    if (params.filter === 'saved') setFilter('saved');
  }, [params.filter]);
  const chooseFilter = (k: ControlFilter) => {
    setFilter(k);
    // Clear the link's filter once the student picks another, so the next
    // tap on "Saved schools" changes it again.
    router.setParams({ filter: k === 'saved' ? 'saved' : undefined });
  };
  const [sort, setSort] = useState<SortOrder>('match');
  const { profile, ready, saved } = useProfile();

  const results = useMemo(() => {
    // Colleges with no Academic Match go last when sorting by match.
    const score = (c: College) => (ready ? (alignWithCollege(profile, c).match?.score ?? -1) : -1);
    return filterColleges(colleges, { query, filter, saved })
      .sort((a, b) =>
        ready && sort === 'match' ? score(b) - score(a) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name),
      );
  }, [query, filter, sort, profile, ready, saved]);

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
            <View style={styles.promptPress}>
              <PromptCard
                href="/profile"
                title="See how you compare"
                body="Add your GPA, test scores or class rank to get an Academic Match for each college."
              />
            </View>
          )}
          <View style={[styles.searchWrap, { backgroundColor: theme.sheet, borderColor: theme.rule2 }]}>
          <Icon name="search" color={theme.muted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or city"
            placeholderTextColor={theme.muted}
            accessibilityLabel="Search colleges by name or city"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
            selectionColor={theme.accent}
            style={[styles.search, { color: theme.ink }]}
          />
          </View>
          <View style={styles.controls}>
            <Segmented
              label="Filter colleges"
              options={FILTERS}
              selected={filter}
              onSelect={(k) => chooseFilter(k as ControlFilter)}
            />
            {ready && (
              <Segmented label="Sort colleges" options={SORTS} selected={sort} onSelect={(k) => setSort(k as SortOrder)} />
            )}
          </View>
          <View style={styles.ledgerHead}>
            <Text style={[styles.ledgerLabel, { color: theme.muted }]}>
              {results.length} {results.length === 1 ? 'college' : 'colleges'}
            </Text>
            {ready && <Text style={[styles.ledgerLabel, { color: theme.muted }]}>Your match</Text>}
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.muted }]}>
          {filter === 'saved' && !query
            ? 'No saved schools yet. Tap the heart on a college page to save it. Saved schools last until you close the app.'
            : filter === 'private' && !query
              ? 'No private colleges have been added yet.'
              : 'No colleges match your search.'}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 720, width: '100%', alignSelf: 'center' },
  intro: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.5, marginBottom: spacing.lg },
  promptPress: { marginBottom: spacing.lg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: rules.hair,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
  },
  search: { flex: 1, paddingVertical: 12, fontFamily: fonts.body, fontSize: type.md },
  controls: { gap: spacing.sm, marginTop: spacing.md },
  ledgerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  ledgerLabel: { fontFamily: fonts.bodyMedium, fontSize: type.sm },
  empty: { textAlign: 'center', marginTop: spacing.xl, fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5 },
});
