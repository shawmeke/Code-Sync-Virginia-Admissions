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

export type ParsedProfile = {
  profile: StudentProfile;
  errors: string[];
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

// Turns the form into a profile. A field that isn't a number is reported and
// left out, never silently treated as zero.
export function parseProfileForm(form: ProfileForm): ParsedProfile {
  const errors: string[] = [];
  const rigorErrors: string[] = [];
  const number = (text: string, label: string, into = errors): number | null => {
    // Some keyboards type a decimal comma ("3,8").
    const t = text.trim().replace(',', '.');
    if (!t) return null;
    if (!NUMBER.test(t)) {
      into.push(`${label} must be a number.`);
      return null;
    }
    return Number(t);
  };

  const gpaValue = number(form.gpa, 'GPA');
  const taken = number(form.advancedTaken, 'Advanced courses taken', rigorErrors);
  const available = number(form.advancedAvailable, 'Advanced courses offered', rigorErrors);
  if (!rigorErrors.length && (taken === null) !== (available === null)) {
    rigorErrors.push('Enter both how many advanced courses you took and how many your school offers.');
  }

  const profile: StudentProfile = {
    gpa:
      gpaValue === null
        ? null
        : { value: gpaValue, scale: form.gpaWeighted ? Number(form.gpaScale) : 4, weighted: form.gpaWeighted },
    sat: number(form.sat, 'SAT'),
    act: number(form.act, 'ACT'),
    classRankTopPercent: number(form.classRank, 'Class rank'),
    rigor: taken !== null && available !== null ? { advancedTaken: taken, advancedAvailable: available } : null,
    intendedMajor: form.major.trim() || null,
    residency: form.residency,
  };

  errors.push(...validateProfile({ ...profile, rigor: null }));
  if (profile.rigor) rigorErrors.push(...validateProfile({ ...blankProfile, rigor: profile.rigor }));
  if (rigorErrors.length) profile.rigor = null;

  const hasData =
    profile.gpa !== null || profile.sat !== null || profile.act !== null || profile.classRankTopPercent !== null;
  return { profile, errors: [...errors, ...rigorErrors], hasData, ready: hasData && errors.length === 0 };
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
