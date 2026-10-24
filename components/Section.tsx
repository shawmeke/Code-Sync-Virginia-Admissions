import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardShadow, fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';

// A heading over a white rounded card holding the rows.
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
        {title}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.sheet, borderColor: theme.rule }, cardShadow(theme)]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  title: { fontFamily: fonts.display, fontSize: type.lg, marginBottom: spacing.sm },
  card: { borderRadius: radius.card, borderWidth: rules.hair, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
});
