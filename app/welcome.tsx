import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Controls';
import { useProfile } from '@/components/ProfileContext';
import { fonts, rules, spacing, type, useTheme } from '@/constants/theme';

const FEATURES: { title: string; body: string }[] = [
  {
    title: 'Official numbers only',
    body: "Every figure comes from the university's own Common Data Set, with its source and year.",
  },
  {
    title: 'An Academic Match for each school',
    body: 'See where your GPA, test scores and class rank fall among enrolled students, with the math shown.',
  },
  {
    title: 'Private by design',
    body: 'Nothing you enter is saved or sent anywhere.',
  },
];

export default function WelcomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { markWelcomeSeen } = useProfile();

  const go = (path: '/' | '/profile') => {
    markWelcomeSeen();
    router.replace(path);
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.paper }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
      ]}>
      <BrandMark size={84} color={theme.gold} trackColor={theme.rule} ink={theme.accent} />
      <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
        Code-Sync
      </Text>
      <Text style={[styles.tagline, { color: theme.ink2 }]}>
        See how your grades and scores compare at Virginia's universities.
      </Text>

      <View style={[styles.features, { borderTopColor: theme.ink }]}>
        {FEATURES.map((f) => (
          <View key={f.title} style={[styles.feature, { borderBottomColor: theme.rule }]}>
            <Text style={[styles.featureTitle, { color: theme.ink }]}>{f.title}</Text>
            <Text style={[styles.featureBody, { color: theme.ink2 }]}>{f.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Start with my profile" onPress={() => go('/profile')} />
        <Button label="Browse colleges first" variant="secondary" onPress={() => go('/')} />
      </View>
      <Text style={[styles.footer, { color: theme.muted }]}>
        Not an admissions predictor. Figures describe past students and can't tell you how your application will be
        decided.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', maxWidth: 560, width: '100%', alignSelf: 'center' },
  title: {
    fontFamily: fonts.display,
    fontSize: 46,
    lineHeight: 46,
    letterSpacing: -1.6,
    marginTop: spacing.xl,
  },
  tagline: { fontFamily: fonts.body, fontSize: type.lg, lineHeight: type.lg * 1.4, marginTop: spacing.sm, maxWidth: 360 },
  features: { borderTopWidth: rules.bar, marginTop: spacing.xl + spacing.sm },
  feature: { paddingVertical: spacing.md, borderBottomWidth: rules.hair },
  featureTitle: { fontFamily: fonts.display, fontSize: type.md },
  featureBody: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.45, marginTop: 2 },
  actions: { gap: spacing.md, marginTop: spacing.xl },
  footer: { fontFamily: fonts.body, fontSize: type.xs, lineHeight: type.xs * 1.45, marginTop: spacing.lg },
});
