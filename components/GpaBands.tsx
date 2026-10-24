import { StyleSheet, Text, View } from 'react-native';

import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';
import type { GpaBand } from '@/types/college';

function bandLabel(b: GpaBand): string {
  if (b.min === b.max) return b.min.toFixed(2);
  if (b.min === 0) return `Below ${(b.max + 0.01).toFixed(2)}`;
  return `${b.min.toFixed(2)}–${b.max.toFixed(2)}`;
}

// The published GPA table as a printed table: the range, a bar in ink, and
// the share in mono, highest group first.
export function GpaBands({ bands }: { bands: GpaBand[] }) {
  const theme = useTheme();
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  const largest = Math.max(...sorted.map((b) => b.percent), 1);

  return (
    <View style={styles.list}>
      {sorted.map((b, i) => (
        <View
          key={b.min}
          style={[styles.row, i > 0 && { borderTopColor: theme.rule, borderTopWidth: rules.hair }]}
          accessible
          accessibilityLabel={`GPA ${bandLabel(b)}: ${b.percent}%`}>
          <Text style={[styles.label, { color: theme.ink2 }]}>{bandLabel(b)}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { backgroundColor: theme.ink2, width: `${(b.percent / largest) * 100}%` }]} />
          </View>
          <Text style={[styles.percent, { color: theme.ink }]}>{b.percent}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 7 },
  label: { width: 96, fontFamily: fonts.mono, fontSize: type.xs, fontVariant: ['tabular-nums'] },
  track: { flex: 1, height: 6 },
  fill: { height: '100%' },
  percent: { width: 48, textAlign: 'right', fontFamily: fonts.monoMedium, fontSize: type.xs, fontVariant: ['tabular-nums'] },
});
