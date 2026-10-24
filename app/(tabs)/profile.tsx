import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { Button, Segmented } from '@/components/Controls';
import { useProfile } from '@/components/ProfileContext';
import { Section } from '@/components/Section';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { form, updateForm, resetForm, errors, ready, hasData } = useProfile();

  return (
    <ScrollView
      style={{ backgroundColor: theme.paper }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <Text style={[styles.intro, { color: theme.ink2 }]}>
        Enter whatever you know. Every field is optional. Nothing you type is saved or sent anywhere; it stays on this
        screen until you close the app.
      </Text>

      <Section title="Grades">
        <Field
          label="High school GPA"
          value={form.gpa}
          onChangeText={(gpa) => updateForm({ gpa })}
          placeholder={form.gpaWeighted ? 'e.g. 4.25' : 'e.g. 3.80'}
          keyboardType="decimal-pad"
          maxLength={4}
        />
        <Choices
          label="GPA type"
          options={[
            { key: 'unweighted', label: 'Unweighted (4.0)' },
            { key: 'weighted', label: 'Weighted' },
          ]}
          selected={form.gpaWeighted ? 'weighted' : 'unweighted'}
          onSelect={(k) => updateForm({ gpaWeighted: k === 'weighted' })}
        />
        {form.gpaWeighted && (
          <Choices
            label="Weighted scale"
            options={[
              { key: '4', label: 'Out of 4.0' },
              { key: '5', label: 'Out of 5.0' },
            ]}
            selected={form.gpaScale}
            onSelect={(k) => updateForm({ gpaScale: k as '4' | '5' })}
          />
        )}
        <Help>
          Weighted GPAs give extra points for honors, AP or IB classes. Colleges that publish weighted GPAs are compared
          with your weighted GPA, and the others with your unweighted one.
        </Help>
      </Section>

      <Section title="Test scores">
        <Field
          label="SAT total"
          value={form.sat}
          onChangeText={(sat) => updateForm({ sat })}
          placeholder="400–1600"
          keyboardType="number-pad"
          maxLength={4}
        />
        <Field
          label="ACT composite"
          value={form.act}
          onChangeText={(act) => updateForm({ act })}
          placeholder="1–36"
          keyboardType="number-pad"
          maxLength={2}
        />
        <Help>Enter either test, both, or neither. Leave both blank if you're applying test-optional.</Help>
      </Section>

      <Section title="Class rank">
        <Field
          label="Top __% of my class"
          a11yLabel="Class rank, as top percent of class"
          value={form.classRank}
          onChangeText={(classRank) => updateForm({ classRank })}
          placeholder="e.g. 10"
          keyboardType="decimal-pad"
          maxLength={5}
        />
        <Help>Leave blank if your school doesn't rank students.</Help>
      </Section>

      <Section title="Course rigor">
        <Field
          label="Advanced courses I've taken"
          value={form.advancedTaken}
          onChangeText={(advancedTaken) => updateForm({ advancedTaken })}
          placeholder="e.g. 6"
          keyboardType="number-pad"
          maxLength={2}
        />
        <Field
          label="Advanced courses my school offers"
          value={form.advancedAvailable}
          onChangeText={(advancedAvailable) => updateForm({ advancedAvailable })}
          placeholder="e.g. 15"
          keyboardType="number-pad"
          maxLength={3}
        />
        <Help>
          Count honors, AP, IB and dual-enrollment courses. Colleges don't publish a number for this, so it's shown as
          context and isn't part of your Academic Match.
        </Help>
      </Section>

      <Section title="About you">
        <Choices
          label="Where you live"
          options={[
            { key: 'virginia', label: 'Virginia' },
            { key: 'out-of-state', label: 'Out of state' },
          ]}
          selected={form.residency}
          onSelect={(k) => updateForm({ residency: form.residency === k ? null : (k as 'virginia' | 'out-of-state') })}
        />
        <Field
          label="Intended major"
          value={form.major}
          onChangeText={(major) => updateForm({ major })}
          placeholder="e.g. Engineering"
          keyboardType="default"
          maxLength={60}
          wide
        />
        <Help>Virginia's public universities admit in-state and out-of-state students at different rates.</Help>
      </Section>

      {errors.length > 0 && (
        <View
          style={[styles.errors, { backgroundColor: theme.warningSurface, borderTopColor: theme.warning }]}>
          <Text style={[styles.errorsTitle, { color: theme.warning }]}>Check these before comparing</Text>
          {errors.map((e, i) => (
            <Text key={`${i}-${e}`} style={[styles.errorText, { color: theme.ink }]}>
              • {e}
            </Text>
          ))}
        </View>
      )}

      <Button
        label={ready ? 'See how I compare' : hasData ? 'Fix the items above to compare' : 'Enter a GPA, test score or class rank'}
        onPress={() => router.navigate('/')}
        disabled={!ready}
      />

      {hasData && (
        <Pressable onPress={resetForm} accessibilityRole="button" style={styles.clear}>
          {({ pressed }) => (
            <Text style={[styles.clearText, { color: theme.ink, textDecorationColor: theme.accent, opacity: pressed ? 0.7 : 1 }]}>
              Clear everything
            </Text>
          )}
        </Pressable>
      )}
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  maxLength: number;
  wide?: boolean;
  // For screen readers when the visible label doesn't read well aloud.
  a11yLabel?: string;
};

function Field({ label, value, onChangeText, placeholder, keyboardType, maxLength, wide, a11yLabel }: FieldProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, wide && styles.rowWide, { borderBottomColor: theme.rule }]}>
      <Text style={[styles.label, { color: theme.ink2 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        accessibilityLabel={a11yLabel ?? label}
        autoCorrect={false}
        returnKeyType="done"
        style={[
          styles.input,
          wide && styles.inputWide,
          { backgroundColor: theme.sheet, borderColor: theme.muted, color: theme.ink },
        ]}
      />
    </View>
  );
}

type ChoicesProps = {
  label: string;
  options: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
};

function Choices({ label, options, selected, onSelect }: ChoicesProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, styles.rowWide, { borderBottomColor: theme.rule }]}>
      <Text style={[styles.label, { color: theme.ink2 }]}>{label}</Text>
      <Segmented label={label} options={options} selected={selected} onSelect={onSelect} />
    </View>
  );
}

function Help({ children }: { children: string }) {
  const theme = useTheme();
  return <Text style={[styles.help, { color: theme.muted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 680, width: '100%', alignSelf: 'center' },
  intro: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.5, marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: rules.hair,
  },
  rowWide: { flexDirection: 'column', alignItems: 'stretch' },
  label: { fontFamily: fonts.body, fontSize: type.md, flexShrink: 1 },
  input: {
    width: 112,
    minHeight: 44,
    borderWidth: rules.hair,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontFamily: fonts.monoMedium,
    fontSize: type.md,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  inputWide: { width: '100%', textAlign: 'left', fontFamily: fonts.body },
  help: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, paddingVertical: spacing.md },
  errors: { borderTopWidth: rules.bar, padding: spacing.md, marginBottom: spacing.lg },
  errorsTitle: { fontFamily: fonts.display, fontSize: type.md, marginBottom: spacing.xs },
  errorText: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.4 },
  clear: { alignItems: 'center', paddingVertical: spacing.lg },
  clearText: { fontFamily: fonts.control, fontSize: type.md, textDecorationLine: 'underline' },
});
