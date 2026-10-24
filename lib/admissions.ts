import type { College, ProgramNote, ResidencyCounts, ScoreRange, Stat } from '../types/college.ts';
import type { StudentProfile } from '../types/student.ts';
import { formatCount, formatPercentile, formatPercentileShort, formatTopPercent } from './format.ts';

// Compares a student's academic profile with a college's published figures,
// one measure at a time. This is deliberately NOT an admission probability.
// Each measure says where the student sits relative to the published middle
// 50%, estimates a percentile among enrolled students when the published
// figures allow it, cites the figure it used, and explains when a comparison
// isn't possible instead of skipping it.
//
// The Academic Match score averages those percentiles. It describes how the
// student's numbers compare with past enrolled students, nothing more.

export type MetricKey = 'sat' | 'act' | 'gpa' | 'classRank';

// The measures Academic Match is built from. SAT and ACT count as one "test"
// measure so a student who sends both isn't counted twice.
export type MatchMeasure = 'test' | 'gpa' | 'classRank';

export type Position = 'below' | 'within' | 'above';

export type MetricStatus =
  | 'compared' // the student's value was placed against the college's figures
  | 'context-only' // shown for information; there is nothing published to compare with
  | 'student-missing' // the student left this blank
  | 'college-missing' // the college's figures for this aren't in the app
  | 'incompatible'; // both exist but can't be compared fairly (e.g. different GPA scales)

export type MetricResult = {
  metric: MetricKey;
  label: string;
  status: MetricStatus;
  // Null when the student can't be placed above, within, or below.
  position: Position | null;
  // Estimated share (1–99) of the college's students the student is ahead
  // of on this measure. Null when the published figures can't support one.
  percentile: number | null;
  // How the percentile is shown, e.g. "~42nd percentile". A test score past
  // the published range is labeled by that range ("Above 75th percentile"),
  // because nothing published says how far past it the student is.
  percentileLabel: string | null;
  summary: string;
  caveats: string[];
  // The published figure the comparison used, so the screen can cite it.
  stat: Stat<unknown> | null;
};

const MEASURE_NAMES: Record<MatchMeasure, string> = {
  test: 'test score',
  gpa: 'GPA',
  classRank: 'class rank',
};

