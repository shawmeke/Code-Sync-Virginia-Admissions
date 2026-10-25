import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { fonts, radius, rules, shadow, spacing, type, useTheme } from '@/constants/theme';

type DropdownProps = {
  label: string;
  placeholder: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
};

// A field that opens a scrolling list to pick one option, with a row at the
// top to clear the choice. Built on Modal so it looks the same on iOS,
// Android and the web.
export function Dropdown({ label, placeholder, options, selected, onSelect }: DropdownProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const pick = (value: string | null) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <View>
      <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected ?? placeholder}`}
        accessibilityHint="Opens a list to choose from"
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: pressed ? theme.paper2 : theme.sheet, borderColor: theme.rule2 },
        ]}>
        <Text style={[styles.value, { color: selected ? theme.ink : theme.muted }]} numberOfLines={1}>
          {selected ?? placeholder}
        </Text>
        <Icon name="chevronDown" color={theme.muted} size={18} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close the list">
          {/* Claims touches so tapping inside the list doesn't close it. */}
          <View style={[styles.sheet, { backgroundColor: theme.sheet }]} onStartShouldSetResponder={() => true}>
            <View style={[styles.header, { borderBottomColor: theme.rule }]}>
              <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
                {label}
              </Text>
              <Pressable
                onPress={() => setOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                style={styles.close}>
                <Icon name="close" color={theme.muted} size={20} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(o) => o}
              ListHeaderComponent={
                <Row label={placeholder} muted selected={selected === null} onPress={() => pick(null)} />
              }
              renderItem={({ item }) => <Row label={item} selected={item === selected} onPress={() => pick(item)} />}
              initialNumToRender={40}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Row({ label, selected, muted, onPress }: { label: string; selected: boolean; muted?: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.rule, backgroundColor: selected ? theme.accentSoft : pressed ? theme.paper2 : 'transparent' },
      ]}>
      <Text style={[styles.rowText, { color: muted ? theme.muted : theme.ink }, selected && styles.rowTextSelected]}>
        {label}
      </Text>
      {selected && <Icon name="check" color={theme.accent} size={18} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bodyMedium, fontSize: type.md, marginBottom: spacing.sm },
  trigger: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: rules.hair,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    boxShadow: shadow.soft,
  },
  value: { flex: 1, fontFamily: fonts.body, fontSize: type.md },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(19, 36, 26, 0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '75%',
    borderRadius: radius.card,
    overflow: 'hidden',
    boxShadow: shadow.pop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    minHeight: 52,
    borderBottomWidth: rules.hair,
  },
  title: { fontFamily: fonts.display, fontSize: type.lg },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: rules.hair,
  },
  rowText: { fontFamily: fonts.body, fontSize: type.md, flexShrink: 1 },
  rowTextSelected: { fontFamily: fonts.control },
});
