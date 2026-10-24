/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatEarlyPlan, formatTopPercent } from './format.ts';

test('top percents keep one decimal, or two under 1% so rank 1 never rounds to zero', () => {
  assert.equal(formatTopPercent((12 * 100) / 350), '3.4');
  assert.equal(formatTopPercent(12.5), '12.5');
  assert.equal(formatTopPercent(0.2), '0.2');
  assert.equal(formatTopPercent(100 / 3000), '0.03');
  assert.equal(formatTopPercent(100), '100');
});

test('early plans read as a date, "Not offered" or "Not available"', () => {
  assert.equal(formatEarlyPlan({ offered: true, deadline: 'Nov 1' }), 'Nov 1');
  assert.equal(formatEarlyPlan({ offered: true, deadline: null }), 'Offered');
  assert.equal(formatEarlyPlan({ offered: false, deadline: null }), 'Not offered');
  assert.equal(formatEarlyPlan(null), 'Not available');
  assert.equal(formatEarlyPlan(undefined), 'Not available');
});
