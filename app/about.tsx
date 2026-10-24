import { ScrollView, StyleSheet, Text } from 'react-native';

import { Section } from '@/components/Section';
import { SourceList } from '@/components/SourceList';
import { fonts, spacing, type, useTheme } from '@/constants/theme';
import { sources } from '@/data/colleges';

export default function AboutScreen() {
  const theme = useTheme();
  const body = [styles.body, { color: theme.ink2 }];

  return (
    <ScrollView style={{ backgroundColor: theme.paper }} contentContainerStyle={styles.content}>
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

      <Section title="How Academic Match works">
        <Text style={body}>
          For each measure you enter (test score, GPA and class rank), the app estimates your percentile among the
          college's enrolled students. Test scores use the published 25th, 50th and 75th percentiles; GPA and class rank
          use the published share of students in each group.
        </Text>
        <Text style={body}>
          Academic Match is the average of those percentiles. If you enter both an SAT and an ACT, only the stronger one
          counts. A score of 60 means that, on average, your numbers are higher than about 60% of that college's
          students.
        </Text>
        <Text style={body}>
          Course rigor, essays, activities and recommendations matter too, but colleges don't publish numbers for them,
          so they aren't part of the score.
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
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, maxWidth: 680, width: '100%', alignSelf: 'center' },
  body: { fontFamily: fonts.body, fontSize: type.md, lineHeight: type.md * 1.55, paddingTop: spacing.md },
});
