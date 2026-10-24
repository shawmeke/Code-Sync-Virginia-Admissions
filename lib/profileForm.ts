import type { StudentProfile } from '../types/student.ts';
import { validateProfile } from './validation.ts';

// What the profile screen's inputs hold. Everything is kept as typed text so
// a half-typed number ("3.") isn't lost while the student is still typing.
export type ProfileForm = {
  gpa: string;
  gpaWeighted: boolean;
  // Top of the weighted scale. Unweighted GPAs are always on 4.0.
  gpaScale: '4' | '5';
  sat: string;
  act: string;
  // Rank in class and class size; the profile gets the top percent from them.
  classRankPosition: string;
  classSize: string;
  residency: StudentProfile['residency'];
  major: string;
};

export const emptyProfileForm: ProfileForm = {
  gpa: '',
  gpaWeighted: false,
  gpaScale: '5',
  sat: '',
  act: '',
  classRankPosition: '',
  classSize: '',
  residency: null,
  major: '',
};

export type ProfileField = 'gpa' | 'sat' | 'act' | 'classRank';

export type ParsedProfile = {
  profile: StudentProfile;
  errors: string[];
  // The same problems, keyed by the field they belong to, so the screen can
  // show each one next to its input.
  fieldErrors: Partial<Record<ProfileField, string>>;
  // True when the student has entered anything that can be compared.
  hasData: boolean;
  // True when there's something to compare and nothing entered is invalid.
  ready: boolean;
};

// Plain digits with an optional decimal part. A trailing "." is allowed so a
// half-typed "3." isn't flagged. Number() alone would also accept "1e3" or "0x5DC".
const NUMBER = /^\d+(\.\d*)?$/;

const FIELD_ORDER: ProfileField[] = ['gpa', 'sat', 'act', 'classRank'];

// Turns the form into a profile. A field that isn't a number is reported and
// left out, never silently treated as zero.
export function parseProfileForm(form: ProfileForm): ParsedProfile {
  const fieldErrors: Partial<Record<ProfileField, string>> = {};
  const number = (text: string, label: string, field: ProfileField): number | null => {
    // Some keyboards type a decimal comma ("3,8").
    const t = text.trim().replace(',', '.');
    if (!t) return null;
    if (!NUMBER.test(t)) {
      fieldErrors[field] ??= `${label} must be a number.`;
      return null;
    }
    return Number(t);
  };

  const gpaValue = number(form.gpa, 'GPA', 'gpa');

  // Rank 1 of 500 is the top 0.2%. Multiplying before dividing keeps
  // results like 0.2 and 12.5 exact.
  const position = number(form.classRankPosition, 'Class rank', 'classRank');
  const size = number(form.classSize, 'Class size', 'classRank');
  let classRankTopPercent: number | null = null;
  if (!fieldErrors.classRank && (position !== null || size !== null)) {
    if (position === null || size === null) {
      fieldErrors.classRank = 'Enter both your rank and your class size.';
    } else if (!Number.isInteger(position) || !Number.isInteger(size)) {
      fieldErrors.classRank = 'Rank and class size must be whole numbers.';
    } else if (position < 1 || position > size) {
      fieldErrors.classRank = 'Your rank must be between 1 and your class size.';
    } else {
      classRankTopPercent = (position * 100) / size;
    }
  }

  const profile: StudentProfile = {
    gpa:
      gpaValue === null
        ? null
        : { value: gpaValue, scale: form.gpaWeighted ? Number(form.gpaScale) : 4, weighted: form.gpaWeighted },
    sat: number(form.sat, 'SAT', 'sat'),
    act: number(form.act, 'ACT', 'act'),
    classRankTopPercent,
    intendedMajor: form.major.trim() || null,
    residency: form.residency,
  };

  // Range checks one field at a time, so each message lands on its own field.
  const check = (field: ProfileField, part: Partial<StudentProfile>) => {
    if (fieldErrors[field]) return;
    const [problem] = validateProfile({ ...blankProfile, ...part });
    if (problem) fieldErrors[field] = problem;
  };
  check('gpa', { gpa: profile.gpa });
  check('sat', { sat: profile.sat });
  check('act', { act: profile.act });

  const errors = FIELD_ORDER.flatMap((f) => (fieldErrors[f] ? [fieldErrors[f]] : []));
  const blocking = FIELD_ORDER.some((f) => fieldErrors[f]);
  const hasData =
    profile.gpa !== null || profile.sat !== null || profile.act !== null || profile.classRankTopPercent !== null;
  return { profile, errors, fieldErrors, hasData, ready: hasData && !blocking };
}

const blankProfile: StudentProfile = {
  gpa: null,
  sat: null,
  act: null,
  classRankTopPercent: null,
  intendedMajor: null,
  residency: null,
};
