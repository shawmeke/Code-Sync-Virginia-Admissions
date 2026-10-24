import type { College, Source } from '../types/college.ts';

// Every figure comes from the college's official Common Data Set (CDS).

export const sources: Source[] = [
  {
    id: 'uva-cds-2024-25',
    title: 'University of Virginia Common Data Set 2024–25',
    publisher: 'University of Virginia',
    url: 'https://ira.virginia.edu/data-analytics/common-data-set-initiatve',
    academicYear: '2024–25',
    needsVerification: false,
  },
  {
    id: 'vt-cds-2025-26',
    title: 'Virginia Tech Common Data Set 2025–26',
    publisher: 'Virginia Tech',
    url: 'https://aie.vt.edu/content/dam/aie_vt_edu/common-data-set/25-26/2025-2026-CDS.xlsx',
    academicYear: '2025–26',
    needsVerification: false,
  },
  {
    id: 'odu-cds-2025-26',
    title: 'Old Dominion University Common Data Set 2025–26',
    publisher: 'Old Dominion University',
    url: 'https://www.odu.edu/sites/default/files/2026/documents/cds-2025-2026.pdf',
    academicYear: '2025–26',
    needsVerification: false,
  },
  {
    id: 'wm-cds-2025-26',
    title: 'William & Mary Common Data Set 2025–26, section C',
    publisher: 'William & Mary',
    url: 'https://www.wm.edu/offices/ir/university_data/cds/cds_2025-26_c.pdf',
    academicYear: '2025–26',
    needsVerification: false,
  },
  {
    id: 'jmu-cds-2025-26',
    title: 'James Madison University Common Data Set 2025–26',
    publisher: 'James Madison University',
    url: 'https://www.jmu.edu/pair/ir/common-data-set/cds-2025.docx',
    academicYear: '2025–26',
    needsVerification: false,
  },
];

