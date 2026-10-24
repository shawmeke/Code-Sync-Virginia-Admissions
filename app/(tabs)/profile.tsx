import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { Button, Segmented } from '@/components/Controls';
import { Icon, type IconName } from '@/components/Icon';
import { useProfile } from '@/components/ProfileContext';
import { ScoreRing } from '@/components/ScoreRing';
import { Section } from '@/components/Section';
import { fonts, radius, rules, spacing, type, useTheme } from '@/constants/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { form, updateForm, resetForm, profile, fieldErrors, ready, hasData } = useProfile();

  // The three measures Academic Match is built from, counted when entered and valid.
  const measures = [
    { name: 'GPA', done: profile.gpa !== null && !fieldErrors.gpa },
    {
      name: 'a test score',
      done: (profile.sat !== null && !fieldErrors.sat) || (profile.act !== null && !fieldErrors.act),
    },
    { name: 'class rank', done: profile.classRankTopPercent !== null && !fieldErrors.classRank },
  ];
  const doneCount = measures.filter((m) => m.done).length;
  const missing = measures.filter((m) => !m.done).map((m) => m.name);
  const status =
    doneCount === 0
      ? 'Add your GPA, a test score or your class rank. Each one you add sharpens your Academic Match.'
      : doneCount === 3
        ? 'All three measures added. Your match uses every figure colleges publish.'
        : `${doneCount} of 3 measures added. Add ${missing.join(' or ')} for a fuller match.`;
  const blockingCount = (['gpa', 'sat', 'act', 'classRank'] as const).filter((f) => fieldErrors[f]).length;

  return (
    <View style={[styles.screen, { backgroundColor: theme.paper }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        // Lift the form above the iPhone keyboard so lower fields stay visible.
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag">
        <View style={[styles.hero, { backgroundColor: theme.hero }]}>
          <View accessible accessibilityRole="image" accessibilityLabel={`${doneCount} of 3 measures added`}>
            <ScoreRing value={(doneCount / 3) * 100} size={76} strokeWidth={7} color={theme.goldFill} trackColor={theme.heroTrack}>
              <Text style={[styles.heroCount, { color: theme.heroInk }]}>{doneCount}/3</Text>
            </ScoreRing>
          </View>
          <View style={styles.heroText}>
            <Text style={[styles.heroTitle, { color: theme.heroInk }]} accessibilityRole="header">
              Your profile
            </Text>
            <Text style={[styles.heroBody, { color: theme.heroMuted }]}>{status}</Text>
          </View>
        </View>

        <Text style={[styles.intro, { color: theme.ink2 }]}>
          Enter whatever you know. Every field is optional. Nothing you type is saved or sent anywhere; it stays on this
          screen until you close the app.
        </Text>

        <Section title="Grades">
          <Field
            icon="chart"
            label="High school GPA"
            value={form.gpa}
            onChangeText={(gpa) => updateForm({ gpa })}
            placeholder={form.gpaWeighted ? 'e.g. 4.25' : 'e.g. 3.80'}
            keyboardType="decimal-pad"
            maxLength={4}
            error={fieldErrors.gpa}
            valid={profile.gpa !== null}
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
            icon="pencil"
            label="SAT total"
            value={form.sat}
            onChangeText={(sat) => updateForm({ sat })}
            placeholder="400–1600"
            keyboardType="number-pad"
            maxLength={4}
            error={fieldErrors.sat}
            valid={profile.sat !== null}
          />
          <Field
            icon="pencil"
            label="ACT composite"
            value={form.act}
            onChangeText={(act) => updateForm({ act })}
            placeholder="1–36"
            keyboardType="number-pad"
            maxLength={2}
            error={fieldErrors.act}
            valid={profile.act !== null}
          />
          <Help>Enter either test, both, or neither. Leave both blank if you're applying test-optional.</Help>
        </Section>

        <Section title="Class rank">
          <Field
            icon="rank"
            label="Top __% of my class"
            a11yLabel="Class rank, as top percent of class"
            value={form.classRank}
            onChangeText={(classRank) => updateForm({ classRank })}
            placeholder="e.g. 10"
            keyboardType="decimal-pad"
            maxLength={5}
            error={fieldErrors.classRank}
            valid={profile.classRankTopPercent !== null}
          />
          <Help>Leave blank if your school doesn't rank students.</Help>
        </Section>

        <Section title="Course rigor">
          <Field
            icon="graduation"
            label="Advanced courses I've taken"
            value={form.advancedTaken}
            onChangeText={(advancedTaken) => updateForm({ advancedTaken })}
            placeholder="e.g. 6"
            keyboardType="number-pad"
            maxLength={2}
            valid={profile.rigor !== null}
          />
          <Field
            icon="doc"
            label="Advanced courses my school offers"
            value={form.advancedAvailable}
            onChangeText={(advancedAvailable) => updateForm({ advancedAvailable })}
            placeholder="e.g. 15"
            keyboardType="number-pad"
            maxLength={3}
            error={fieldErrors.rigor}
            valid={profile.rigor !== null}
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
            icon="graduation"
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

        {hasData && (
          <Pressable onPress={resetForm} accessibilityRole="button" style={styles.clear}>
            {({ pressed }) => (
              <Text
                style={[styles.clearText, { color: theme.ink, textDecorationColor: theme.accent, opacity: pressed ? 0.7 : 1 }]}>
                Clear everything
              </Text>
            )}
          </Pressable>
        )}
      </ScrollView>

      {/* The next step stays in reach however far down the form you are. */}
      <View style={[styles.footer, { backgroundColor: theme.sheet, borderTopColor: theme.rule }]}>
        <Button
          label={
            ready
              ? 'See how I compare'
              : blockingCount > 0
                ? `Fix ${blockingCount} ${blockingCount === 1 ? 'item' : 'items'} above to compare`
                : 'Enter a GPA, test score or class rank'
          }
          variant="gold"
          onPress={() => router.navigate('/search')}
          disabled={!ready}
        />
      </View>
    </View>
  );
}

type FieldProps = {
  icon: IconName;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  maxLength: number;
  // Shown under the field, and the border turns the warning color.
  error?: string;
  // The border turns green once the entry is usable.
  valid?: boolean;
  wide?: boolean;
  // For screen readers when the visible label doesn't read well aloud.
  a11yLabel?: string;
};

function Field({ icon, label, value, onChangeText, placeholder, keyboardType, maxLength, error, valid, wide, a11yLabel }: FieldProps) {
  const theme = useTheme();
  const borderColor = error ? theme.warning : valid && value.trim() ? theme.accent : theme.rule2;
  return (
    <View style={[styles.field, { borderBottomColor: theme.rule }]}>
      <View style={[styles.row, wide && styles.rowWide]}>
        <View style={styles.labelRow}>
          <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
            <Icon name={icon} color={theme.accent} size={18} />
          </View>
          <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.muted}
          keyboardType={keyboardType}
          maxLength={maxLength}
          accessibilityLabel={error ? `${a11yLabel ?? label}. ${error}` : (a11yLabel ?? label)}
          autoCorrect={false}
          returnKeyType="done"
          selectionColor={theme.accent}
          style={[
            styles.input,
            wide && styles.inputWide,
            { backgroundColor: theme.sheet, borderColor, color: theme.ink, borderWidth: error || valid ? 2 : rules.hair },
          ]}
        />
      </View>
      {error && <Text style={[styles.error, { color: theme.warning }]}>{error}</Text>}
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
    <View style={[styles.field, styles.rowWide, { borderBottomColor: theme.rule }]}>
      <Text style={[styles.label, styles.choiceLabel, { color: theme.ink }]}>{label}</Text>
      <Segmented label={label} options={options} selected={selected} onSelect={onSelect} />
    </View>
  );
}

