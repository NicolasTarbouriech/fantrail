export type PickList = Array<string | null>;

export function createPickList(
  pickCount: number,
  source: PickList = [],
): PickList {
  return Array.from({ length: pickCount }, (_, index) => source[index] ?? null);
}

/** Puts a runner at a position; if he was already picked elsewhere, the two places swap. */
export function setPick(
  pickList: PickList,
  position: number,
  runnerId: string,
): PickList {
  const next = [...pickList];
  const previousPosition = next.indexOf(runnerId);
  if (previousPosition !== -1) {
    next[previousPosition] = next[position] ?? null;
  }
  next[position] = runnerId;
  return next;
}

export function clearPick(pickList: PickList, position: number): PickList {
  return pickList.map((runnerId, index) =>
    index === position ? null : runnerId,
  );
}

export function movePick(
  pickList: PickList,
  from: number,
  to: number,
): PickList {
  const next = [...pickList];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved ?? null);
  return next;
}

export function countPicks(pickList: PickList): number {
  return pickList.filter((runnerId) => runnerId !== null).length;
}

export function isSamePickList(a: PickList, b: PickList): boolean {
  return (
    a.length === b.length && a.every((runnerId, index) => runnerId === b[index])
  );
}
