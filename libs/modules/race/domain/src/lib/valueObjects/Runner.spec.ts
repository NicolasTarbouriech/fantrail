import { ZodError } from 'zod';

import { buildRunnerData, buildRunnerId } from '../testing';
import { Runner } from './Runner';

describe('Runner', () => {
  const now = new Date('2026-10-10T10:00:00Z');

  it('normalizes the nationality to upper case', () => {
    const runner = Runner.create(
      buildRunnerId(1),
      buildRunnerData({ nationality: 'fra' }),
    );
    expect(runner.data.nationality).toBe('FRA');
    expect(runner.fullName).toBe('Ludovic Pommeret');
    expect(runner.firstName).toBe('Ludovic');
    expect(runner.lastName).toBe('Pommeret');
    expect(runner.index).toBe(900);
  });

  it('rejects a nationality that is not an alpha-3 code', () => {
    expect(() =>
      Runner.create(buildRunnerId(1), buildRunnerData({ nationality: 'FR' })),
    ).toThrow(ZodError);
  });

  it('keeps the first withdrawal date and clears it on reinstate', () => {
    const withdrawn = Runner.create(
      buildRunnerId(1),
      buildRunnerData(),
    ).withdraw(now);
    expect(withdrawn.isWithdrawn).toBe(true);
    expect(
      withdrawn.withdraw(new Date('2026-10-11T10:00:00Z')).withdrawnAt,
    ).toEqual(now);
    expect(withdrawn.reinstate().isWithdrawn).toBe(false);
  });

  it('keeps the withdrawal on update', () => {
    const withdrawn = Runner.create(
      buildRunnerId(1),
      buildRunnerData(),
    ).withdraw(now);
    const updated = withdrawn.update(buildRunnerData({ index: 850 }));
    expect(updated.index).toBe(850);
    expect(updated.withdrawnAt).toEqual(now);
  });
});
