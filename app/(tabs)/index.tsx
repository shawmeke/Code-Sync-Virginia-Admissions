import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CollegeCard } from '@/components/CollegeCard';
import { radius, spacing, useTheme } from '@/constants/theme';
import { colleges } from '@/data/colleges';
import type { College } from '@/types/college';

type ControlFilter = 'all' | College['control'];

const FILTERS: { key: ControlFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'public', label: 'Public' },
  { key: 'private', label: 'Private' },
];

export default function CollegesScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ControlFilter>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return colleges
      .filter((c) => filter === 'all' || c.control === filter)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, filter]);

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => <CollegeCard college={item} />}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.intro, { color: theme.textMuted }]}>
            Published admissions figures for Virginia colleges, with the source and year for each number. Score ranges show the middle 50% of students.
          </Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or city"
            placeholderTextColor={theme.textMuted}
            accessibilityLabel="Search colleges by name or city"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
            style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />
          <View style={styles.filters} accessibilityRole="radiogroup">
            {FILTERS.map((f) => {
              const selected = f.key === filter;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  accessibilityRole="radio"
                  accessibilityLabel={f.label}
                  accessibilityState={{ selected }}
                  style={[
                    styles.chip,
                    selected
                      ? { backgroundColor: theme.primary, borderColor: theme.primary }
                      : { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}>
                  <Text style={[styles.chipText, { color: selected ? theme.onPrimary : theme.text }]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.count, { color: theme.textMuted }]}>
            {results.length} {results.length === 1 ? 'college' : 'colleges'}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.textMuted }]}>
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
  header: { marginBottom: spacing.md },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  search: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 16 },
  filters: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6 },
  chipText: { fontSize: 14, fontWeight: '600' },
  count: { fontSize: 13, marginTop: spacing.md },
  empty: { textAlign: 'center', marginTop: spacing.xl, fontSize: 15 },
});