// "test score, GPA and class rank"
export function describeMeasures(measures: MatchMeasure[]): string {
  const names = measures.map((m) => MEASURE_NAMES[m]);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// Null when a match uses all three measures; otherwise which ones it rests
// on, e.g. "test score only", so a score from one measure isn't mistaken for
// a full comparison.
export function matchBasis(match: AcademicMatch): string | null {
  return match.measures.length === 3 ? null : `${describeMeasures(match.measures)} only`;
}

export type AcademicMatch = {
  // 0–100: the average of the measure percentiles, rounded.
  score: number;
  measures: MatchMeasure[];
};

export type CollegeAlignment = {
  collegeId: string;
  collegeName: string;
  cycle: string;
  metrics: MetricResult[];
  // Counted over the match measures, with the stronger test standing for both.
  positions: Record<Position, number>;
  comparedCount: number;
  match: AcademicMatch | null;
  // Notes for a specific program that matches the student's intended major.
  programNotes: ProgramNote[];
  contextNotes: string[];
};

// Placing a student is like finding where they'd fall in a line of the
// cohort: if more than 75% of the cohort is ahead, they're below the middle
// half; if more than 75% is behind, they're above it.
const QUARTILE_SHARE = 75;

export function alignWithCollege(profile: StudentProfile, college: College): CollegeAlignment {
  const sat = compareTest(profile, college, 'SAT');
  const act = compareTest(profile, college, 'ACT');
  const gpa = compareGpa(profile, college);
  const classRank = compareClassRank(profile, college);
  const metrics = [sat, act, gpa, classRank];

  const measures: [MatchMeasure, MetricResult][] = [
    ['test', strongerTest(sat, act)],
    ['gpa', gpa],
    ['classRank', classRank],
  ];

  const positions: Record<Position, number> = { below: 0, within: 0, above: 0 };
  for (const [, m] of measures) {
    if (m.position) positions[m.position]++;
  }

  const estimated = measures.filter(([, m]) => m.percentile !== null);
  const match: AcademicMatch | null = estimated.length
    ? {
        score: Math.round(estimated.reduce((sum, [, m]) => sum + m.percentile!, 0) / estimated.length),
        measures: estimated.map(([key]) => key),
      }
    : null;

  return {
    collegeId: college.id,
    collegeName: college.name,
    cycle: college.cycle,
    metrics,
    positions,
    comparedCount: measures.filter(([, m]) => m.status === 'compared').length,
    match,
    programNotes: matchProgramNotes(profile.intendedMajor, college.programNotes),
    contextNotes: contextNotes(profile, college),
  };
}

// The test result that stands for "test" in the match: the one with the
// higher percentile, since students send colleges their stronger score.
function strongerTest(sat: MetricResult, act: MetricResult): MetricResult {
  if (sat.percentile === null && act.percentile === null) {
    return act.status === 'compared' && sat.status !== 'compared' ? act : sat;
  }
  if (sat.percentile === null) return act;
  if (act.percentile === null) return sat;
  return act.percentile > sat.percentile ? act : sat;
}

// A one-line, non-predictive description of an alignment for list views.
export function describeAlignment(a: CollegeAlignment): string {
  // Test, GPA and class rank. Rigor is never compared, so it doesn't count.
  const total = 3;
  if (a.comparedCount === 0) return `Not enough published data to compare your profile with ${a.collegeName}.`;
  const parts = (['above', 'within', 'below'] as const)
    .filter((p) => a.positions[p] > 0)
    .map((p) => `${a.positions[p]} ${p}`);
  const placed = parts.length ? `: ${parts.join(', ')} the middle 50%` : '';
  return `Compared on ${a.comparedCount} of ${total} measures${placed}.`;
}

export function rangePosition(value: number, range: { p25: number; p75: number }): Position {
  if (value < range.p25) return 'below';
  if (value > range.p75) return 'above';
  return 'within';
}

// Estimates the percentile of a score from the published 25th, 50th and 75th
// percentiles by drawing straight lines between them, and extending the
// nearest line beyond them. Kept between 1 and 99, because nothing published
// says where the very top or bottom of the class lies.
export function estimateRangePercentile(value: number, range: ScoreRange): number {
  const points: [number, number][] = [[range.p25, 25]];
  if (range.p50 !== undefined) points.push([range.p50, 50]);
  points.push([range.p75, 75]);

  // Segments with no width (e.g. ACT 33–33) can't give a slope, so skip them.
  const segments: [[number, number], [number, number]][] = [];
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > points[i - 1][0]) segments.push([points[i - 1], points[i]]);
  }
  if (!segments.length) return value < range.p25 ? 1 : value > range.p75 ? 99 : 50;

  // Scores below the first point use the first line; above the last, the last.
  const [[x0, y0], [x1, y1]] = segments.find(([, [x]]) => value <= x) ?? segments[segments.length - 1];
  const estimate = y0 + ((value - x0) * (y1 - y0)) / (x1 - x0);
  return clampPercentile(estimate);
}

// "at about the 42nd percentile", but "above the 95th percentile" without
// the "at", since the extremes are given as a range.
function atPercentile(percentile: number): string {
  const phrase = formatPercentile(percentile);
  return phrase.startsWith('about') ? `at ${phrase}` : phrase;
}

function clampPercentile(n: number): number {
  return Math.min(99, Math.max(1, n));
}

