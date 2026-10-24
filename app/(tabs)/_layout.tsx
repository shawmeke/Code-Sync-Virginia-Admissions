import { Tabs } from 'expo-router';

import { Icon } from '@/components/Icon';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { fonts, rules, useTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: { backgroundColor: theme.sheet, borderTopColor: theme.rule, borderTopWidth: rules.hair },
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        headerStyle: { backgroundColor: theme.paper },
        headerTintColor: theme.ink,
        headerTitleStyle: { fontFamily: fonts.control, fontSize: 17 },
        headerShadowVisible: false,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Search', headerTitle: 'College search', tabBarIcon: ({ color }) => <Icon name="search" color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="compare"
        options={{ title: 'Compare', headerTitle: 'Compare schools', tabBarIcon: ({ color }) => <Icon name="compare" color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', headerTitle: 'My profile', tabBarIcon: ({ color }) => <Icon name="person" color={color} size={24} /> }}
      />
    </Tabs>
  );
}
