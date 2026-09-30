import { FieldLockedError, RunnerNotFoundError } from '../errors';
import {
  buildField,
  buildRunnerData,
  buildRunnerId,
  buildStartList,
} from '../testing';

describe('StartListAggregate', () => {
  const field = buildField();
  const beforeLock = new Date('2026-10-14T10:00:00Z');
  const afterLock = new Date('2026-10-15T18:00:00Z');

  it('ranks active runners only', () => {
    const startList = buildStartList({ runnerCount: 3 });
    startList.withdrawRunner(buildRunnerId(1), field, beforeLock);
    expect(startList.activeRunnerList).toHaveLength(2);
    expect(startList.favoriteRankByRunnerId).toEqual({
      [buildRunnerId(2)]: 1,
      [buildRunnerId(3)]: 2,
    });
  });

  it('adds, updates, withdraws and reinstates runners before the lock', () => {
    const startList = buildStartList({ runnerCount: 1 });
    const [added] = startList.addRunnerList(
      [buildRunnerData({ lastName: 'Dauwalter' })],
      field,
      beforeLock,
    );
    startList.updateRunner(
      buildRunnerId(1),
      buildRunnerData({ index: 950 }),
      field,
      beforeLock,
    );
    startList.withdrawRunner(buildRunnerId(1), field, beforeLock);
    expect(startList.findRunner(buildRunnerId(1)).isWithdrawn).toBe(true);
    startList.reinstateRunner(buildRunnerId(1), field, beforeLock);
    expect(startList.runnerList.map(({ lastName }) => lastName)).toEqual([
      'Pommeret',
      'Dauwalter',
    ]);
    expect(startList.findRunner(buildRunnerId(1))).toMatchObject({
      index: 950,
      isWithdrawn: false,
    });
    expect(startList.findRunner(added.id).lastName).toBe('Dauwalter');
  });

  it('refuses any change once the field is locked', () => {
    const startList = buildStartList();
    expect(() =>
      startList.addRunnerList([buildRunnerData()], field, afterLock),
    ).toThrow(FieldLockedError);
    expect(() =>
      startList.withdrawRunner(buildRunnerId(1), field, afterLock),
    ).toThrow(FieldLockedError);
    expect(() =>
      startList.updateRunner(
        buildRunnerId(1),
        buildRunnerData(),
        field,
        afterLock,
      ),
    ).toThrow(FieldLockedError);
  });

  it('throws when the runner is unknown', () => {
    expect(() => buildStartList().findRunner(buildRunnerId(99))).toThrow(
      RunnerNotFoundError,
    );
  });
});
