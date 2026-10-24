/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { alignWithCollege, describeAlignment, estimateRangePercentile, matchBasis, rangePosition } from './admissions.ts';
import { getCollege } from '../data/colleges.ts';
import type { College } from '../types/college.ts';
import type { StudentProfile } from '../types/student.ts';

const uva = getCollege('uva')!;
const vt = getCollege('vt')!;
const odu = getCollege('odu')!;
const wm = getCollege('wm')!;
const jmu = getCollege('jmu')!;

const blank: StudentProfile = {
  gpa: null,
  sat: null,
  act: null,
  classRankTopPercent: null,
  rigor: null,
  intendedMajor: null,
  residency: null,
};

const metric = (p: StudentProfile, c: College, key: string) =>
  alignWithCollege(p, c).metrics.find((m) => m.metric === key)!;

test('range edges count as within the middle 50%', () => {
  const range = { p25: 1410, p75: 1540 };
  assert.equal(rangePosition(1400, range), 'below');
  assert.equal(rangePosition(1410, range), 'within');
  assert.equal(rangePosition(1540, range), 'within');
  assert.equal(rangePosition(1550, range), 'above');
});

test('SAT is placed against the college range and cites it', () => {
  const m = metric({ ...blank, sat: 1450 }, uva, 'sat');
  assert.equal(m.status, 'compared');
  assert.equal(m.position, 'within');
  assert.equal(m.stat, uva.sat);
  assert.match(m.summary, /1410–1520/);
  // UVA publishes a total SAT range, so nothing is flagged as approximate.
  assert.ok(!m.caveats.some((c) => c.includes('approximate')));
});

test('ACT is compared against the ACT range, not the SAT range', () => {
  const m = metric({ ...blank, act: 21 }, odu, 'act');
  assert.equal(m.position, 'below');
  assert.match(m.summary, /22–27/);
});

test('a range from few submitters carries a warning', () => {
  const m = metric({ ...blank, sat: 1200 }, odu, 'sat');
  assert.ok(m.caveats.some((c) => c.includes('Only 7%')));
});

test('no test score at a test-optional school is not counted against the student', () => {
  const a = alignWithCollege(blank, uva);
  const m = a.metrics.find((x) => x.metric === 'sat')!;
  assert.equal(m.status, 'student-missing');
  assert.equal(m.position, null);
  assert.match(m.summary, /test-optional/);
  assert.equal(a.positions.below, 0);
});

test('a college with no test data says so instead of guessing', () => {
  const noTests: College = { ...vt, sat: null, act: null };
  const m = metric({ ...blank, sat: 1300 }, noTests, 'sat');
  assert.equal(m.status, 'college-missing');
  assert.equal(m.position, null);
});

test('a SAT range built from section scores says it is approximate', () => {
  const m = metric({ ...blank, sat: 1300 }, vt, 'sat');
  assert.equal(m.status, 'compared');
  assert.equal(m.position, 'within');
  assert.ok(m.caveats.some((c) => c.includes('approximate')));
});

test('unweighted GPA is placed using the published GPA groups', () => {
  const m = metric({ ...blank, gpa: { value: 3.6, scale: 4, weighted: false } }, odu, 'gpa');
  assert.equal(m.status, 'compared');
  assert.equal(m.position, 'within');
  // 4.0 (19%) + 3.75–3.99 (13%) are above; 3.25 and below (15+13+25+0) are below.
  assert.match(m.summary, /3\.50–3\.74 group/);
  assert.match(m.summary, /32% were in a higher group and 53% in a lower one/);
  assert.ok(m.caveats.some((c) => c.includes("doesn't say whether")));
});

test('a 4.0 unweighted GPA is above the middle 50% at ODU', () => {
  const m = metric({ ...blank, gpa: { value: 4.0, scale: 4, weighted: false } }, odu, 'gpa');
  assert.equal(m.position, 'above');
});

test('GPAs between published groups land in the lower group', () => {
  const m = metric({ ...blank, gpa: { value: 3.745, scale: 4, weighted: false } }, odu, 'gpa');
  assert.match(m.summary, /3\.50–3\.74 group/);
});

