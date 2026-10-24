import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  SourceSans3_400Regular,
  SourceSans3_500Medium,
  SourceSans3_600SemiBold,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { ProfileProvider } from '@/components/ProfileContext';
import { useColorScheme } from '@/components/useColorScheme';
import '@/components/webStyles';
import { fonts, themes } from '@/constants/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on a college page keeps a back button present.
  anchor: '(tabs)',
};

// Keep the splash screen up until the fonts are ready, so text never
// flashes in the system face first.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme];
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const [loaded, error] = useFonts({
    Fraunces_600SemiBold,
    SourceSans3_400Regular,
    SourceSans3_500Medium,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });

  // If a font fails to load, the app still opens in the system face.
  const ready = loaded || !!error;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: { ...base.colors, background: theme.paper, primary: theme.accent, card: theme.paper, border: theme.rule },
      }}>
      <ProfileProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.paper },
            headerTintColor: theme.ink,
            headerTitleStyle: { fontFamily: fonts.control, fontSize: 17 },
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="college/[id]" options={{ title: 'College details' }} />
          <Stack.Screen name="about" options={{ title: 'About the data' }} />
        </Stack>
      </ProfileProvider>
    </ThemeProvider>
  );
}
