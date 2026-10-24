import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, spacing, type, useTheme } from '@/constants/theme';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: theme.paper }]}>
        <Text style={[styles.title, { color: theme.ink }]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, { color: theme.ink, textDecorationColor: theme.accent }]}>
          Go to the college list
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { fontFamily: fonts.display, fontSize: type.xl },
  link: { marginTop: spacing.lg, paddingVertical: spacing.lg, fontFamily: fonts.body, fontSize: type.md, textDecorationLine: 'underline' },
});
