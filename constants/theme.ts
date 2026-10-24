import { useColorScheme } from '@/components/useColorScheme';

// Colors carried over from the original estimator's navy-and-blue design.
const light = {
  background: '#f3f6fa',
  surface: '#ffffff',
  surfaceMuted: '#eef2f7',
  text: '#1c2b3c',
  textMuted: '#617286',
  border: '#dbe3ed',
  primary: '#315f9e',
  onPrimary: '#ffffff',
  header: '#172a45',
  onHeader: '#ffffff',
  onHeaderMuted: '#cbd7e6',
  bar: '#315f9e',
  barTrack: '#e9edf3',
  warning: '#8a5410',
  warningSurface: '#fdf3e3',
};

const dark: typeof light = {
  background: '#0f1724',
  surface: '#172233',
  surfaceMuted: '#1e2b3e',
  text: '#e6edf5',
  textMuted: '#9aabbf',
  border: '#2a3a50',
  primary: '#8bb0e3',
  onPrimary: '#0f1724',
  header: '#0b1320',
  onHeader: '#ffffff',
  onHeaderMuted: '#a9b8cc',
  bar: '#8bb0e3',
  barTrack: '#24344a',
  warning: '#e9b866',
  warningSurface: '#33270f',
};

export type Theme = typeof light;

export const themes = { light, dark };

export function useTheme(): Theme {
  return themes[useColorScheme()];
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 8, md: 12, pill: 999 };
