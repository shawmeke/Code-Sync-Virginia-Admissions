import { StyleSheet, Text, View } from 'react-native';

import { badgeInk, fonts, schoolBadges, useTheme } from '@/constants/theme';

// A round initials badge in the school's colors. Initials, not a logo:
// school seals and logos are trademarks.
export function SchoolBadge({ collegeId, size = 44 }: { collegeId: string; size?: number }) {
  const theme = useTheme();
  const badge = schoolBadges[collegeId];
  const initials = badge?.initials ?? collegeId.slice(0, 3).toUpperCase();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: badge?.fill ?? theme.accent,
          borderColor: badge?.rim ?? theme.goldFill,
          borderWidth: Math.max(2, size / 16),
        },
      ]}>
      <Text
        style={[styles.text, { color: badgeInk, fontSize: size * (initials.length > 2 ? 0.27 : 0.34) }]}
        numberOfLines={1}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.display, letterSpacing: -0.3 },
});
