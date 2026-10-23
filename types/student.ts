// What a student tells the app about themselves. Every field except GPA can
// be left out, because not every student has test scores or a class rank.

export type GpaEntry = {
  value: number;
  // The top of the scale the school uses, e.g. 4 or 5.
  scale: number;
  weighted: boolean;
};

export type TestEntry =
  | { type: 'SAT'; score: number }
  | { type: 'ACT'; score: number };

export type StudentProfile = {
  gpa: GpaEntry | null;
  // Null when the student is not submitting a test score.
  test: TestEntry | null;
  // E.g. 8 means "top 8% of my class". Null if the school doesn't rank.
  classRankTopPercent: number | null;
  rigor: { advancedTaken: number; advancedAvailable: number } | null;
  intendedMajor: string | null;
  residency: 'virginia' | 'out-of-state' | null;
};
