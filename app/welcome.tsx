import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Controls';
import { Icon, type IconName } from '@/components/Icon';
import { useProfile } from '@/components/ProfileContext';
import { fonts, spacing, type, useTheme } from '@/constants/theme';
import { campusPhotos } from '@/data/photos';

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'seal',
    title: 'Official numbers only',
    body: "Every figure comes from the university's own Common Data Set, with its source and year.",
  },
  {
    icon: 'chart',
    title: 'An Academic Match for each school',
    body: 'See where your GPA, test scores and class rank fall among enrolled students, with the math shown.',
  },
  {
    icon: 'lock',
    title: 'Private by design',
    body: 'Nothing you enter is saved or sent anywhere.',
  },
];

const PHOTO = campusPhotos.uva;

export default function WelcomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { markWelcomeSeen } = useProfile();

  const go = (path: '/search' | '/profile') => {
    markWelcomeSeen();
    router.replace(path);
  };

  return (
    <ImageBackground source={PHOTO.image} style={[styles.fill, { backgroundColor: theme.hero }]} resizeMode="cover">
      {/* The deep green is always dark, so the clock and battery stay light. */}
      <StatusBar style="light" />
      {/* The deep green over the photo keeps every word readable. */}
      <View style={[styles.overlay, { backgroundColor: theme.hero }]} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
        ]}>
        <View style={styles.hero}>
          <BrandMark size={96} color={theme.goldFill} trackColor={theme.heroMuted} ink={theme.heroInk} />
          <Text style={[styles.title, { color: theme.heroInk }]} accessibilityRole="header">
            Middle Fifty
          </Text>
          <Text style={[styles.tagline, { color: theme.heroMuted }]}>
            See how your grades and scores compare at Virginia's universities.
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <Icon name={f.icon} color={theme.goldFill} size={22} />
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.heroInk }]}>{f.title}</Text>
                <Text style={[styles.featureBody, { color: theme.heroMuted }]}>{f.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Start with my profile" variant="gold" onPress={() => go('/profile')} />
          <Button label="Browse colleges first" variant="onHero" onPress={() => go('/search')} />
        </View>
        <Text style={[styles.footer, { color: theme.heroMuted }]}>
          Not an admissions predictor. Figures describe past students and can't tell you how your application will be
          decided.
        </Text>
        <Text style={[styles.credit, { color: theme.heroMuted }]}>
          Photo: {PHOTO.artist}, {PHOTO.license}, resized, via Wikimedia Commons
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.86 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', maxWidth: 560, width: '100%', alignSelf: 'center' },
  hero: { alignItems: 'center' },
  title: { fontFamily: fonts.display, fontSize: 44, letterSpacing: -1.2, marginTop: spacing.lg, textAlign: 'center' },
  tagline: { fontFamily: fonts.bodyMedium, fontSize: type.lg, lineHeight: type.lg * 1.4, marginTop: spacing.sm, textAlign: 'center', maxWidth: 340 },
  features: { gap: spacing.lg, marginTop: spacing.xl + spacing.md },
  feature: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  featureText: { flex: 1 },
  featureTitle: { fontFamily: fonts.control, fontSize: type.md },
  featureBody: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: 2 },
  actions: { gap: spacing.md, marginTop: spacing.xl + spacing.md },
  footer: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.lg, textAlign: 'center' },
  credit: { fontFamily: fonts.body, fontSize: 11, marginTop: spacing.md, textAlign: 'center', opacity: 0.8 },
});
