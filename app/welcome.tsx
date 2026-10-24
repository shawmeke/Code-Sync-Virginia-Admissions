import { router } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { useProfile } from '@/components/ProfileContext';
import { radius, spacing } from '@/constants/theme';

// The welcome screen keeps the brand navy in light and dark mode.
const NAVY = '#172a45';
const BLUE = '#8bb0e3';
const MUTED = '#cbd7e6';

const FEATURES: { icon: SymbolViewProps['name']; title: string; body: string }[] = [
  {
    icon: { ios: 'checkmark.seal', android: 'verified', web: 'verified' },
    title: 'Official numbers only',
    body: "Every figure comes from the university's own Common Data Set, with its source and year.",
  },
  {
    icon: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
    title: 'An Academic Match for each school',
    body: 'See where your GPA, test scores and class rank fall among enrolled students, with the math shown.',
  },
  {
    icon: { ios: 'lock', android: 'lock', web: 'lock' },
    title: 'Private by design',
    body: 'Nothing you enter is saved or sent anywhere.',
  },
];

// Fades and lifts a block into place, one after another.
function FadeUp({ delay, children }: { delay: number; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <View>{children}</View>;
  return (
    <Animated.View
      style={{
        opacity: 0,
        transform: [{ translateY: 14 }],
        animationName: { to: { opacity: 1, transform: [{ translateY: 0 }] } },
        animationDuration: 500,
        animationDelay: delay,
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
      }}>
      {children}
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { markWelcomeSeen } = useProfile();

  const go = (path: '/' | '/profile') => {
    markWelcomeSeen();
    router.replace(path);
  };

  return (
    <ScrollView
      style={{ backgroundColor: NAVY }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.hero}>
        <BrandMark size={148} color={BLUE} trackColor="rgba(139, 176, 227, 0.22)" ink="#ffffff" />
        <FadeUp delay={150}>
          <Text style={styles.title} accessibilityRole="header">
            Code-Sync
          </Text>
          <Text style={styles.tagline}>See how your grades and scores compare at Virginia's universities.</Text>
        </FadeUp>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <FadeUp key={f.title} delay={350 + i * 120}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <SymbolView name={f.icon} tintColor={BLUE} size={22} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureBody}>{f.body}</Text>
              </View>
            </View>
          </FadeUp>
        ))}
      </View>

      <FadeUp delay={750}>
        <Pressable
          onPress={() => go('/profile')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primary, { opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.primaryText}>Start with my profile</Text>
        </Pressable>
        <Pressable
          onPress={() => go('/')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.secondary, { opacity: pressed ? 0.7 : 1 }]}>
          <Text style={styles.secondaryText}>Browse colleges first</Text>
        </Pressable>
        <Text style={styles.footer}>
          Not an admissions predictor. Figures describe past students and can't tell you how your application will be
          decided.
        </Text>
      </FadeUp>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: spacing.xl * 1.5 },
  title: { color: '#ffffff', fontSize: 38, fontWeight: '800', textAlign: 'center', marginTop: spacing.lg, letterSpacing: -0.5 },
  tagline: { color: MUTED, fontSize: 17, lineHeight: 24, textAlign: 'center', marginTop: spacing.sm, maxWidth: 320, alignSelf: 'center' },
  features: { gap: spacing.lg, marginBottom: spacing.xl * 1.5 },
  feature: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(139, 176, 227, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  featureBody: { color: MUTED, fontSize: 14, lineHeight: 20, marginTop: 2 },
  primary: { backgroundColor: BLUE, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center' },
  primaryText: { color: NAVY, fontSize: 17, fontWeight: '800' },
  secondary: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(203, 215, 230, 0.4)',
  },
  secondaryText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  footer: { color: MUTED, opacity: 0.8, fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: spacing.lg },
});
