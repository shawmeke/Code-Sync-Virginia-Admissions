import { StyleSheet, Text, View } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import { radius, spacing, useTheme } from '@/constants/theme';
import type { Source } from '@/types/college';

export function SourceList({ sources }: { sources: Source[] }) {
  const theme = useTheme();

  if (sources.length === 0) {
    return <Text style={[styles.empty, { color: theme.textMuted }]}>No sources recorded yet.</Text>;
  }

  return (
    <View>
      {sources.map((s, i) => (
        <View
          key={s.id}
          style={[
            styles.row,
            i < sources.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
          ]}>
          <Text style={[styles.title, { color: theme.text }]}>{s.title}</Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {s.publisher} · {s.academicYear}
          </Text>
          {s.url ? (
            <ExternalLink href={s.url} style={[styles.link, { color: theme.primary }]}>
              View source document
            </ExternalLink>
          ) : null}
          {s.needsVerification && (
            <View style={[styles.badge, { backgroundColor: theme.warningSurface }]}>
              <Text style={[styles.badgeText, { color: theme.warning }]}>Not yet checked against the original document</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md, gap: 3 },
  title: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12 },
  link: { fontSize: 13, marginTop: 2 },
  badge: { alignSelf: 'flex-start', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3, marginTop: spacing.xs },
  badgeText: { fontSize: 11, fontWeight: '600' },
  empty: { paddingVertical: spacing.md, fontSize: 14 },
});
