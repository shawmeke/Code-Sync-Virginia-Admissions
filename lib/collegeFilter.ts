import type { College } from '../types/college.ts';

export type CollegeFilter = 'all' | College['control'] | 'saved';

// The search screen's list: colleges matching the chosen filter and whose
// name or city contains the search text.
export function filterColleges(
  colleges: College[],
  { query, filter, saved }: { query: string; filter: CollegeFilter; saved: string[] },
): College[] {
  const q = query.trim().toLowerCase();
  return colleges
    .filter((c) => filter === 'all' || (filter === 'saved' ? saved.includes(c.id) : c.control === filter))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
}
