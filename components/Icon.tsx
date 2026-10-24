import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

// Line icons used across the app, by meaning. iOS uses SF Symbols; Android
// and web use Material Symbols.
const ICONS = {
  person: { ios: 'person', android: 'person', web: 'person' },
  people: { ios: 'person.2', android: 'group', web: 'group' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  compare: { ios: 'scalemass', android: 'balance', web: 'balance' },
  heart: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
  heartFilled: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  home: { ios: 'house', android: 'home', web: 'home' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  envelope: { ios: 'envelope.open', android: 'drafts', web: 'drafts' },
  graduation: { ios: 'graduationcap', android: 'school', web: 'school' },
  percent: { ios: 'percent', android: 'percent', web: 'percent' },
  pencil: { ios: 'pencil.line', android: 'edit', web: 'edit' },
  doc: { ios: 'doc.text', android: 'description', web: 'description' },
  chart: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  rank: { ios: 'list.number', android: 'format_list_numbered', web: 'format_list_numbered' },
  seal: { ios: 'checkmark.seal', android: 'verified', web: 'verified' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
  location: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, color, size = 22 }: { name: IconName; color: ColorValue; size?: number }) {
  return <SymbolView name={ICONS[name]} tintColor={color} size={size} />;
}