test('a weighted 5.0-scale GPA is flagged, not silently dropped or mixed in', () => {
  const a = alignWithCollege({ ...blank, gpa: { value: 4.6, scale: 5, weighted: true } }, odu);
  const m = a.metrics.find((x) => x.metric === 'gpa')!;
  assert.equal(m.status, 'incompatible');
  assert.equal(m.position, null);
  assert.match(m.summary, /weighted GPA on a 5\.0 scale/);
  assert.match(m.summary, /unweighted GPA on a 4\.0 scale/);
});

test('a weighted GPA is compared at a college that reports weighted GPAs', () => {
  const m = metric({ ...blank, gpa: { value: 4.2, scale: 5, weighted: true } }, wm, 'gpa');
  assert.equal(m.status, 'compared');
  assert.match(m.summary, /4\.00 and above group/);
});

test('an unweighted GPA is not compared with weighted college figures', () => {
  const m = metric({ ...blank, gpa: { value: 3.9, scale: 4, weighted: false } }, wm, 'gpa');
  assert.equal(m.status, 'incompatible');
  assert.match(m.summary, /Enter your weighted GPA/);
});

test('a college that publishes no GPA or class rank says so', () => {
  const a = alignWithCollege({ ...blank, gpa: { value: 3.8, scale: 4, weighted: false }, classRankTopPercent: 10 }, jmu);
  for (const key of ['gpa', 'classRank']) {
    const m = a.metrics.find((x) => x.metric === key)!;
    assert.equal(m.status, 'college-missing');
    assert.equal(m.position, null);
  }
});

test('a GPA average alone gives a comparison but no middle-50% position', () => {
  const averageOnly: College = { ...odu, gpaBands: null };
  const m = metric({ ...blank, gpa: { value: 3.2, scale: 4, weighted: false } }, averageOnly, 'gpa');
  assert.equal(m.status, 'compared');
  assert.equal(m.position, null);
  assert.match(m.summary, /below the average of 3\.43/);
});

test('class rank uses cumulative shares from the college', () => {
  // Top 20%: 12% were in the top 10% (ahead), 65% were outside the top 25% (behind).
  const m = metric({ ...blank, classRankTopPercent: 20 }, odu, 'classRank');
  assert.equal(m.status, 'compared');
  assert.equal(m.position, 'within');
  assert.match(m.summary, /12% of .* were in the top 10%/);
  assert.match(m.summary, /65% were outside the top 25%/);
  assert.ok(m.caveats.some((c) => c.includes('Only 75%')));
});

test('top 5% at ODU is above the middle 50%', () => {
  const m = metric({ ...blank, classRankTopPercent: 5 }, odu, 'classRank');
  assert.equal(m.position, 'above');
});

test('class rank is used even when only the top-tenth share is published', () => {
  const topTenthOnly: College = {
    ...uva,
    classRank: {
      value: { topTenth: 90, topQuarter: null, topHalf: null, reportedShare: 30 },
      sourceId: 'uva-cds-2024-25',
      cohort: 'test first-years who reported a class rank',
    },
  };
  const inTopTenth = metric({ ...blank, classRankTopPercent: 5 }, topTenthOnly, 'classRank');
  assert.equal(inTopTenth.position, 'within');

  const outside = metric({ ...blank, classRankTopPercent: 40 }, topTenthOnly, 'classRank');
  assert.equal(outside.position, 'below');
  // The top-quarter share is unknown, so the top-tenth share is a lower bound.
  assert.match(outside.summary, /At least 90%/);
  assert.ok(outside.caveats.some((c) => c.includes('Only 30%')));
});

test('course rigor is context only and never earns a position', () => {
  const a = alignWithCollege({ ...blank, rigor: { advancedTaken: 8, advancedAvailable: 8 } }, uva);
  const m = a.metrics.find((x) => x.metric === 'rigor')!;
  assert.equal(m.status, 'context-only');
  assert.equal(m.position, null);
  assert.equal(a.comparedCount, 0);
  assert.match(describeAlignment(a), /Not enough published data/);
});