function compareTest(profile: StudentProfile, college: College, type: 'SAT' | 'ACT'): MetricResult {
  const base = {
    metric: type === 'SAT' ? ('sat' as const) : ('act' as const),
    label: type,
    percentile: null,
    percentileLabel: null,
  };
  const score = type === 'SAT' ? profile.sat : profile.act;
  const other = type === 'SAT' ? profile.act : profile.sat;

  if (score === null) {
    const otherType = type === 'SAT' ? 'ACT' : 'SAT';
    // The SAT row carries the testing-policy message when neither test was entered.
    const summary =
      other !== null
        ? `You didn't enter an ${type} score. That's fine: colleges only need one, and you entered an ${otherType}.`
        : type === 'ACT'
          ? "You haven't entered an ACT score."
          : college.testPolicy === 'required'
            ? `${college.name} requires a test score, and you haven't entered one.`
            : college.testPolicy === 'unknown'
              ? `You aren't submitting a test score. Check ${college.name}'s current testing policy.`
              : `You aren't submitting a test score. ${college.name} is test-${college.testPolicy}, so this isn't counted against you here.`;
    return { ...base, status: 'student-missing', position: null, summary, caveats: [], stat: null };
  }

  const range = type === 'SAT' ? college.sat : college.act;
  const submitShare = type === 'SAT' ? college.satSubmitShare : college.actSubmitShare;

  if (!range) {
    return {
      ...base,
      status: 'college-missing',
      position: null,
      summary: `There's no published ${type} range for ${college.name} in this app yet.`,
      caveats: [],
      stat: null,
    };
  }

  const { p25, p75 } = range.value;
  const position = rangePosition(score, range.value);
  const percentile = Math.round(estimateRangePercentile(score, range.value));
  const caveats: string[] = [];
  if (submitShare && submitShare.value < 50) {
    caveats.push(
      `Only ${submitShare.value}% of ${submitShare.cohort} submitted the ${type}, so this range describes a small group.`,
    );
  }
  if (range.note) caveats.push(range.note);
  caveats.push(
    range.value.p50 === undefined
      ? 'The percentile is estimated from the published 25th and 75th percentiles.'
      : 'The percentile is estimated from the published 25th, 50th and 75th percentiles.',
  );

  const placement =
    position === 'within'
      ? atPercentile(percentile)
      : position === 'above'
        ? 'above the published 75th percentile'
        : 'below the published 25th percentile';
  return {
    ...base,
    status: 'compared',
    position,
    percentile,
    percentileLabel:
      position === 'within'
        ? formatPercentileShort(percentile)
        : position === 'above'
          ? 'Above 75th percentile'
          : 'Below 25th percentile',
    summary: `Your ${type} of ${score} is ${position} the middle 50% (${p25}–${p75}) for ${range.cohort}, ${placement}.`,
    caveats,
    stat: range,
  };
}

