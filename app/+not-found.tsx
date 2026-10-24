import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, useTheme } from '@/constants/theme';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, { color: theme.primary }]}>
          Go to the college list
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 20, fontWeight: 'bold' },
  link: { marginTop: spacing.lg, paddingVertical: spacing.lg, fontSize: 15 },
});
