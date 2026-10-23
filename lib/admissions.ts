import type { College, ProgramNote, Stat } from '../types/college.ts';
import type { StudentProfile } from '../types/student.ts';

// Compares a student's academic profile with a college's published figures,
// one measure at a time. This is deliberately NOT an admission probability:
// it never combines measures into a single score. Each measure says where the
// student sits relative to the published middle 50%, cites the figure it used,
// and explains when a comparison isn't possible instead of skipping it.

export type MetricKey = 'test' | 'gpa' | 'classRank' | 'rigor';

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
  summary: string;
  caveats: string[];
  // The published figure the comparison used, so the screen can cite it.
  stat: Stat<unknown> | null;
};

export type CollegeAlignment = {
  collegeId: string;
  collegeName: string;
  cycle: string;
  metrics: MetricResult[];
  positions: Record<Position, number>;
  comparedCount: number;
  // Notes for a specific program that matches the student's intended major.
  programNotes: ProgramNote[];
  contextNotes: string[];
};

export const POSITION_LABELS: Record<Position, string> = {
  below: 'Below the middle 50%',
  within: 'Within the middle 50%',
  above: 'Above the middle 50%',
};

// Placing a student is like finding where they'd fall in a line of the
// cohort: if more than 75% of the cohort is ahead, they're below the middle
// half; if more than 75% is behind, they're above it.
const QUARTILE_SHARE = 75;

export function alignWithCollege(profile: StudentProfile, college: College): CollegeAlignment {
  const metrics = [
    compareTest(profile, college),
    compareGpa(profile, college),
    compareClassRank(profile, college),
    describeRigor(profile),
  ];

  const positions: Record<Position, number> = { below: 0, within: 0, above: 0 };
  for (const m of metrics) {
    if (m.position) positions[m.position]++;
  }

  return {
    collegeId: college.id,
    collegeName: college.name,
    cycle: college.cycle,
    metrics,
    positions,
    comparedCount: metrics.filter((m) => m.status === 'compared').length,
    programNotes: matchProgramNotes(profile.intendedMajor, college.programNotes),
    contextNotes: contextNotes(profile, college),
  };
}

export function alignWithColleges(profile: StudentProfile, colleges: College[]): CollegeAlignment[] {
  return colleges.map((c) => alignWithCollege(profile, c));
}

// A one-line, non-predictive description of an alignment for list views.
export function describeAlignment(a: CollegeAlignment): string {
  // Rigor is never compared, so it doesn't count toward the total.
  const total = a.metrics.filter((m) => m.metric !== 'rigor').length;
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

function compareTest(profile: StudentProfile, college: College): MetricResult {
  const base = { metric: 'test' as const, label: 'Test score' };

  if (!profile.test) {
    const summary =
      college.testPolicy === 'required'
        ? `${college.name} requires a test score, and you haven't entered one.`
        : college.testPolicy === 'unknown'
          ? `You aren't submitting a test score. Check ${college.name}'s current testing policy.`
          : `You aren't submitting a test score. ${college.name} is test-${college.testPolicy}, so this isn't counted against you here.`;
    return { ...base, status: 'student-missing', position: null, summary, caveats: [], stat: null };
  }

  const { type, score } = profile.test;
  const range = type === 'SAT' ? college.sat : college.act;
  const submitShare = type === 'SAT' ? college.satSubmitShare : college.actSubmitShare;
  const label = type;

  if (!range) {
    return {
      ...base,
      label,
      status: 'college-missing',
      position: null,
      summary: `There's no published ${type} range for ${college.name} in this app yet.`,
      caveats: [],
      stat: null,
    };
  }

  const { p25, p75 } = range.value;
  const position = rangePosition(score, range.value);
  const relation = position === 'within' ? 'within' : position === 'above' ? 'above' : 'below';
  const caveats: string[] = [];
  if (submitShare && submitShare.value < 50) {
    caveats.push(
      `Only ${submitShare.value}% of ${submitShare.cohort} submitted the ${type}, so this range describes a small group.`,
    );
  }
  if (range.note) caveats.push(range.note);

  return {
    ...base,
    label,
    status: 'compared',
    position,
    summary: `Your ${type} of ${score} is ${relation} the middle 50% (${p25}–${p75}) for ${range.cohort}.`,
    caveats,
    stat: range,
  };
}

function compareGpa(profile: StudentProfile, college: College): MetricResult {
  const base = { metric: 'gpa' as const, label: 'GPA' };
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
      const rangeText = band.min === band.max ? band.min.toFixed(2) : `${band.min.toFixed(2)}–${band.max.toFixed(2)}`;
      if (average) caveats.push(`Average GPA: ${average.value.toFixed(2)}.`);
      if (bands.note) caveats.push(bands.note);
      return {
        ...base,
        status: 'compared',
        position,
        summary: `Your GPA of ${gpa.value.toFixed(2)} is in the ${rangeText} group. Of ${bands.cohort}, ${shareAbove}% were in a higher group and ${shareBelow}% in a lower one.`,
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
  const base = { metric: 'classRank' as const, label: 'Class rank' };
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
      summary: `${college.name}'s published class rank figures don't cover the top ${top}%.`,
      caveats: [],
      stat: rank,
    };
  }

  let position: Position | null = null;
  if (ahead && ahead.share > QUARTILE_SHARE) position = 'below';
  else if (behind !== null && behind > QUARTILE_SHARE) position = 'above';
  else if (ahead && behind !== null) position = 'within';

  const sentences = [`You're in the top ${top}% of your class.`];
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

  return { ...base, status: 'compared', position, summary: sentences.join(' '), caveats, stat: rank };
}

// Colleges don't publish a numeric benchmark for course rigor, so it is shown
// as context and never turned into a score.
function describeRigor(profile: StudentProfile): MetricResult {
  const base = { metric: 'rigor' as const, label: 'Course rigor', position: null, caveats: [], stat: null };
  if (!profile.rigor) {
    return { ...base, status: 'student-missing', summary: "You haven't entered your advanced courses." };
  }
  const { advancedTaken, advancedAvailable } = profile.rigor;
  if (advancedAvailable === 0) {
    return {
      ...base,
      status: 'context-only',
      summary: "Your school doesn't offer advanced courses. Colleges consider rigor in the context of what your school offers.",
    };
  }
  const percent = Math.round((advancedTaken / advancedAvailable) * 100);
  return {
    ...base,
    status: 'context-only',
    summary: `You've taken ${advancedTaken} of the ${advancedAvailable} advanced courses your school offers (${percent}%). Colleges don't publish a number to compare this with, so it's shown for context only.`,
  };
}

function matchProgramNotes(major: string | null, notes: ProgramNote[]): ProgramNote[] {
  if (!major) return [];
  const words = major.toLowerCase();
  return notes.filter((n) => n.keywords.some((k) => words.includes(k)));
}

function contextNotes(profile: StudentProfile, college: College): string[] {
  const notes: string[] = [];
  if (profile.residency && college.control === 'public') {
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
