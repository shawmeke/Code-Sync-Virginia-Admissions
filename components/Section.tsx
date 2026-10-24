import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, spacing, type, useTheme } from '@/constants/theme';

// A heading over a full-width white band holding the rows. Sections are told
// apart by the shift from page color to white, not by boxes or borders.
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
        {title}
      </Text>
      <View style={[styles.band, { backgroundColor: theme.sheet }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  title: { fontFamily: fonts.display, fontSize: type.lg, marginBottom: spacing.sm },
  // Bleeds past the screen's side padding so the band runs edge to edge.
  band: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
});
