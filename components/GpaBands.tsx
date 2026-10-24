import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useTheme } from '@/constants/theme';
import type { GpaBand } from '@/types/college';

function bandLabel(b: GpaBand): string {
  if (b.min === b.max) return b.min.toFixed(2);
  if (b.min === 0) return `Below ${(b.max + 0.01).toFixed(2)}`;
  return `${b.min.toFixed(2)}–${b.max.toFixed(2)}`;
}

// A horizontal bar for each published GPA group, highest group first.
export function GpaBands({ bands }: { bands: GpaBand[] }) {
  const theme = useTheme();
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  const largest = Math.max(...sorted.map((b) => b.percent), 1);

  return (
    <View style={styles.list}>
      {sorted.map((b) => (
        <View key={b.min} style={styles.row} accessible accessibilityLabel={`GPA ${bandLabel(b)}: ${b.percent}%`}>
          <Text style={[styles.label, { color: theme.text }]}>{bandLabel(b)}</Text>
          <View style={[styles.track, { backgroundColor: theme.barTrack }]}>
            <View style={[styles.fill, { backgroundColor: theme.bar, width: `${(b.percent / largest) * 100}%` }]} />
          </View>
          <Text style={[styles.percent, { color: theme.text }]}>{b.percent}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.sm, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { width: 92, fontSize: 13, fontVariant: ['tabular-nums'] },
  track: { flex: 1, height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  percent: { width: 38, textAlign: 'right', fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