test('an engineering major sees the Virginia Tech engineering note', () => {
  const a = alignWithCollege({ ...blank, intendedMajor: 'Mechanical Engineering' }, vt);
  assert.equal(a.programNotes.length, 1);
  assert.equal(alignWithCollege({ ...blank, intendedMajor: 'History' }, vt).programNotes.length, 0);
});

test('summary line counts positions without predicting admission', () => {
  const a = alignWithCollege(
    { ...blank, sat: 1300, gpa: { value: 4.0, scale: 4, weighted: false }, classRankTopPercent: 20 },
    odu,
  );
  assert.equal(a.comparedCount, 3);
  assert.deepEqual(a.positions, { below: 0, within: 1, above: 2 });
  assert.equal(describeAlignment(a), 'Compared on 3 of 3 measures: 2 above, 1 within the middle 50%.');
});

test('no output uses chance, odds or probability language', () => {
  const full: StudentProfile = {
    gpa: { value: 3.9, scale: 4, weighted: false },
    sat: 1500,
    act: 34,
    classRankTopPercent: 3,
    rigor: { advancedTaken: 6, advancedAvailable: 10 },
    intendedMajor: 'Computer Engineering',
    residency: 'virginia',
  };
  for (const c of [uva, vt, odu, wm, jmu]) {
    const a = alignWithCollege(full, c);
    const text = [describeAlignment(a), ...a.metrics.flatMap((m) => [m.summary, ...m.caveats]), ...a.contextNotes].join(' ');
    assert.doesNotMatch(text, /chance|odds|probab|likely|guarantee/i);
  }
});

// --- Percentile estimates and Academic Match ---

test('a score between published percentiles is placed by straight-line estimate', () => {
  const range = { p25: 1410, p50: 1470, p75: 1520 };
  assert.equal(estimateRangePercentile(1410, range), 25);
  assert.equal(estimateRangePercentile(1470, range), 50);
  assert.equal(Math.round(estimateRangePercentile(1450, range)), 42);
  assert.equal(estimateRangePercentile(1495, range), 62.5);
});

test('without a median, the estimate runs straight from p25 to p75', () => {
  assert.equal(estimateRangePercentile(1305, { p25: 1280, p75: 1330 }), 50);
});

test('scores outside the middle 50% are estimated but kept between 1 and 99', () => {
  const range = { p25: 1410, p50: 1470, p75: 1520 };
  assert.equal(estimateRangePercentile(1560, range), 95);
  assert.equal(estimateRangePercentile(1600, range), 99);
  assert.equal(estimateRangePercentile(1000, range), 1);
});

test('a flat stretch of a range does not divide by zero', () => {
  const p = estimateRangePercentile(33, { p25: 32, p50: 33, p75: 33 });
  assert.ok(Number.isFinite(p) && p >= 1 && p <= 99);
});

test('SAT and ACT are each compared, and both carry a percentile', () => {
  const a = alignWithCollege({ ...blank, sat: 1450, act: 35 }, uva);
  const sat = a.metrics.find((m) => m.metric === 'sat')!;
  const act = a.metrics.find((m) => m.metric === 'act')!;
  assert.equal(sat.status, 'compared');
  assert.equal(act.status, 'compared');
  assert.equal(sat.percentile, 42);
  assert.equal(act.percentile, 75);
  assert.match(sat.summary, /about the 42nd percentile/);
});

test('entering only one test does not flag the other as missing data to worry about', () => {
  const act = metric({ ...blank, sat: 1450 }, uva, 'act');
  assert.equal(act.status, 'student-missing');
  assert.match(act.summary, /only need one/);
});

test('GPA percentile comes from the published GPA groups', () => {
  const m = metric({ ...blank, gpa: { value: 4.2, scale: 5, weighted: true } }, wm, 'gpa');
  // 11.1% of W&M students are below the 4.0 group; half of the 88.9% group is assumed below you.
  assert.equal(m.percentile, 56);
});

