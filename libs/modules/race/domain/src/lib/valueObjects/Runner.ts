import { RunnerData, RunnerId } from '../types';

export class Runner {
  private constructor(
    public readonly id: RunnerId,
    private readonly _data: RunnerData,
    public readonly withdrawnAt: Date | null,
  ) {}

  static create(
    id: RunnerId,
    data: RunnerData,
    withdrawnAt: Date | null = null,
  ): Runner {
    return new Runner(RunnerId.parse(id), RunnerData.parse(data), withdrawnAt);
  }

  get data(): RunnerData {
    return this._data;
  }

  get firstName(): string {
    return this._data.firstName;
  }

  get lastName(): string {
    return this._data.lastName;
  }

  get fullName(): string {
    return `${this._data.firstName} ${this._data.lastName}`;
  }

  get index(): number | null {
    return this._data.index;
  }

  get isWithdrawn(): boolean {
    return this.withdrawnAt !== null;
  }

  update(data: RunnerData): Runner {
    return Runner.create(this.id, data, this.withdrawnAt);
  }

  withdraw(now: Date): Runner {
    return new Runner(this.id, this._data, this.withdrawnAt ?? now);
  }

  reinstate(): Runner {
    return new Runner(this.id, this._data, null);
  }
}
