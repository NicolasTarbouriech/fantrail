import { isSameNationality } from './countries';
import { nameTokens, sameTokens } from './text';

export type UtmbCandidate = {
  id: number;
  fullname: string;
  uri: string;
  index: number | null;
  nationality: string | null;
  sex: string | null;
};

export type MatchQuery = {
  name: string;
  nationality: string | null;
  /** Index already known, from LiveTrail: an equal index confirms a looser name. */
  index?: number | null;
};

export type MatchResult =
  | { kind: 'match'; candidate: UtmbCandidate; by: 'name' | 'index' }
  | { kind: 'ambiguous'; candidates: UtmbCandidate[] }
  | { kind: 'partial'; candidates: UtmbCandidate[] }
  | { kind: 'none'; nearCandidates: UtmbCandidate[] };

/** Index gap above which the strongest homonym is taken without asking a human. */
export const CLEAR_INDEX_GAP = 50;
/** Two indexes this close describe the same runner. */
export const SAME_INDEX_TOLERANCE = 5;

function byIndexDesc(a: UtmbCandidate, b: UtmbCandidate): number {
  return (b.index ?? 0) - (a.index ?? 0);
}

/** One name holds every word of the other and they share at least two: "Marc Bernades" ⊂ "Marc Bernades Ollé". */
export function isCompatibleName(a: string[], b: string[]): boolean {
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  const longerSet = new Set(longer);
  return shorter.length >= 2 && shorter.every((token) => longerSet.has(token));
}

/**
 * Same words in the name, accents, case and hyphens aside, and the same nationality when both
 * are known. Homonyms resolve to the strongest index only when the gap is clear. A looser name
 * is accepted only when the index already known confirms it.
 */
export function matchRunner(
  query: MatchQuery,
  candidates: UtmbCandidate[],
  clearGap = CLEAR_INDEX_GAP,
): MatchResult {
  const tokens = nameTokens(query.name);
  const sameName = candidates.filter((candidate) =>
    sameTokens(nameTokens(candidate.fullname), tokens),
  );
  const strict = sameName
    .filter((candidate) =>
      isSameNationality(query.nationality, candidate.nationality),
    )
    .sort(byIndexDesc);
  const [first, second] = strict;
  if (
    first &&
    (!second || (first.index ?? 0) - (second.index ?? 0) >= clearGap)
  ) {
    return { kind: 'match', candidate: first, by: 'name' };
  }
  if (first) {
    return { kind: 'ambiguous', candidates: strict };
  }

  const compatible = candidates.filter((candidate) =>
    isCompatibleName(nameTokens(candidate.fullname), tokens),
  );
  const expectedIndex = query.index ?? null;
  if (expectedIndex !== null) {
    const sameIndex = compatible.filter(
      (candidate) =>
        candidate.index !== null &&
        Math.abs(candidate.index - expectedIndex) <= SAME_INDEX_TOLERANCE,
    );
    const [only, other] = sameIndex;
    if (only && !other) {
      return { kind: 'match', candidate: only, by: 'index' };
    }
  }
  const partial = compatible
    .filter(
      (candidate) =>
        !sameName.includes(candidate) &&
        isSameNationality(query.nationality, candidate.nationality),
    )
    .sort(byIndexDesc);
  if (partial.length > 0) {
    return { kind: 'partial', candidates: partial };
  }
  return { kind: 'none', nearCandidates: [...sameName].sort(byIndexDesc) };
}

export function strongestIndex(candidates: UtmbCandidate[]): number {
  return Math.max(0, ...candidates.map((candidate) => candidate.index ?? 0));
}

/** Gap between two indexed homonyms above which a reviewer takes the strongest. */
export const REVIEW_CLEAR_GAP = 100;

/**
 * Suggestion for a human review, nationality aside: the exact name with a single
 * indexed runner, or one clearly stronger than the other indexed homonyms.
 */
export function suggestReviewedCandidate(
  name: string,
  candidates: UtmbCandidate[],
  clearGap = REVIEW_CLEAR_GAP,
): UtmbCandidate | null {
  const tokens = nameTokens(name);
  const [first, second] = candidates
    .filter(
      (candidate) =>
        (candidate.index ?? 0) > 0 &&
        candidate.sex !== null &&
        sameTokens(nameTokens(candidate.fullname), tokens),
    )
    .sort(byIndexDesc);
  if (!first) {
    return null;
  }
  return !second || (first.index ?? 0) - (second.index ?? 0) >= clearGap
    ? first
    : null;
}
