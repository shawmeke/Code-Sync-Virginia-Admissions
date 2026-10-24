import { useColorScheme } from '@/components/useColorScheme';

// The student's school colors, forest green and gold, in a clean card-based
// app style: white rounded cards on a soft green-gray page. Green marks
// actions and selection. Gold marks "you" (your match, your marker).
// Light-mode gold is deepened to #9a720c so marks keep 3:1 contrast; bright
// gold appears only behind dark text. Every color in the app comes from here.
const light = {
  paper: '#f4f6f2',
  paper2: '#e9efe7',
  sheet: '#ffffff',
  // The shaded middle-50% stretch of a percentile scale.
  band: '#e1eadf',
  ink: '#13241a',
  ink2: '#2b3b31',
  muted: '#5c6b61',
  rule: '#e3e8e1',
  rule2: '#cdd6ca',
  accent: '#1e5537',
  accent2: '#174429',
  accentInk: '#ffffff',
  // A pale green for selected chips and icon backgrounds.
  accentSoft: '#e2eee5',
  gold: '#9a720c',
  goldFill: '#d4a82a',
  goldInk: '#13241a',
  // The deep green behind the welcome screen and feature cards.
  hero: '#173f29',
  heroInk: '#ffffff',
  heroMuted: '#cfe0d4',
  focus: '#1e5537',
  warning: '#8a3b12',
  warningSurface: '#f8e9dd',
  shadow: '#13241a',
};

const dark: typeof light = {
  paper: '#0c1510',
  paper2: '#17271e',
  sheet: '#13211a',
  band: '#24372c',
  ink: '#eef2ea',
  ink2: '#d3dccf',
  muted: '#9dada1',
  rule: '#22342a',
  rule2: '#2f4537',
  accent: '#7cc49a',
  accent2: '#93d2ac',
  accentInk: '#0c1510',
  accentSoft: '#1d3728',
  gold: '#e2b84a',
  goldFill: '#e2b84a',
  goldInk: '#0c1510',
  hero: '#123120',
  heroInk: '#ffffff',
  heroMuted: '#bcd2c3',
  focus: '#e2b84a',
  warning: '#f0a46b',
  warningSurface: '#33200f',
  shadow: '#000000',
};

export type Theme = typeof light;

export const themes = { light, dark };

export function useTheme(): Theme {
  return themes[useColorScheme()];
}

// Initials badges in each school's colors: the school's primary color with
// white letters (readable on every one of them) and a rim in its second color.
export const schoolBadges: Record<string, { initials: string; fill: string; rim: string }> = {
  uva: { initials: 'UVA', fill: '#232d4b', rim: '#e57200' },
  vt: { initials: 'VT', fill: '#861f41', rim: '#e5751f' },
  wm: { initials: 'W&M', fill: '#115740', rim: '#b9975b' },
  jmu: { initials: 'JMU', fill: '#450084', rim: '#cbb677' },
  odu: { initials: 'ODU', fill: '#003057', rim: '#7c878e' },
};
export const badgeInk = '#ffffff';

// Inter throughout. Each weight is its own family in React Native, so
// fontWeight is never set alongside these. Numbers use tabular figures.
export const fonts = {
  display: 'Inter_700Bold',
  control: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyItalic: 'Inter_400Regular',
  mono: 'Inter_500Medium',
  monoMedium: 'Inter_600SemiBold',
};

export const type = { xs: 13, sm: 14, md: 16, lg: 18, xl: 21, xxl: 26, display: 30 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { none: 0, control: 10, card: 16, pill: 999 };
export const rules = { hair: 1, bar: 2 };

// A soft lift for cards, like the mockup.
export function cardShadow(theme: Theme) {
  return {
    shadowColor: theme.shadow,
    shadowOpacity: theme === dark ? 0.4 : 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  };
}
