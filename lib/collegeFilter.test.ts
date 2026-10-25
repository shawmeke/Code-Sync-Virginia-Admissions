/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { filterColleges } from './collegeFilter.ts';
import { colleges } from '../data/colleges.ts';

const ids = (list: { id: string }[]) => list.map((c) => c.id).sort();

test('"all" with no search keeps every college', () => {
  assert.deepEqual(ids(filterColleges(colleges, { query: '', filter: 'all', saved: [] })), ids(colleges));
});

test('"saved" keeps only saved colleges, and none when nothing is saved', () => {
  assert.deepEqual(ids(filterColleges(colleges, { query: '', filter: 'saved', saved: ['uva', 'jmu'] })), ['jmu', 'uva']);
  assert.deepEqual(filterColleges(colleges, { query: '', filter: 'saved', saved: [] }), []);
});

test('"public" and "private" filter by control', () => {
  const publics = filterColleges(colleges, { query: '', filter: 'public', saved: [] });
  const privates = filterColleges(colleges, { query: '', filter: 'private', saved: [] });
  assert.ok(publics.every((c) => c.control === 'public'));
  assert.ok(privates.some((c) => c.id === 'richmond') && privates.every((c) => c.control === 'private'));
  assert.equal(publics.length + privates.length, colleges.length);
});

test('search matches name or city, ignoring case and outer spaces', () => {
  assert.deepEqual(ids(filterColleges(colleges, { query: '  NORFOLK ', filter: 'all', saved: [] })), ['odu']);
  assert.deepEqual(ids(filterColleges(colleges, { query: 'mary', filter: 'all', saved: [] })), ['umw', 'wm']);
});
