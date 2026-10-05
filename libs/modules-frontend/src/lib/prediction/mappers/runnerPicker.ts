/** Runners shown before any search: the best indexes of the field. */
export const PICKER_RUNNER_LIMIT = 50;

export type PickerRunner = {
  fullName: string;
  lastName: string;
  favoriteRank: number | null;
  isWithdrawn: boolean;
};

export type PickerOrder = 'index' | 'name';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function byFavoriteRank(a: PickerRunner, b: PickerRunner): number {
  return (
    (a.favoriteRank ?? Number.MAX_SAFE_INTEGER) -
    (b.favoriteRank ?? Number.MAX_SAFE_INTEGER)
  );
}

function byName(a: PickerRunner, b: PickerRunner): number {
  return a.lastName.localeCompare(b.lastName, 'fr');
}

export type PickerSelection<T> = {
  runners: T[];
  hiddenCount: number;
};

/**
 * Without a search, the top of the field by index; a search looks through the
 * whole start list so a known outsider can still be picked.
 */
export function selectPickerRunners<T extends PickerRunner>(
  runners: T[],
  {
    query,
    order,
    limit = PICKER_RUNNER_LIMIT,
  }: { query: string; order: PickerOrder; limit?: number },
): PickerSelection<T> {
  const active = runners.filter((runner) => !runner.isWithdrawn);
  const search = normalize(query.trim());
  const pool = search
    ? active.filter((runner) => normalize(runner.fullName).includes(search))
    : [...active].sort(byFavoriteRank).slice(0, limit);
  return {
    runners: [...pool].sort(order === 'name' ? byName : byFavoriteRank),
    hiddenCount: search ? 0 : Math.max(active.length - pool.length, 0),
  };
}
