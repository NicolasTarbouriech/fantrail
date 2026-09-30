import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { RunnerNotFoundError } from '../errors';
import { FavoriteRankCalculator } from '../services';
import { FieldId, RunnerData, RunnerId } from '../types';
import { RaceField, Runner } from '../valueObjects';

// The start list of one field. Edits are only allowed until the field locks.
export class StartListAggregate extends AggregateRoot {
  constructor(
    public readonly fieldId: FieldId,
    private _runnerList: Runner[],
  ) {
    super();
  }

  get runnerList(): Runner[] {
    return this._runnerList;
  }

  get activeRunnerList(): Runner[] {
    return this._runnerList.filter((runner) => !runner.isWithdrawn);
  }

  // Indexes are frozen once the field locks, so the live ranking is also the ranking at lock time.
  get favoriteRankByRunnerId(): Record<RunnerId, number | null> {
    return FavoriteRankCalculator.calculate(this.activeRunnerList);
  }

  findRunner(runnerId: RunnerId): Runner {
    const runner = this._runnerList.find(({ id }) => id === runnerId);
    if (!runner) {
      throw new RunnerNotFoundError(runnerId);
    }
    return runner;
  }

  addRunnerList(dataList: RunnerData[], field: RaceField, now: Date): Runner[] {
    field.assertNotLockedAt(now);
    const addedList = dataList.map((data) => Runner.create(randomUUID(), data));
    this._runnerList = [...this._runnerList, ...addedList];
    return addedList;
  }

  updateRunner(
    runnerId: RunnerId,
    data: RunnerData,
    field: RaceField,
    now: Date,
  ): void {
    this._replaceRunner(runnerId, field, now, (runner) => runner.update(data));
  }

  withdrawRunner(runnerId: RunnerId, field: RaceField, now: Date): void {
    this._replaceRunner(runnerId, field, now, (runner) => runner.withdraw(now));
  }

  reinstateRunner(runnerId: RunnerId, field: RaceField, now: Date): void {
    this._replaceRunner(runnerId, field, now, (runner) => runner.reinstate());
  }

  private _replaceRunner(
    runnerId: RunnerId,
    field: RaceField,
    now: Date,
    change: (runner: Runner) => Runner,
  ): void {
    field.assertNotLockedAt(now);
    const updated = change(this.findRunner(runnerId));
    this._runnerList = this._runnerList.map((runner) =>
      runner.id === runnerId ? updated : runner,
    );
  }
}
