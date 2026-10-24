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
  optional: 'Test-optional',
  blind: 'Test-blind',
  unknown: 'Test policy not recorded',
};
