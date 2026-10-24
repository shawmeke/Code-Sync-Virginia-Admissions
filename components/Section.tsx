import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';

// A head over a firm rule, then the rows. No boxed card: depth is a rule and
// a paper step. `sheet` sets the content on the pale printed page, kept for
// the one thing a screen points at.
export function Section({ title, sheet, children }: { title: string; sheet?: boolean; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text
        style={[styles.title, { color: theme.ink, borderBottomColor: theme.rule2 }]}
        accessibilityRole="header">
        {title}
      </Text>
      <View style={sheet ? [styles.sheet, { backgroundColor: theme.sheet }] : undefined}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl + spacing.sm },
  title: {
    fontFamily: fonts.display,
    fontSize: type.lg,
    lineHeight: type.lg * 1.15,
    letterSpacing: -0.2,
    paddingBottom: spacing.sm,
    borderBottomWidth: rules.bar,
  },
  sheet: { paddingHorizontal: spacing.md },
});
