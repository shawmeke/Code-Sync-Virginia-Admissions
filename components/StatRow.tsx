import { StyleSheet, Text, View } from 'react-native';

import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import type { Stat } from '@/types/college';

type Props<T> = {
  label: string;
  stat: Stat<T> | null;
  format: (value: T) => string;
  last?: boolean;
};

// One labeled figure with the group it describes underneath. Missing figures
// are shown as "Not available" rather than hidden, so gaps in the data are
// visible. Figures set in mono, right-aligned, so a column lines up.
export function StatRow<T>({ label, stat, format, last }: Props<T>) {
  const theme = useTheme();
  const value = stat ? format(stat.value) : 'Not available';

  return (
    <View
      style={[styles.row, !last && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair }]}
      accessible
      accessibilityLabel={`${label}: ${value}${stat ? `. ${stat.cohort}` : ''}`}>
      <View style={styles.top}>
        <Text style={[styles.label, { color: theme.ink2 }]}>{label}</Text>
        <Text style={[stat ? styles.value : styles.missing, { color: stat ? theme.ink : theme.muted }]}>{value}</Text>
      </View>
      {stat && (
        <Text style={[styles.detail, { color: theme.muted }]}>
          {stat.cohort}
          {stat.derived ? ', calculated from published figures' : ''}
        </Text>
      )}
      {stat?.note && <Text style={[styles.detail, { color: theme.muted }]}>{stat.note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md },
  label: { fontFamily: fonts.body, fontSize: type.md, flexShrink: 1 },
  value: { fontFamily: fonts.monoMedium, fontSize: type.md, fontVariant: ['tabular-nums'], textAlign: 'right' },
  missing: { fontFamily: fonts.bodyItalic, fontSize: type.md },
  detail: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.4, marginTop: 3 },
});
