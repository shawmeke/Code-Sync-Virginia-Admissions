import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

// The app's two buttons: one filled forest green, one outlined in ink. Both
// square at the 2px control radius, set in Hanken Grotesk.
export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        primary
          ? {
              backgroundColor: disabled ? theme.paper2 : pressed ? theme.accent2 : theme.accent,
              borderColor: disabled ? theme.rule : pressed ? theme.accent2 : theme.accent,
            }
          : { backgroundColor: pressed ? theme.paper2 : 'transparent', borderColor: theme.ink },
      ]}>
      <Text style={[styles.buttonText, { color: disabled ? theme.muted : primary ? theme.accentInk : theme.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}

type SegmentedProps = {
  label: string;
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
};

// A row of joined choices. The selected one fills forest green.
export function Segmented({ label, options, selected, onSelect }: SegmentedProps) {
  const theme = useTheme();
  return (
    <View
      style={[styles.segments, { borderColor: theme.rule2 }]}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}>
      {options.map((o, i) => {
        const isSelected = o.key === selected;
        return (
          <Pressable
            key={o.key}
            onPress={() => onSelect(o.key)}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.segment,
              i > 0 && { borderLeftColor: theme.rule2, borderLeftWidth: rules.hair },
              {
                backgroundColor: isSelected ? theme.accent : pressed ? theme.paper2 : 'transparent',
              },
            ]}>
            <Text style={[styles.segmentText, { color: isSelected ? theme.accentInk : theme.ink }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderWidth: rules.hair,
    borderRadius: radius.control,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: fonts.control, fontSize: type.md },
  segments: { flexDirection: 'row', alignSelf: 'flex-start', borderWidth: rules.hair, borderRadius: radius.control, overflow: 'hidden' },
  segment: { minHeight: 40, paddingHorizontal: spacing.md, justifyContent: 'center' },
  segmentText: { fontFamily: fonts.control, fontSize: type.sm },
});
