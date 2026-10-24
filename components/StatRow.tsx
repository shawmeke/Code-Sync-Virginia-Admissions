import { StyleSheet, Text, View } from 'react-native';

import { spacing, useTheme } from '@/constants/theme';
import type { Stat } from '@/types/college';

type Props<T> = {
  label: string;
  stat: Stat<T> | null;
  format: (value: T) => string;
  last?: boolean;
};

// One labeled figure with the group it describes underneath. Missing figures
// are shown as "Not available" rather than hidden, so gaps in the data are
// visible.
export function StatRow<T>({ label, stat, format, last }: Props<T>) {
  const theme = useTheme();
  const value = stat ? format(stat.value) : 'Not available';

  return (
    <View
      style={[styles.row, !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
      accessible
      accessibilityLabel={`${label}: ${value}${stat ? `. ${stat.cohort}` : ''}`}>
      <View style={styles.top}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.value, { color: stat ? theme.text : theme.textMuted }]}>{value}</Text>
      </View>
      {stat && (
        <Text style={[styles.detail, { color: theme.textMuted }]}>
          {stat.cohort}
          {stat.derived ? ' · Calculated' : ''}
        </Text>
      )}
      {stat?.note && <Text style={[styles.detail, { color: theme.textMuted }]}>{stat.note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md },
  label: { fontSize: 15, flexShrink: 1 },
  value: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  detail: { fontSize: 12, marginTop: 3, lineHeight: 17 },
});
