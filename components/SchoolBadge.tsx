import { Image, StyleSheet, Text, View } from 'react-native';

import { badgeInk, fonts, radius, schoolBadges, shadow, useTheme } from '@/constants/theme';
import { campusPhotos } from '@/data/photos';

// A small square of the school's campus photo, or a round initials badge in
// the school's colors when there's no photo (or `photo` is off, e.g. under
// the same photo's header). Never a logo: school seals and logos are
// trademarks.
export function SchoolBadge({ collegeId, size = 44, photo = true }: { collegeId: string; size?: number; photo?: boolean }) {
  const theme = useTheme();
  const campus = photo ? campusPhotos[collegeId] : undefined;
  if (campus) {
    return (
      <Image
        source={campus.image}
        accessibilityElementsHidden
        importantForAccessibility="no"
        resizeMode="cover"
        // A white mat and a small shadow frame the photo on any background.
        style={{ width: size, height: size, borderRadius: radius.card, borderWidth: 2, borderColor: theme.sheet, boxShadow: shadow.photo }}
      />
    );
  }
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
        numberOfLines={1}
        allowFontScaling={false}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.display, letterSpacing: -0.3 },
});
