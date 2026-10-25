// The app always uses its light theme, so it looks the same on every device
// whatever the system setting. The dark palette in constants/theme.ts is kept
// in case a dark mode comes back; switch this to react-native's
// useColorScheme to follow the system again.
export const useColorScheme = (): 'light' | 'dark' => 'light';
