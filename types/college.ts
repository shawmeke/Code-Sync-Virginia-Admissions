// Shapes for college admissions data. Every published number carries the
// source it came from and the group of students it describes, so the app can
// always show where a figure came from and never present it out of context.
//
// Missing data is `null`, never 0: "the college didn't publish this" is
// different from "the value is zero".

export type Source = {
  id: string;
  title: string;
  publisher: string;
  // Null until someone on the team has checked the exact document.
  url: string | null;
  // The academic year the document reports on, e.g. "2025–26".
  academicYear: string;
  // True until a team member has checked every figure against the document.
  needsVerification: boolean;
};

export type Stat<T> = {
  value: T;
  sourceId: string;
  // Who the figure describes, e.g. "Fall 2025 enrolled first-year students".
  cohort: string;
  // True when the app's data was calculated from published numbers rather
  // than copied directly (e.g. adding two SAT section ranges together).
  derived?: boolean;
  note?: string;
};

// A middle-50% range: 25% of the cohort scored below p25 and 25% above p75.
// p50 is the median, when the college publishes one.
export type ScoreRange = { p25: number; p50?: number; p75: number };

// One row of a Common Data Set GPA table (section C11): the share of
// enrolled first-years whose high school GPA fell between min and max.
export type GpaBand = { min: number; max: number; percent: number };

export type GpaScale = 'weighted' | 'unweighted' | 'unknown';

// Cumulative shares from Common Data Set section C10. topTenth is the share
// of students in the top 10% of their class, topQuarter the share in the top
// 25% (including the top 10%), and so on. Null means not published.
export type ClassRankProfile = {
  topTenth: number | null;
  topQuarter: number | null;
  topHalf: number | null;
  // Share of enrolled students who reported a class rank at all.
  reportedShare: number | null;
};

// Applicants and offers by where the applicant lived (Common Data Set C1).
// International and unknown-residence applicants are left out.
export type ResidencyCounts = { applied: number; admitted: number };
export type ResidencyOffers = { virginia: ResidencyCounts; outOfState: ResidencyCounts };

// How much a college says an academic factor counts (Common Data Set C7).
export type Importance = 'very important' | 'important' | 'considered' | 'not considered';

// What a student needs to know before applying, from Common Data Set
// sections C7 and C13 to C22. Dates are as published ("Jan 5"); null means
// the college didn't publish it or our copy of the document can't be read.
export type ApplyingFacts = {
  fee: number | null;
  feeWaivable: boolean | null;
  regularDeadline: string | null;
  priorityDate: string | null;
  // null when the document's answer can't be read.
  earlyDecision: { offered: boolean; deadline: string | null } | null;
  earlyAction: { offered: boolean; deadline: string | null } | null;
  factors: {
    rigor: Importance | null;
    classRank: Importance | null;
    gpa: Importance | null;
    tests: Importance | null;
    essay: Importance | null;
    recommendations: Importance | null;
  };
};

// 'some': required of some applicants, e.g. by age or high school GPA.
export type TestPolicy = 'required' | 'some' | 'optional' | 'blind' | 'unknown';

// A note that applies only to one school or major, so it is never shown as
// if it described the whole university.
export type ProgramNote = {
  program: string;
  // Lowercase words that link a student's intended major to this note.
  keywords: string[];
  note: string;
};

export type College = {
  id: string;
  name: string;
  city: string;
  control: 'public' | 'private';
  testPolicy: TestPolicy;
  // The admissions cycle the main figures describe, e.g. "Fall 2025".
  cycle: string;

  applicants: Stat<number> | null;
  admitted: Stat<number> | null;
  enrolled: Stat<number> | null;
  // Stored separately because it can come from a different year than the
  // applicant and admit counts.
  offerRate: Stat<number> | null;
  residencyOffers: Stat<ResidencyOffers> | null;

  sat: Stat<ScoreRange> | null;
  act: Stat<ScoreRange> | null;
  // Share of enrolled students who submitted each test. A low share means
  // the range describes a small, self-selected group.
  satSubmitShare: Stat<number> | null;
  actSubmitShare: Stat<number> | null;

  gpaScale: GpaScale;
  gpaAverage: Stat<number> | null;
  gpaBands: Stat<GpaBand[]> | null;

  classRank: Stat<ClassRankProfile> | null;

  applying: Stat<ApplyingFacts> | null;

  programNotes: ProgramNote[];
  notes: string[];
};
