import type { College } from '../types/college.ts';

// The fields of study the Common Data Set uses to count each college's
// degrees (section J1), keyed by their CIP 2020 code.
export const FIELDS: Record<string, string> = {
  '01': 'Agriculture',
  '03': 'Natural resources and conservation',
  '04': 'Architecture',
  '05': 'Area, ethnic and gender studies',
  '09': 'Communication and journalism',
  '10': 'Communication technologies',
  '11': 'Computer and information sciences',
  '12': 'Personal and culinary services',
  '13': 'Education',
  '14': 'Engineering',
  '15': 'Engineering technologies',
  '16': 'Foreign languages and linguistics',
  '19': 'Family and consumer sciences',
  '22': 'Law and legal studies',
  '23': 'English',
  '24': 'Liberal arts and general studies',
  '25': 'Library science',
  '26': 'Biology and life sciences',
  '27': 'Mathematics and statistics',
  '28-29': 'Military science',
  '30': 'Interdisciplinary studies',
  '31': 'Parks and recreation',
  '38': 'Philosophy and religious studies',
  '39': 'Theology',
  '40': 'Physical sciences',
  '41': 'Science technologies',
  '42': 'Psychology',
  '43': 'Homeland security, law enforcement and firefighting',
  '44': 'Public administration and social services',
  '45': 'Social sciences',
  '46': 'Construction trades',
  '47': 'Mechanic and repair technologies',
  '48': 'Precision production',
  '49': 'Transportation and materials moving',
  '50': 'Visual and performing arts',
  '51': 'Health professions and nursing',
  '52': 'Business and marketing',
  '54': 'History',
};

// Trade programs four-year colleges rarely offer, left out of the major list.
const NOT_MAJORS = new Set(['12', '25', '46', '47', '48', '49']);

export const UNDECIDED = 'Undecided';

// The choices in the profile's major dropdown, A to Z.
export const MAJORS = [
  ...Object.entries(FIELDS)
    .filter(([code]) => !NOT_MAJORS.has(code))
    .map(([, label]) => label),
  UNDECIDED,
].sort((a, b) => a.localeCompare(b));

const CODE_BY_LABEL = new Map(Object.entries(FIELDS).map(([code, label]) => [label, code]));

export type MajorShare =
  // The college didn't publish J1, so there's nothing to compare.
  | { status: 'not-published' }
  // The college published J1 and left this field blank: no degrees.
  | { status: 'none' }
  | { status: 'reported'; percent: number };

// Where a student's chosen major stands at a college. Null when no field was
// chosen (blank, "Undecided", or text that isn't one of the fields).
export function majorShare(college: College, major: string | null): MajorShare | null {
  const code = major ? CODE_BY_LABEL.get(major) : undefined;
  if (!code) return null;
  if (!college.degreeFields) return { status: 'not-published' };
  const percent = college.degreeFields.value[code];
  return percent === undefined ? { status: 'none' } : { status: 'reported', percent };
}

// A college's most common fields, largest first.
export function topFields(college: College, count: number): { label: string; percent: number }[] {
  if (!college.degreeFields) return [];
  return Object.entries(college.degreeFields.value)
    .filter(([code]) => FIELDS[code])
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([code, percent]) => ({ label: FIELDS[code], percent }));
}

// "24.1%", or "Under 1%" for shares a college rounds down to zero.
export function formatShare(percent: number): string {
  return percent < 1 ? 'Under 1%' : `${Number(percent.toFixed(1))}%`;
}
