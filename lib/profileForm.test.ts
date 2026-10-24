/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { emptyProfileForm, parseProfileForm } from './profileForm.ts';

test('an empty form is a valid, empty profile', () => {
  const { profile, errors, hasData } = parseProfileForm(emptyProfileForm);
  assert.deepEqual(errors, []);
  assert.equal(hasData, false);
  assert.equal(profile.gpa, null);
  assert.equal(profile.sat, null);
  assert.equal(profile.act, null);
});

test('typed numbers become a profile, with both tests kept', () => {
  const { profile, errors, hasData } = parseProfileForm({
    ...emptyProfileForm,
    gpa: '3.85',
    sat: '1450',
    act: '33',
    classRank: '8',
    advancedTaken: '6',
    advancedAvailable: '12',
    residency: 'virginia',
    major: ' Biology ',
  });
  assert.deepEqual(errors, []);
  assert.equal(hasData, true);
  assert.deepEqual(profile.gpa, { value: 3.85, scale: 4, weighted: false });
  assert.equal(profile.sat, 1450);
  assert.equal(profile.act, 33);
  assert.equal(profile.classRankTopPercent, 8);
  assert.deepEqual(profile.rigor, { advancedTaken: 6, advancedAvailable: 12 });
  assert.equal(profile.residency, 'virginia');
  assert.equal(profile.intendedMajor, 'Biology');
});

test('a weighted GPA uses the chosen scale', () => {
  const { profile } = parseProfileForm({ ...emptyProfileForm, gpa: '4.4', gpaWeighted: true, gpaScale: '5' });
  assert.deepEqual(profile.gpa, { value: 4.4, scale: 5, weighted: true });
});

test('text that is not a number is reported, not silently dropped', () => {
  const { errors, profile } = parseProfileForm({ ...emptyProfileForm, sat: '14OO' });
  assert.equal(profile.sat, null);
  assert.ok(errors.some((e) => e.startsWith('SAT')));
});

test('out-of-range values are reported', () => {
  const { errors } = parseProfileForm({ ...emptyProfileForm, act: '40', gpa: '4.5' });
  assert.equal(errors.length, 2);
});

test('advanced courses need both numbers', () => {
  const { errors, profile } = parseProfileForm({ ...emptyProfileForm, advancedTaken: '4' });
  assert.equal(profile.rigor, null);
  assert.ok(errors.some((e) => e.includes('advanced')));
});

test('a half-entered course rigor pair does not block the comparison', () => {
  const { errors, ready, profile } = parseProfileForm({ ...emptyProfileForm, sat: '1400', advancedTaken: '6' });
  assert.equal(errors.length, 1);
  assert.equal(ready, true);
  assert.equal(profile.rigor, null);
});

test('a bad test score does block the comparison', () => {
  assert.equal(parseProfileForm({ ...emptyProfileForm, sat: '12' }).ready, false);
});

test('exponent and hex text are not accepted as numbers', () => {
  for (const sat of ['1e3', '0x5DC', '+1400', '14 00']) {
    const { profile, errors } = parseProfileForm({ ...emptyProfileForm, sat });
    assert.equal(profile.sat, null, sat);
    assert.ok(errors.some((e) => e.startsWith('SAT')), sat);
  }
});

test('a decimal comma is read as a decimal point', () => {
  const { profile, errors } = parseProfileForm({ ...emptyProfileForm, gpa: '3,8' });
  assert.deepEqual(errors, []);
  assert.equal(profile.gpa?.value, 3.8);
});
