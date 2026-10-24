import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import type { Stat } from '@/types/college';

type Props<T> = {
  label: string;
  stat: Stat<T> | null;
  format: (value: T) => string;
  icon?: IconName;
  last?: boolean;
};

// One labeled figure with the group it describes underneath. Missing figures
// are shown as "Not available" rather than hidden, so gaps in the data are
// visible.
export function StatRow<T>({ label, stat, format, icon, last }: Props<T>) {
  const theme = useTheme();
  const value = stat ? format(stat.value) : 'Not available';

  return (
    <View
      style={[styles.row, !last && { borderBottomColor: theme.rule, borderBottomWidth: rules.hair }]}
      accessible
      accessibilityLabel={`${label}: ${value}${stat ? `. ${stat.cohort}` : ''}`}>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <Icon name={icon} color={theme.accent} size={18} />
        </View>
      )}
      <View style={styles.main}>
        <View style={styles.top}>
          <Text style={[styles.label, { color: theme.ink2 }]}>{label}</Text>
          <Text style={[styles.value, { color: stat ? theme.ink : theme.muted }]}>{value}</Text>
        </View>
        {stat && (
          <Text style={[styles.detail, { color: theme.muted }]}>
            {stat.cohort}
            {stat.derived ? ', calculated from published figures' : ''}
          </Text>
        )}
        {stat?.note && <Text style={[styles.detail, { color: theme.muted }]}>{stat.note}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.md },
  label: { fontFamily: fonts.bodyMedium, fontSize: type.md, flexShrink: 1 },
  value: { fontFamily: fonts.monoMedium, fontSize: type.md, fontVariant: ['tabular-nums'], textAlign: 'right' },
  detail: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.4, marginTop: 3 },
});
