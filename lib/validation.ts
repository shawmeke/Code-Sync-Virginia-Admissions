import type { College, ScoreRange } from '../types/college.ts';
import type { StudentProfile } from '../types/student.ts';

// Returns a list of problems with what the student entered. An empty list
// means the profile is safe to compare.
export function validateProfile(p: StudentProfile): string[] {
  const errors: string[] = [];

  if (p.gpa) {
    const { value, scale, weighted } = p.gpa;
    if (!(scale > 0)) errors.push('GPA scale must be a positive number.');
    else if (!(value >= 0 && value <= scale)) errors.push(`GPA must be between 0 and ${scale}.`);
    if (!weighted && scale !== 4) errors.push('Unweighted GPAs should be on a 4.0 scale.');
  }

  if (p.sat !== null && !(Number.isInteger(p.sat) && p.sat >= 400 && p.sat <= 1600 && p.sat % 10 === 0)) {
    errors.push('SAT total must be between 400 and 1600, in steps of 10.');
  }
  if (p.act !== null && !(Number.isInteger(p.act) && p.act >= 1 && p.act <= 36)) {
    errors.push('ACT composite must be a whole number from 1 to 36.');
  }

  if (p.classRankTopPercent !== null && !(p.classRankTopPercent > 0 && p.classRankTopPercent <= 100)) {
    errors.push('Class rank must be a percentage above 0 and at most 100.');
  }

  return errors;
}

// Checks a college record for internal consistency, so a typo in the data
// file fails a test instead of producing a wrong comparison in the app.
export function validateCollege(c: College, sourceIds: string[]): string[] {
  const errors: string[] = [];
  const isPercent = (n: number) => n >= 0 && n <= 100;

  const stats = [
    c.applicants, c.admitted, c.enrolled, c.offerRate, c.residencyOffers, c.sat, c.act,
    c.satSubmitShare, c.actSubmitShare, c.gpaAverage, c.gpaBands, c.classRank, c.applying,
  ];
  for (const stat of stats) {
    if (stat && !sourceIds.includes(stat.sourceId)) errors.push(`Unknown source "${stat.sourceId}".`);
  }

  if (c.admitted && c.applicants && c.admitted.value > c.applicants.value) {
    errors.push('More admitted students than applicants.');
  }
  if (c.enrolled && c.admitted && c.enrolled.value > c.admitted.value) {
    errors.push('More enrolled students than admitted students.');
  }
  // When the offer rate is calculated from this cycle's counts, it must match them.
  if (c.offerRate?.derived && c.admitted && c.applicants) {
    const computed = (c.admitted.value / c.applicants.value) * 100;
    if (Math.abs(computed - c.offerRate.value) > 0.01) {
      errors.push(`Offer rate ${c.offerRate.value}% does not match ${computed.toFixed(2)}% from the counts.`);
    }
  }
  if (c.offerRate && !isPercent(c.offerRate.value)) errors.push('Offer rate must be a percentage.');

  if (c.sat && !validRange(c.sat.value, 400, 1600)) errors.push('SAT range is invalid.');
  if (c.act && !validRange(c.act.value, 1, 36)) errors.push('ACT range is invalid.');

  if (c.applying) {
    const { fee, factors } = c.applying.value;
    if (fee !== null && !(fee >= 0)) errors.push('Application fee must be zero or more.');
    const levels = ['very important', 'important', 'considered', 'not considered'];
    for (const [name, level] of Object.entries(factors)) {
      if (level !== null && !levels.includes(level)) errors.push(`Unknown importance "${level}" for ${name}.`);
    }
  }

  if (c.residencyOffers) {
    const { virginia, outOfState } = c.residencyOffers.value;
    for (const g of [virginia, outOfState]) {
      if (!(g.applied > 0 && g.admitted >= 0 && g.admitted <= g.applied)) errors.push('Residency counts are invalid.');
    }
    if (c.applicants && virginia.applied + outOfState.applied > c.applicants.value) {
      errors.push('Residency applicants add up to more than all applicants.');
    }
    if (c.admitted && virginia.admitted + outOfState.admitted > c.admitted.value) {
      errors.push('Residency offers add up to more than all offers.');
    }
  }
  for (const share of [c.satSubmitShare, c.actSubmitShare]) {
    if (share && !isPercent(share.value)) errors.push('Test submission share must be a percentage.');
  }

  if (c.gpaBands) {
    const bands = c.gpaBands.value;
    const total = bands.reduce((sum, b) => sum + b.percent, 0);
    if (Math.abs(total - 100) > 1) errors.push(`GPA bands add up to ${total}%, not 100%.`);
    for (const b of bands) {
      if (b.min > b.max) errors.push(`GPA band ${b.min}–${b.max} is backwards.`);
    }
    const sorted = [...bands].sort((a, b) => a.min - b.min);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].min <= sorted[i - 1].max) errors.push(`GPA bands overlap at ${sorted[i].min}.`);
    }
  }

  if (c.classRank) {
    const { topTenth, topQuarter, topHalf, reportedShare } = c.classRank.value;
    const known = [topTenth, topQuarter, topHalf].filter((n): n is number => n !== null);
    if (known.some((n) => !isPercent(n))) errors.push('Class rank shares must be percentages.');
    // Shares are cumulative, so each wider group must include the narrower one.
    for (let i = 1; i < known.length; i++) {
      if (known[i] < known[i - 1]) errors.push('Class rank shares must not decrease from top tenth to top half.');
    }
    if (reportedShare !== null && !isPercent(reportedShare)) errors.push('Rank reporting share must be a percentage.');
  }

  return errors;
}

// A middle-50% range inside the test's score scale, with the median (if any)
// between the 25th and 75th percentiles.
function validRange(r: ScoreRange, min: number, max: number): boolean {
  const mid = r.p50 ?? r.p25;
  return r.p25 >= min && r.p25 <= mid && mid <= r.p75 && r.p75 <= max;
}
