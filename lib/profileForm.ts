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
  classRank: string;
  advancedTaken: string;
  advancedAvailable: string;
  residency: StudentProfile['residency'];
  major: string;
};

export const emptyProfileForm: ProfileForm = {
  gpa: '',
  gpaWeighted: false,
  gpaScale: '5',
  sat: '',
  act: '',
  classRank: '',
  advancedTaken: '',
  advancedAvailable: '',
  residency: null,
  major: '',
};

export type ProfileField = 'gpa' | 'sat' | 'act' | 'classRank' | 'rigor';

export type ParsedProfile = {
  profile: StudentProfile;
  errors: string[];
  // The same problems, keyed by the field they belong to, so the screen can
  // show each one next to its input.
  fieldErrors: Partial<Record<ProfileField, string>>;
  // True when the student has entered anything that can be compared.
  hasData: boolean;
  // True when there's something to compare and nothing that feeds the
  // comparison is invalid. Course rigor is context only, so a problem there
  // is reported but doesn't block the comparison.
  ready: boolean;
};

// Plain digits with an optional decimal part. A trailing "." is allowed so a
// half-typed "3." isn't flagged. Number() alone would also accept "1e3" or "0x5DC".
const NUMBER = /^\d+(\.\d*)?$/;

const FIELD_ORDER: ProfileField[] = ['gpa', 'sat', 'act', 'classRank', 'rigor'];

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
  const taken = number(form.advancedTaken, 'Advanced courses taken', 'rigor');
  const available = number(form.advancedAvailable, 'Advanced courses offered', 'rigor');
  if (!fieldErrors.rigor && (taken === null) !== (available === null)) {
    fieldErrors.rigor = 'Enter both how many advanced courses you took and how many your school offers.';
  }

  const profile: StudentProfile = {
    gpa:
      gpaValue === null
        ? null
        : { value: gpaValue, scale: form.gpaWeighted ? Number(form.gpaScale) : 4, weighted: form.gpaWeighted },
    sat: number(form.sat, 'SAT', 'sat'),
    act: number(form.act, 'ACT', 'act'),
    classRankTopPercent: number(form.classRank, 'Class rank', 'classRank'),
    rigor: taken !== null && available !== null ? { advancedTaken: taken, advancedAvailable: available } : null,
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
  check('classRank', { classRankTopPercent: profile.classRankTopPercent });
  check('rigor', { rigor: profile.rigor });
  if (fieldErrors.rigor) profile.rigor = null;

  const errors = FIELD_ORDER.flatMap((f) => (fieldErrors[f] ? [fieldErrors[f]] : []));
  const blocking = FIELD_ORDER.some((f) => f !== 'rigor' && fieldErrors[f]);
  const hasData =
    profile.gpa !== null || profile.sat !== null || profile.act !== null || profile.classRankTopPercent !== null;
  return { profile, errors, fieldErrors, hasData, ready: hasData && !blocking };
}

const blankProfile: StudentProfile = {
  gpa: null,
  sat: null,
  act: null,
  classRankTopPercent: null,
  rigor: null,
  intendedMajor: null,
  residency: null,
};
