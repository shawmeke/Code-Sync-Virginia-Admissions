import { ScrollView, StyleSheet, Text } from 'react-native';

import { Section } from '@/components/Section';
import { SourceList } from '@/components/SourceList';
import { spacing, useTheme } from '@/constants/theme';
import { sources } from '@/data/colleges';

export default function AboutScreen() {
  const theme = useTheme();
  const body = [styles.body, { color: theme.text }];

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.content}>
      <Section title="What these numbers are">
        <Text style={body}>
          Each figure comes from a college's own published admissions data, usually its Common Data Set. Every number
          shows which group of students it describes and which year it is from.
        </Text>
        <Text style={body}>
          A "middle 50%" range means a quarter of students scored below it and a quarter scored above it. These are
          not cutoffs. Colleges review applications as a whole.
        </Text>
      </Section>

      <Section title="What this app does not do">
        <Text style={body}>
          It doesn't predict whether you will be admitted. Past statistics describe students who were admitted or
          enrolled before; they can't tell you how your own application will be decided.
        </Text>
        <Text style={body}>
          When a college hasn't published a figure, the app says "Not available" instead of filling in a guess.
        </Text>
      </Section>

      <Section title="Sources">
        <SourceList sources={sources} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  body: { fontSize: 15, lineHeight: 22, paddingVertical: spacing.sm },
});
