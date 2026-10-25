import type { ScoreRange, TestPolicy } from '../types/college.ts';

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatPercent(n: number): string {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}%`;
}

export function formatRange(r: ScoreRange): string {
  return `${r.p25}–${r.p75}`;
}

export const TEST_POLICY_LABELS: Record<TestPolicy, string> = {
  required: 'Test required',
  some: 'Test required for some',
  optional: 'Test-optional',
  blind: 'Test-blind',
  unknown: 'Test policy not recorded',
};

// "about the 42nd percentile". The very ends are shown as a range, because
// nothing published says where the top or bottom of a class lies.
export function formatPercentile(n: number): string {
  if (n < 5) return 'below the 5th percentile';
  if (n > 95) return 'above the 95th percentile';
  return `about the ${ordinal(Math.round(n))} percentile`;
}

// The same estimate, short enough for a row header: "~42nd percentile".
export function formatPercentileShort(n: number): string {
  if (n < 5) return 'Below 5th percentile';
  if (n > 95) return 'Above 95th percentile';
  return `~${ordinal(Math.round(n))} percentile`;
}

function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

// "0.2", "3.4", "12.5": one decimal, or two under 1% so the top of a large
// class doesn't round to zero.
export function formatTopPercent(p: number): string {
  return String(Number(p.toFixed(p < 1 ? 2 : 1)));
}

// An early decision or early action plan as one value: its deadline,
// "Not offered", or "Not available" when the document doesn't say.
export function formatEarlyPlan(plan: { offered: boolean; deadline: string | null } | null | undefined): string {
  if (!plan) return 'Not available';
  if (!plan.offered) return 'Not offered';
  return plan.deadline ?? 'Offered';
}
