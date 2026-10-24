import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'onHero' | 'gold';
  disabled?: boolean;
};

// The app's buttons: filled forest green, outlined, or white-outlined for use
// on the deep green hero.
export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const theme = useTheme();
  const colors =
    variant === 'primary'
      ? { bg: theme.accent, pressedBg: theme.accent2, border: theme.accent, text: theme.accentInk }
      : variant === 'gold'
        ? { bg: theme.goldFill, pressedBg: theme.gold, border: theme.goldFill, text: theme.goldInk }
        : variant === 'onHero'
        ? { bg: 'transparent', pressedBg: theme.hero, border: theme.heroMuted, text: theme.heroInk }
        : { bg: theme.sheet, pressedBg: theme.paper2, border: theme.rule2, text: theme.ink };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        disabled
          ? { backgroundColor: theme.paper2, borderColor: theme.rule }
          : { backgroundColor: pressed ? colors.pressedBg : colors.bg, borderColor: colors.border },
      ]}>
      <Text style={[styles.buttonText, { color: disabled ? theme.muted : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

type SegmentedProps = {
  label: string;
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
};

// A row of choice pills. The selected one fills forest green.
export function Segmented({ label, options, selected, onSelect }: SegmentedProps) {
  const theme = useTheme();
  return (
    <View style={styles.pills} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((o) => {
        const isSelected = o.key === selected;
        return (
          <Pressable
            key={o.key}
            onPress={() => onSelect(o.key)}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.pill,
              isSelected
                ? { backgroundColor: theme.accent, borderColor: theme.accent }
                : { backgroundColor: pressed ? theme.paper2 : theme.sheet, borderColor: theme.rule2 },
            ]}>
            <Text style={[styles.pillText, { color: isSelected ? theme.accentInk : theme.ink }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderWidth: rules.hair,
    borderRadius: radius.control,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: fonts.control, fontSize: type.md },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { minHeight: 36, borderWidth: rules.hair, borderRadius: radius.pill, paddingHorizontal: 16, justifyContent: 'center' },
  pillText: { fontFamily: fonts.control, fontSize: type.sm },
});
