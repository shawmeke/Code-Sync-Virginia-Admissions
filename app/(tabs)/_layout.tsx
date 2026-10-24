import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.header },
        headerTintColor: theme.onHeader,
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