function Help({ children }: { children: string }) {
  const theme = useTheme();
  return <Text style={[styles.help, { color: theme.muted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, maxWidth: 680, width: '100%', alignSelf: 'center' },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroCount: { fontFamily: fonts.display, fontSize: type.lg, fontVariant: ['tabular-nums'] },
  heroText: { flex: 1 },
  heroTitle: { fontFamily: fonts.display, fontSize: type.xl },
  heroBody: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, marginTop: spacing.xs },
  intro: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.5, marginBottom: spacing.xl },
  field: { paddingVertical: spacing.md, borderBottomWidth: rules.hair },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  rowWide: { flexDirection: 'column', alignItems: 'stretch' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.bodyMedium, fontSize: type.md, flexShrink: 1 },
  choiceLabel: { marginBottom: spacing.sm },
  input: {
    width: 112,
    minHeight: 44,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontFamily: fonts.monoMedium,
    fontSize: type.md,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  inputWide: { width: '100%', textAlign: 'left', fontFamily: fonts.body, marginTop: spacing.sm },
  error: { fontFamily: fonts.bodyMedium, fontSize: type.xs, lineHeight: type.xs * 1.4, marginTop: spacing.sm },
  help: { fontFamily: fonts.body, fontSize: type.sm, lineHeight: type.sm * 1.45, paddingVertical: spacing.md },
  clear: { alignItems: 'center', paddingVertical: spacing.lg },
  clearText: { fontFamily: fonts.control, fontSize: type.md, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: rules.hair },
});