function compareGpa(profile: StudentProfile, college: College): MetricResult {
  const base = { metric: 'gpa' as const, label: 'GPA', percentile: null, percentileLabel: null };
  const { gpa } = profile;

  if (!gpa) {
    return { ...base, status: 'student-missing', position: null, summary: "You haven't entered a GPA.", caveats: [], stat: null };
  }

  const { gpaBands: bands, gpaAverage: average } = college;
  if (!bands && !average) {
    return {
      ...base,
      status: 'college-missing',
      position: null,
      summary: `There are no published GPA figures for ${college.name} in this app yet.`,
      caveats: [],
      stat: null,
    };
  }

  // Weighted GPAs use different scales at different high schools and there is
  // no reliable way to convert them, so only like is compared with like.
  const comparable =
    college.gpaScale === 'weighted' ? gpa.weighted : !gpa.weighted && gpa.scale === 4;
  if (!comparable) {
    const yours = gpa.weighted ? `a weighted GPA on a ${gpa.scale}.0 scale` : `a GPA on a ${gpa.scale}.0 scale`;
    const wanted = college.gpaScale === 'weighted' ? 'your weighted GPA' : 'your unweighted GPA on a 4.0 scale';
    return {
      ...base,
      status: 'incompatible',
      position: null,
      summary: `You entered ${yours}, which can't be fairly compared with ${college.name}'s figures. Enter ${wanted} to compare.`,
      caveats: [],
      stat: bands ?? average,
    };
  }

  const caveats: string[] = [];
  if (college.gpaScale === 'unknown') {
    caveats.push(`${college.name} doesn't say whether these GPAs are weighted or unweighted.`);
  }

  if (bands) {
    const sorted = [...bands.value].sort((a, b) => b.min - a.min);
    const band = sorted.find((b) => gpa.value >= b.min);
    if (band) {
      const shareAbove = sumPercent(sorted.filter((b) => b.min > band.max));
      const shareBelow = sumPercent(sorted.filter((b) => b.max < band.min));
      const position: Position =
        shareAbove > QUARTILE_SHARE ? 'below' : shareBelow > QUARTILE_SHARE ? 'above' : 'within';
      // The top group of a weighted-GPA table holds everyone at or above it.
      const rangeText =
        band.min !== band.max
          ? `${band.min.toFixed(2)}–${band.max.toFixed(2)}`
          : band === sorted[0] && college.gpaScale === 'weighted'
            ? `${band.min.toFixed(2)} and above`
            : band.min.toFixed(2);
      // Students are assumed to be spread evenly through each group.
      const span = band.max - band.min;
      const through = span > 0 ? Math.min(1, Math.max(0, (gpa.value - band.min) / span)) : 0.5;
      const percentile = Math.round(clampPercentile(shareBelow + band.percent * through));
      if (average) caveats.push(`Average GPA: ${average.value.toFixed(2)}.`);
      if (bands.note) caveats.push(bands.note);
      caveats.push('The percentile assumes students are spread evenly within each GPA group.');
      return {
        ...base,
        status: 'compared',
        position,
        percentile,
        percentileLabel: formatPercentileShort(percentile),
        summary: `Your GPA of ${gpa.value.toFixed(2)} is in the ${rangeText} group, ${atPercentile(percentile)}. Of ${bands.cohort}, ${round1(shareAbove)}% were in a higher group and ${round1(shareBelow)}% in a lower one.`,
        caveats,
        stat: bands,
      };
    }
  }

  // Only an average is available. An average alone can't place a student in
  // the middle 50%, so no position is given.
  if (!average) {
    return { ...base, status: 'incompatible', position: null, summary: 'Your GPA is outside the published GPA groups.', caveats, stat: bands };
  }
  const relation =
    gpa.value > average.value ? 'above' : gpa.value < average.value ? 'below' : 'equal to';
  return {
    ...base,
    status: 'compared',
    position: null,
    summary: `Your GPA of ${gpa.value.toFixed(2)} is ${relation} the average of ${average.value.toFixed(2)} for ${average.cohort}.`,
    caveats,
    stat: average,
  };
}

