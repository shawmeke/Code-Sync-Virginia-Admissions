import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { fonts, radius, spacing, type, useTheme } from '@/constants/theme';

// The deep-green card that leads somewhere: a title, one sentence and a gold
// arrow. Used on Home, in Search and on college pages.
export function PromptCard({ href, title, body }: { href: Href; title: string; body: string }) {
  const theme = useTheme();
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        {({ pressed }) => (
          <View style={[styles.card, { backgroundColor: theme.hero, opacity: pressed ? 0.9 : 1 }]}>
            <View style={styles.text}>
              <Text style={[styles.title, { color: theme.heroInk }]}>{title}</Text>
              <Text style={[styles.body, { color: theme.heroMuted }]}>{body}</Text>
            </View>
            <View style={[styles.arrow, { backgroundColor: theme.goldFill }]}>
              <Icon name="chevron" color={theme.goldInk} size={16} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.card, padding: spacing.lg },
  text: { flex: 1 },
  title: { fontFamily: fonts.display, fontSize: type.lg },
  body: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: 4 },
  arrow: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
