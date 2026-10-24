import { StyleSheet, Text, View } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import type { Source } from '@/types/college';

export function SourceList({ sources }: { sources: Source[] }) {
  const theme = useTheme();

  if (sources.length === 0) {
    return <Text style={[styles.empty, { color: theme.muted }]}>No sources recorded yet.</Text>;
  }

  return (
    <View>
      {sources.map((s, i) => (
        <View
          key={s.id}
          style={[styles.row, i < sources.length - 1 && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair }]}>
          <Text style={[styles.title, { color: theme.ink }]}>{s.title}</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>
            {s.publisher}, {s.academicYear}
          </Text>
          {s.url ? (
            <ExternalLink
              href={s.url}
              style={[styles.link, { color: theme.ink, textDecorationColor: theme.accent }]}>
              View source document
            </ExternalLink>
          ) : null}
          {s.needsVerification && (
            <Text style={[styles.badge, { backgroundColor: theme.warningSurface, color: theme.warning }]}>
              Not yet checked against the original document
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md, gap: 3 },
  title: { fontFamily: fonts.bodyMedium, fontSize: type.md },
  meta: { fontFamily: fonts.body, fontSize: type.sm },
  link: {
    fontFamily: fonts.body,
    fontSize: type.sm,
    marginTop: 2,
    alignSelf: 'flex-start',
    textDecorationLine: 'underline',
  },
  badge: {
    alignSelf: 'flex-start',
    fontFamily: fonts.bodyMedium,
    fontSize: type.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.xs,
  },
  empty: { paddingVertical: spacing.md, fontFamily: fonts.body, fontSize: type.md },
});