export const colleges: College[] = [
  {
    id: 'uva',
    name: 'University of Virginia',
    city: 'Charlottesville',
    control: 'public',
    testPolicy: 'optional',
    // UVA's newest Common Data Set the team could get describes Fall 2024, one
    // cycle earlier than the other colleges.
    cycle: 'Fall 2024',
    applicants: { value: 58951, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 first-year applicants' },
    admitted: { value: 9909, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 first-year offers' },
    enrolled: { value: 3961, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 enrolled first-years' },
    offerRate: {
      value: 16.81,
      sourceId: 'uva-cds-2024-25',
      cohort: 'Fall 2024 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: { value: { p25: 1410, p75: 1520 }, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 enrolled first-years who submitted SAT' },
    act: { value: { p25: 32, p75: 35 }, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 enrolled first-years who submitted ACT' },
    satSubmitShare: { value: 45.6, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 enrolled first-years' },
    actSubmitShare: { value: 13.8, sourceId: 'uva-cds-2024-25', cohort: 'Fall 2024 enrolled first-years' },
    // UVA leaves the average GPA blank, but 90.5% of students in the 4.0
    // group means these must include weighted GPAs.
    gpaScale: 'weighted',
    gpaAverage: null,
    gpaBands: {
      value: [
        { min: 4.0, max: 4.0, percent: 90.5 },
        { min: 3.75, max: 3.99, percent: 6.8 },
        { min: 3.5, max: 3.74, percent: 2.1 },
        { min: 3.25, max: 3.49, percent: 0.3 },
        { min: 3.0, max: 3.24, percent: 0.1 },
        { min: 2.5, max: 2.99, percent: 0.2 },
        { min: 0, max: 2.49, percent: 0 },
      ],
      sourceId: 'uva-cds-2024-25',
      cohort: 'Fall 2024 enrolled first-years',
      note: 'Common Data Set section C11. The 4.0 group includes everyone at 4.0 or above.',
    },
    classRank: {
      value: { topTenth: 84, topQuarter: 97, topHalf: 99, reportedShare: 34 },
      sourceId: 'uva-cds-2024-25',
      cohort: 'Fall 2024 first-years who reported a class rank',
    },
    programNotes: [],
    notes: [
      'UVA uses holistic review and says it has no GPA or test score cutoffs.',
      'UVA admitted 26% of Virginia applicants and 14% of out-of-state applicants for Fall 2024 (Common Data Set C1).',
    ],
  },
  {
    id: 'vt',
    name: 'Virginia Tech',
    city: 'Blacksburg',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 57755, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 first-year applicants' },
    admitted: { value: 31515, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 first-year offers' },
    enrolled: { value: 7133, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    offerRate: {
      value: 54.57,
      sourceId: 'vt-cds-2025-26',
      cohort: 'Fall 2025 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: {
      value: { p25: 1280, p75: 1450 },
      sourceId: 'vt-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years who submitted SAT',
      derived: true,
      note: "Virginia Tech doesn't publish a total SAT range, so this adds its Reading/Writing (640–720) and Math (640–730) ranges and is approximate.",
    },
    act: { value: { p25: 28, p75: 32 }, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted ACT' },
    satSubmitShare: { value: 42, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    actSubmitShare: { value: 8, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    // The CDS asks for a 4.0 scale, but an average above 4.0 means these
    // must include weighted GPAs.
    gpaScale: 'weighted',
    gpaAverage: { value: 4.06, sourceId: 'vt-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted a GPA' },
    gpaBands: {
      value: [
        { min: 4.0, max: 4.0, percent: 67 },
        { min: 3.75, max: 3.99, percent: 18 },
        { min: 3.5, max: 3.74, percent: 10 },
        { min: 3.25, max: 3.49, percent: 4 },
        { min: 3.0, max: 3.24, percent: 1 },
        { min: 0, max: 2.99, percent: 0 },
      ],
      sourceId: 'vt-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years',
      note: 'Common Data Set section C11. The 4.0 group includes everyone at 4.0 or above.',
    },
    // Virginia Tech leaves the class rank table (C10) blank.
    classRank: null,
    programNotes: [
      {
        program: 'College of Engineering',
        keywords: ['engineering', 'engineer'],
        note: 'Some published Virginia Tech figures describe admitted Engineering students only. Because they don\'t represent the whole university, the app doesn\'t compare you against them.',
      },
    ],
    notes: [
      'Virginia Tech admitted 47% of Virginia applicants and 59% of out-of-state applicants for Fall 2025 (Common Data Set C1).',
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
    // ODU leaves the rows below 2.50 blank and its column totals 100%.
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
      note: 'Common Data Set section C11.',
    },
    classRank: {
      value: { topTenth: 12, topQuarter: 35, topHalf: 71, reportedShare: 75 },
      sourceId: 'odu-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years who reported a class rank',
    },
    programNotes: [],
    notes: [],
  },
  {
    id: 'wm',
    name: 'William & Mary',
    city: 'Williamsburg',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 16895, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 first-year applicants' },
    admitted: { value: 6245, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 first-year offers' },
    enrolled: { value: 1639, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    offerRate: {
      value: 36.96,
      sourceId: 'wm-cds-2025-26',
      cohort: 'Fall 2025 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: { value: { p25: 1390, p75: 1520 }, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted SAT' },
    act: { value: { p25: 32, p75: 34 }, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted ACT' },
    satSubmitShare: { value: 48, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    actSubmitShare: { value: 14, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    // The CDS asks for a 4.0 scale, but an average of 4.34 means these must
    // include weighted GPAs.
    gpaScale: 'weighted',
    gpaAverage: { value: 4.34, sourceId: 'wm-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted a GPA' },
    gpaBands: {
      value: [
        { min: 4.0, max: 4.0, percent: 88.9 },
        { min: 3.75, max: 3.99, percent: 7.2 },
        { min: 3.5, max: 3.74, percent: 3.0 },
        { min: 3.25, max: 3.49, percent: 0.8 },
        { min: 3.0, max: 3.24, percent: 0.1 },
        { min: 0, max: 2.99, percent: 0 },
      ],
      sourceId: 'wm-cds-2025-26',
      cohort: 'Fall 2025 enrolled first-years',
      note: 'Common Data Set section C11. The 4.0 group includes everyone at 4.0 or above.',
    },
    classRank: {
      value: { topTenth: 79, topQuarter: 95, topHalf: 99, reportedShare: 30 },
      sourceId: 'wm-cds-2025-26',
      cohort: 'Fall 2025 first-years who reported a class rank',
    },
    programNotes: [],
    notes: [],
  },
  {
    id: 'jmu',
    name: 'James Madison University',
    city: 'Harrisonburg',
    control: 'public',
    testPolicy: 'optional',
    cycle: 'Fall 2025',
    applicants: { value: 42595, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 first-year applicants' },
    admitted: { value: 29300, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 first-year offers' },
    enrolled: { value: 4935, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    offerRate: {
      value: 68.79,
      sourceId: 'jmu-cds-2025-26',
      cohort: 'Fall 2025 first-year applicants',
      derived: true,
      note: 'Offers divided by applications.',
    },
    sat: { value: { p25: 1180, p75: 1330 }, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted SAT' },
    act: { value: { p25: 24, p75: 29 }, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years who submitted ACT' },
    satSubmitShare: { value: 16, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    actSubmitShare: { value: 3, sourceId: 'jmu-cds-2025-26', cohort: 'Fall 2025 enrolled first-years' },
    // JMU reports its GPA figures (C11–C12) as "NA".
    gpaScale: 'unknown',
    gpaAverage: null,
    gpaBands: null,
    // JMU's class rank table (C10) doesn't add up: top quarter and top half
    // are both 34.6%, and top half plus bottom half is 43.7%, not 100%.
    classRank: null,
    programNotes: [],
    notes: [
      "JMU doesn't publish GPA figures in its Common Data Set.",
      "JMU's published class rank figures don't add up, so the app doesn't compare class rank.",
      'JMU admitted 64% of Virginia applicants and 73% of out-of-state applicants for Fall 2025 (Common Data Set C1).',
    ],
  },
];

export function getCollege(id: string): College | undefined {
  return colleges.find((c) => c.id === id);
}

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

// The sources a college's figures come from, in the order first used.
export function sourcesForCollege(c: College): Source[] {
  const stats = [
    c.applicants, c.admitted, c.enrolled, c.offerRate, c.sat, c.act,
    c.satSubmitShare, c.actSubmitShare, c.gpaAverage, c.gpaBands, c.classRank,
  ];
  const ids = [...new Set(stats.flatMap((s) => (s ? [s.sourceId] : [])))];
  return ids.flatMap((id) => {
    const source = getSource(id);
    return source ? [source] : [];
  });
}
