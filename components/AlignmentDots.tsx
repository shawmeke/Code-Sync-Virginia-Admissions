import { StyleSheet, Text, View } from 'react-native';

import { fonts, spacing, type, useTheme } from '@/constants/theme';

const DOTS = 15;

// A dotted line from "Below typical" to "Above typical" with a gold diamond
// where your Academic Match puts you among the school's enrolled students.
// Dots up to your position are green, the rest are gray.
export function AlignmentDots({ score, compact }: { score: number; compact?: boolean }) {
  const theme = useTheme();
  const position = Math.min(100, Math.max(0, score));
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Academic Match ${score} out of 100, on a scale from below typical to above typical for this school`}
      style={compact ? styles.wrapCompact : styles.wrap}>
      <View style={styles.track}>
        {Array.from({ length: DOTS }, (_, i) => {
          const at = (i / (DOTS - 1)) * 100;
          return (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: at <= position ? theme.accent : theme.rule2 }]}
            />
          );
        })}
        <View
          style={[
            styles.diamond,
            { left: `${position}%`, backgroundColor: theme.goldFill, borderColor: theme.sheet },
          ]}
        />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: theme.muted }]}>Below typical</Text>
        <Text style={[styles.label, { color: theme.muted }]}>Above typical</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  wrapCompact: { marginTop: spacing.sm },
  track: { height: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  diamond: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    borderWidth: 2,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12 },
});
