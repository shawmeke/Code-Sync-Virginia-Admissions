/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { validateCollege, validateProfile } from './validation.ts';
import { colleges, sources } from '../data/colleges.ts';
import type { StudentProfile } from '../types/student.ts';

const blank: StudentProfile = {
  gpa: null,
  sat: null,
  act: null,
  classRankTopPercent: null,
  rigor: null,
  intendedMajor: null,
  residency: null,
};

test('every college record passes its data checks', () => {
  const ids = sources.map((s) => s.id);
  for (const c of colleges) {
    assert.deepEqual(validateCollege(c, ids), [], c.name);
  }
});

test('college ids are unique', () => {
  const ids = colleges.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('data checks catch a reversed SAT range and a mismatched offer rate', () => {
  const ids = sources.map((s) => s.id);
  const odu = colleges.find((c) => c.id === 'odu')!;
  const broken = {
    ...odu,
    sat: { ...odu.sat!, value: { p25: 1300, p75: 1200 } },
    offerRate: { ...odu.offerRate!, value: 80 },
  };
  const errors = validateCollege(broken, ids);
  assert.ok(errors.some((e) => e.includes('SAT range')));
  assert.ok(errors.some((e) => e.includes('Offer rate')));
});

test('data checks catch GPA bands that do not add up to 100%', () => {
  const odu = colleges.find((c) => c.id === 'odu')!;
  const broken = { ...odu, gpaBands: { ...odu.gpaBands!, value: odu.gpaBands!.value.slice(1) } };
  assert.ok(validateCollege(broken, sources.map((s) => s.id)).some((e) => e.includes('add up')));
});

test('a blank profile is valid', () => {
  assert.deepEqual(validateProfile(blank), []);
});

test('profile checks reject impossible values', () => {
  assert.equal(validateProfile({ ...blank, gpa: { value: 4.3, scale: 4, weighted: false } }).length, 1);
  assert.equal(validateProfile({ ...blank, gpa: { value: 4.3, scale: 5, weighted: false } }).length, 1);
  assert.equal(validateProfile({ ...blank, sat: 1605 }).length, 1);
  assert.equal(validateProfile({ ...blank, act: 37 }).length, 1);
  assert.equal(validateProfile({ ...blank, classRankTopPercent: 0 }).length, 1);
  assert.equal(validateProfile({ ...blank, rigor: { advancedTaken: 5, advancedAvailable: 3 } }).length, 1);
});

test('a student can enter both an SAT and an ACT score', () => {
  assert.deepEqual(validateProfile({ ...blank, sat: 1400, act: 31 }), []);
});

test('data checks catch a median outside its range and residency counts that exceed totals', () => {
  const ids = sources.map((s) => s.id);
  const uva = colleges.find((c) => c.id === 'uva')!;
  const badMedian = { ...uva, sat: { ...uva.sat!, value: { p25: 1410, p50: 1530, p75: 1520 } } };
  assert.ok(validateCollege(badMedian, ids).some((e) => e.includes('SAT range')));
  const r = uva.residencyOffers!;
  const badResidency = {
    ...uva,
    residencyOffers: { ...r, value: { ...r.value, virginia: { applied: 100, admitted: 200 } } },
  };
  assert.ok(validateCollege(badResidency, ids).some((e) => e.includes('Residency')));
});

test('a weighted 5.0 GPA is a valid entry', () => {
  assert.deepEqual(validateProfile({ ...blank, gpa: { value: 4.6, scale: 5, weighted: true } }), []);
});