function compareClassRank(profile: StudentProfile, college: College): MetricResult {
  const base = { metric: 'classRank' as const, label: 'Class rank', percentile: null, percentileLabel: null };
  const top = profile.classRankTopPercent;

  if (top === null) {
    return {
      ...base,
      status: 'student-missing',
      position: null,
      summary: "You haven't entered a class rank. Many high schools don't rank, so leaving this blank is fine.",
      caveats: [],
      stat: null,
    };
  }

  const rank = college.classRank;
  if (!rank) {
    return {
      ...base,
      status: 'college-missing',
      position: null,
      summary: `There are no published class rank figures for ${college.name} in this app yet.`,
      caveats: [],
      stat: null,
    };
  }

  const r = rank.value;
  const brackets = [
    { limit: 10, share: r.topTenth },
    { limit: 25, share: r.topQuarter },
    { limit: 50, share: r.topHalf },
    { limit: 100, share: 100 },
  ];
  const index = brackets.findIndex((b) => top <= b.limit);
  const yours = brackets[index];

  // Students in a narrower group than yours are definitely ahead of you. The
  // shares are cumulative, so the widest known narrower group counts them all
  // (or at least that many, if the group just above yours isn't published).
  let ahead: { share: number; limit: number; exact: boolean } | null = index === 0 ? { share: 0, limit: 0, exact: true } : null;
  for (let i = index - 1; i >= 0 && !ahead; i--) {
    const share = brackets[i].share;
    if (share !== null) ahead = { share, limit: brackets[i].limit, exact: i === index - 1 };
  }
  // Students outside your group are definitely behind you.
  const behind = yours.share === null ? null : 100 - yours.share;

  if (ahead === null && behind === null) {
    return {
      ...base,
      status: 'college-missing',
      position: null,
      summary: `${college.name}'s published class rank figures don't cover the top ${formatTopPercent(top)}%.`,
      caveats: [],
      stat: rank,
    };
  }

  let position: Position | null = null;
  if (ahead && ahead.share > QUARTILE_SHARE) position = 'below';
  else if (behind !== null && behind > QUARTILE_SHARE) position = 'above';
  else if (ahead && behind !== null) position = 'within';

  // A percentile needs the exact share in your group and in the group just
  // above it. Students are assumed to be spread evenly within your group.
  let percentile: number | null = null;
  if (ahead?.exact && yours.share !== null) {
    const prevLimit = index === 0 ? 0 : brackets[index - 1].limit;
    const through = (yours.limit - top) / (yours.limit - prevLimit);
    percentile = Math.round(clampPercentile(100 - yours.share + (yours.share - ahead.share) * through));
  }

  const sentences = [`You're in the top ${formatTopPercent(top)}% of your class${percentile === null ? '' : `, ${atPercentile(percentile)} of these students`}.`];
  if (ahead && ahead.limit > 0) {
    sentences.push(`${ahead.exact ? '' : 'At least '}${ahead.share}% of ${rank.cohort} were in the top ${ahead.limit}%.`);
  }
  if (behind !== null && yours.limit < 100) {
    sentences.push(`${behind}% were outside the top ${yours.limit}%.`);
  }

  const caveats: string[] = [];
  if (r.reportedShare !== null && r.reportedShare < 100) {
    caveats.push(`Only ${r.reportedShare}% of enrolled students reported a class rank, so these figures describe part of the class.`);
  }

  if (percentile !== null) caveats.push('The percentile assumes students are spread evenly within each class rank group.');

  return {
    ...base,
    status: 'compared',
    position,
    percentile,
    percentileLabel: percentile === null ? null : formatPercentileShort(percentile),
    summary: sentences.join(' '),
    caveats,
    stat: rank,
  };
}

function matchProgramNotes(major: string | null, notes: ProgramNote[]): ProgramNote[] {
  if (!major) return [];
  const words = major.toLowerCase();
  return notes.filter((n) => n.keywords.some((k) => words.includes(k)));
}

function contextNotes(profile: StudentProfile, college: College): string[] {
  const notes: string[] = [];
  const residency = college.residencyOffers;
  if (profile.residency && residency) {
    const virginia = profile.residency === 'virginia';
    const counts: ResidencyCounts = virginia ? residency.value.virginia : residency.value.outOfState;
    const rate = Math.round((counts.admitted / counts.applied) * 100);
    notes.push(
      `${college.name} offered admission to ${rate}% of ${virginia ? 'Virginia' : 'out-of-state'} applicants (${formatCount(counts.admitted)} of ${formatCount(counts.applied)}, ${residency.cohort}). The score ranges above combine both groups.`,
    );
  } else if (profile.residency && college.control === 'public') {
    notes.push(
      'Virginia public universities admit in-state and out-of-state applicants at different rates. These figures combine both groups.',
    );
  }
  if (college.offerRate) {
    notes.push(`Offer rate: ${college.offerRate.value}% (${college.offerRate.cohort}).`);
  }
  return notes;
}

function sumPercent(bands: { percent: number }[]): number {
  return bands.reduce((sum, b) => sum + b.percent, 0);
}

// Sums of decimal shares (e.g. 7.2 + 3.0) pick up floating-point noise.
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
