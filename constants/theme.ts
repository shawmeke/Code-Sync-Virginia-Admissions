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
  // Gold for words (6.1:1 on white) and a pale gold for icon dots and chips.
  goldText: '#7d5d08',
  goldSoft: '#f7edd3',
  // The deep green behind the welcome screen and feature cards.
  hero: '#173f29',
  heroInk: '#ffffff',
  heroMuted: '#cfe0d4',
  // A faint ring track on the hero green: a step lighter than the hero.
  heroTrack: '#2a5a3f',
  focus: '#1e5537',
  warning: '#8a3b12',
  warningSurface: '#f8e9dd',
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
  goldText: '#e2b84a',
  goldSoft: '#3a3117',
  hero: '#123120',
  heroInk: '#ffffff',
  heroMuted: '#bcd2c3',
  heroTrack: '#24503a',
  focus: '#e2b84a',
  warning: '#f0a46b',
  warningSurface: '#33200f',
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
  gmu: { initials: 'GMU', fill: '#006633', rim: '#ffcc33' },
  vcu: { initials: 'VCU', fill: '#000000', rim: '#f8b300' },
  radford: { initials: 'RU', fill: '#c2011b', rim: '#a7a9ac' },
  richmond: { initials: 'UR', fill: '#00205b', rim: '#c8102e' },
  wlu: { initials: 'W&L', fill: '#00285e', rim: '#a7a8aa' },
};
export const badgeInk = '#ffffff';

// Fraunces (a serif) for headings over Source Sans 3 for everything else,
// the same pairing Niche uses. Each weight is its own family in React
// Native, so fontWeight is never set alongside these. "mono" names the faces
// used for numbers; they set tabular figures so columns line up.
export const fonts = {
  display: 'Fraunces_600SemiBold',
  control: 'SourceSans3_600SemiBold',
  body: 'SourceSans3_400Regular',
  bodyMedium: 'SourceSans3_500Medium',
  bodyItalic: 'SourceSans3_400Regular',
  mono: 'SourceSans3_600SemiBold',
  monoMedium: 'SourceSans3_700Bold',
};

export const type = { xs: 13, sm: 14, md: 16, lg: 18, xl: 21, xxl: 26 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
// One tight soft-square corner for controls, cards and chips. Circles are kept
// for the things a screen points at: badges, rings and icon dots.
export const radius = { control: 6, card: 6, pill: 6 };
export const rules = { hair: 1, bar: 2 };
