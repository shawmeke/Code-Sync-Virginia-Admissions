/* Hallmark · shape: app screen · genre: editorial · theme: brand (Almanac material) · redesign: full
 * paper: #dfe3da (sage stock) · accent: #1e5537 forest green, #9a720c gold · display: Hanken Grotesk · body: Newsreader
 * nav: kept (tabs + stack) · signature: the college ledger · states: profile empty, invalid, ready; college data missing per measure
 * axes: mid/grotesk-sans/chromatic-green · posture: restrained · contrast: pass · v2.0.0 */
/* Hallmark · pre-emit critique: P3 H3 E4 S4 R4 V4 · weakest: H, an app has no hero; the welcome screen carries the brand instead */
/* Hallmark · waive 10a · the score ring animates on mount because the user asked for it; it stays still under reduced motion */

import { useColorScheme } from '@/components/useColorScheme';

// The student's school colors, forest green and gold, set in the register of
// a printed reference book: tinted paper, two rule weights, square corners,
// figures in a mono face. Green marks actions and selection. Gold marks the
// one thing a screen points at (you). Light-mode gold is deepened to #9a720c
// so marks keep 3:1 contrast; bright gold appears only behind dark text.
const light = {
  paper: '#dfe3da',
  paper2: '#d3d8cd',
  sheet: '#f3f4ee',
  // The shaded middle-50% stretch of a percentile scale.
  band: '#d3d8cd',
  ink: '#0f1d15',
  ink2: '#1f2f25',
  muted: '#4b5a50',
  rule: '#b8c0b3',
  rule2: '#24362b',
  accent: '#1e5537',
  accent2: '#163f29',
  accentInk: '#f6f3e6',
  gold: '#9a720c',
  goldFill: '#d4a82a',
  goldInk: '#0f1d15',
  focus: '#1e5537',
  warning: '#8a3b12',
  warningSurface: '#f3e3d6',
};

const dark: typeof light = {
  paper: '#0d1611',
  paper2: '#132019',
  sheet: '#16241c',
  band: '#2b4034',
  ink: '#eef0e6',
  ink2: '#d5dbcf',
  muted: '#9caa9f',
  rule: '#2a3b31',
  rule2: '#c4ccbf',
  accent: '#7cc49a',
  accent2: '#93d2ac',
  accentInk: '#0d1611',
  gold: '#e2b84a',
  goldFill: '#e2b84a',
  goldInk: '#0d1611',
  focus: '#e2b84a',
  warning: '#f0a46b',
  warningSurface: '#33200f',
};

export type Theme = typeof light;

export const themes = { light, dark };

export function useTheme(): Theme {
  return themes[useColorScheme()];
}

// Each weight is its own family in React Native, so fontWeight is never set
// alongside these. Hanken Grotesk sets heads and controls, Newsreader sets
// prose and labels, IBM Plex Mono sets numerals and nothing else.
export const fonts = {
  display: 'HankenGrotesk_600SemiBold',
  control: 'HankenGrotesk_500Medium',
  body: 'Newsreader_400Regular',
  bodyMedium: 'Newsreader_500Medium',
  bodyItalic: 'Newsreader_400Regular_Italic',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
};

// A fixed app scale at about 1.18; body never below 16.
export const type = { xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 26, display: 34 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
// Square surfaces; 2px at most on a control.
export const radius = { none: 0, control: 2 };
export const rules = { hair: 1, bar: 2 };
