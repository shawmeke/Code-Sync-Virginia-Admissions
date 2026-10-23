import type { College, Source } from '../types/college.ts';

// Figures carried over from the team's earlier research (the Sept 2026
// estimator and the Excel workbooks). Every source is marked
// needsVerification until someone checks each number against the original
// document and fills in its URL.

export const sources: Source[] = [
  {
    id: 'uva-fall-2025',
    title: 'UVA Fall 2025 first-year admissions statistics',
    publisher: 'University of Virginia',
    url: null,
    academicYear: '2025–26',
    needsVerification: true,
  },
  {
    id: 'vt-cds-2025-26',
    title: 'Virginia Tech Common Data Set 2025–26 (team workbook)',
    publisher: 'Virginia Tech',
    url: null,
    academicYear: '2025–26',
    needsVerification: true,
  },
  {
    id: 'vt-2023-24',
    title: 'Virginia Tech offer rate, 2023–24 cycle',
    publisher: 'Virginia Tech',
    url: null,
    academicYear: '2023–24',
    needsVerification: true,
  },
  {
    id: 'odu-cds-2025-26',
    title: 'Old Dominion University Common Data Set 2025–26',
    publisher: 'Old Dominion University',
    url: null,
    academicYear: '2025–26',
    needsVerification: true,
  },
];

export const colleges: College[] = [
  {
    id: 'uva',
    name: 'University of Virginia',
    city: 'Charlottesville',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 64457, sourceId: 'uva-fall-2025', cohort: 'Fall 2025 first-year applicants' },
    admitted: { value: 10086, sourceId: 'uva-fall-2025', cohort: 'Fall 2025 first-year offers' },
    enrolled: null,
    offerRate: {
      value: 15.65,
      sourceId: 'uva-fall-2025',
      cohort: 'Fall 2025 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: {
      value: { p25: 1410, p75: 1540 },
      sourceId: 'uva-fall-2025',
      cohort: 'Fall 2025 first-years who submitted SAT',
      derived: true,
      note: "Total range made by adding UVA's published Reading/Writing and Math section ranges, so it is approximate.",
    },
    act: { value: { p25: 32, p75: 35 }, sourceId: 'uva-fall-2025', cohort: 'Fall 2025 first-years who submitted ACT' },
    satSubmitShare: null,
    actSubmitShare: null,
    gpaScale: 'unknown',
    gpaAverage: null,
    gpaBands: null,
    classRank: {
      value: { topTenth: 90, topQuarter: null, topHalf: null, reportedShare: 30 },
      sourceId: 'uva-fall-2025',
      cohort: 'Fall 2025 first-years who reported a class rank',
    },
    programNotes: [],
    notes: [
      'UVA uses holistic review and says it has no GPA or test score cutoffs.',
      'UVA aims for a set share of Virginia residents; this app does not adjust for residency.',
    ],
  },
  {
    id: 'vt',
    name: 'Virginia Tech',
    city: 'Blacksburg',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 57622, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 first-year applicants' },
    admitted: null,
    enrolled: null,
    offerRate: {
      value: 54.84,
      sourceId: 'vt-2023-24',
      cohort: '2023–24 first-year applicants',
      note: 'From an earlier cycle than the Fall 2025 applicant count.',
    },
    sat: null,
    act: null,
    satSubmitShare: null,
    actSubmitShare: null,
    gpaScale: 'unknown',
    gpaAverage: null,
    gpaBands: null,
    classRank: null,
    programNotes: [
      {
        program: 'College of Engineering',
        keywords: ['engineering', 'engineer'],
        note: 'The team workbook includes averages for admitted Engineering students only. They describe Engineering, not all of Virginia Tech, so the app does not compare you against them.',
      },
    ],
    notes: [
      'About 7,000 first-year students enter each fall (approximate; not used in comparisons).',
      'No university-wide GPA, test score, or class rank figures have been collected yet.',
    ],
  },
  {
    id: 'odu',
    name: 'Old Dominion University',
    city: 'Norfolk',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 15024, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 first-year applicants' },
    admitted: { value: 13725, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 first-year offers' },
    enrolled: { value: 2697, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    offerRate: {
      value: 91.35,
      sourceId: 'odu-cds-2025-26',
      cohort: 'Fall 2025 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: { value: { p25: 1120, p75: 1270 }, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted SAT' },
    act: { value: { p25: 22, p75: 27 }, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted ACT' },
    satSubmitShare: { value: 7, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    actSubmitShare: { value: 1, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    gpaScale: 'unknown',
    gpaAverage: { value: 3.43, sourceId: 'odu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    gpaBands: {
      value: [
        { min: 4.0, max: 4.0, percent: 19 },
        { min: 3.75, max: 3.99, percent: 13 },
        { min: 3.5, max: 3.74, percent: 15 },
        { min: 3.25, max: 3.49, percent: 15 },
        { min: 3.0, max: 3.24, percent: 13 },
        { min: 2.5, max: 2.99, percent: 25 },
        { min: 0, max: 2.49, percent: 0 },
      ],
      sourceId: 'odu-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years',
      note: 'CDS section C11. Whether these GPAs are weighted or unweighted is not stated. The 2.50–2.99 and below-2.50 rows should be rechecked against the original table.',
    },
    classRank: {
      value: { topTenth: 12, topQuarter: 35, topHalf: 71, reportedShare: 75 },
      sourceId: 'odu-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years who reported a class rank',
    },
    programNotes: [],
    notes: [],
  },
];

export function getCollege(id: string): College | undefined {
  return colleges.find((c) => c.id === id);
}

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