test('class rank percentile spreads students evenly within a published group', () => {
  // UVA: 84% in the top tenth. Top 5% is halfway through that group: 16 + 42 = 58.
  assert.equal(metric({ ...blank, classRankTopPercent: 5 }, uva, 'classRank').percentile, 58);
  assert.equal(metric({ ...blank, classRankTopPercent: 1 }, uva, 'classRank').percentile, 92);
});

test('class rank gives no percentile when the needed groups are not published', () => {
  const topTenthOnly: College = {
    ...uva,
    classRank: { ...uva.classRank!, value: { topTenth: 90, topQuarter: null, topHalf: null, reportedShare: 30 } },
  };
  assert.equal(metric({ ...blank, classRankTopPercent: 40 }, topTenthOnly, 'classRank').percentile, null);
});

test('Academic Match averages the measures it could estimate', () => {
  const a = alignWithCollege(
    { ...blank, sat: 1450, gpa: { value: 4.3, scale: 5, weighted: true }, classRankTopPercent: 5 },
    uva,
  );
  // The shown percentiles are SAT 42, GPA 55 (9.5 + 90.5/2) and rank 58, and
  // the score averages those, so a student can check the math on screen.
  assert.ok(a.match);
  assert.equal(a.match.score, 52);
  assert.deepEqual(a.match.measures, ['test', 'gpa', 'classRank']);
});

test('Academic Match counts tests once, using the stronger of SAT and ACT', () => {
  const a = alignWithCollege({ ...blank, sat: 1450, act: 35 }, uva);
  assert.equal(a.match?.score, 75);
  assert.deepEqual(a.match?.measures, ['test']);
});

test('no Academic Match without at least one estimated measure', () => {
  assert.equal(alignWithCollege(blank, uva).match, null);
  // JMU publishes no GPA or class rank, so a GPA-only profile has nothing to match on.
  assert.equal(alignWithCollege({ ...blank, gpa: { value: 3.8, scale: 4, weighted: false } }, jmu).match, null);
});

test("residency notes use the college's own in-state and out-of-state counts", () => {
  const va = alignWithCollege({ ...blank, residency: 'virginia' }, uva).contextNotes.join(' ');
  assert.match(va, /26% of Virginia applicants/);
  assert.match(va, /4,269 of 16,464/);
  const oos = alignWithCollege({ ...blank, residency: 'out-of-state' }, uva).contextNotes.join(' ');
  assert.match(oos, /14% of out-of-state applicants/);
});

test('without residency counts, the note says the figures combine both groups', () => {
  const notes = alignWithCollege({ ...blank, residency: 'virginia' }, wm).contextNotes.join(' ');
  assert.match(notes, /combine/);
});

// --- Honest labels for estimates ---

test('a test score inside the published range gets an estimated percentile label', () => {
  const m = metric({ ...blank, sat: 1450 }, uva, 'sat');
  assert.equal(m.percentileLabel, '~42nd percentile');
});

test('a test score past the published range is labeled by the range, not an invented number', () => {
  const above = metric({ ...blank, sat: 1580 }, uva, 'sat');
  assert.equal(above.percentileLabel, 'Above 75th percentile');
  assert.match(above.summary, /above the published 75th percentile/);
  assert.doesNotMatch(above.summary, /about the \d/);
  const below = metric({ ...blank, sat: 1200 }, uva, 'sat');
  assert.equal(below.percentileLabel, 'Below 25th percentile');
  assert.match(below.summary, /below the published 25th percentile/);
});

test('a match says which measures it rests on unless it uses all three', () => {
  const testOnly = alignWithCollege({ ...blank, sat: 1450 }, jmu).match!;
  assert.equal(matchBasis(testOnly), 'test score only');
  const two = alignWithCollege({ ...blank, sat: 1450, gpa: { value: 4.3, scale: 5, weighted: true } }, vt).match!;
  assert.equal(matchBasis(two), 'test score and GPA only');
  const all = alignWithCollege(
    { ...blank, sat: 1450, gpa: { value: 4.3, scale: 5, weighted: true }, classRankTopPercent: 5 },
    uva,
  ).match!;
  assert.equal(matchBasis(all), null);
});
