import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { fonts, rules, useTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: { backgroundColor: theme.paper, borderTopColor: theme.rule2, borderTopWidth: rules.hair },
        tabBarLabelStyle: { fontFamily: fonts.control, fontSize: 12 },
        headerStyle: { backgroundColor: theme.paper },
        headerTintColor: theme.ink,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 18 },
        headerShadowVisible: false,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Colleges',
          headerTitle: 'Code-Sync',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'building.columns', android: 'account_balance', web: 'account_balance' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Your profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }} tintColor={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About the data',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'info.circle', android: 'info', web: 'info' }} tintColor={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
