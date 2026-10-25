/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatShare, MAJORS, majorShare, topFields, UNDECIDED } from './majors.ts';
import { getCollege } from '../data/colleges.ts';

test('the major list is A to Z and includes Undecided', () => {
  assert.deepEqual(MAJORS, [...MAJORS].sort((a, b) => a.localeCompare(b)));
  assert.ok(MAJORS.includes(UNDECIDED) && MAJORS.includes('Engineering'));
  assert.ok(!MAJORS.includes('Construction trades'));
});

test('a major share is reported, none, not published, or not asked', () => {
  assert.deepEqual(majorShare(getCollege('vt')!, 'Engineering'), { status: 'reported', percent: 19.81 });
  // VMI's table has no Agriculture row filled in: it awarded none.
  assert.deepEqual(majorShare(getCollege('vmi')!, 'Agriculture'), { status: 'none' });
  // W&M leaves the whole table blank.
  assert.deepEqual(majorShare(getCollege('wm')!, 'Engineering'), { status: 'not-published' });
  assert.equal(majorShare(getCollege('vt')!, UNDECIDED), null);
  assert.equal(majorShare(getCollege('vt')!, null), null);
});

test('top fields come largest first, and small shares read "Under 1%"', () => {
  const top = topFields(getCollege('vt')!, 2);
  assert.deepEqual(top.map((f) => f.label), ['Business and marketing', 'Engineering']);
  assert.equal(formatShare(24.13), '24.1%');
  assert.equal(formatShare(0), 'Under 1%');
});
