import { FieldScheduleAssertion } from '../assertions';
import { Gender } from '../enums';
import { FieldLockedError } from '../errors';
import { FieldData, FieldId } from '../types';

export class RaceField {
  private constructor(
    public readonly id: FieldId,
    private readonly _data: FieldData,
    public readonly lockedAt: Date | null,
  ) {}

  static create(
    id: FieldId,
    data: FieldData,
    lockedAt: Date | null = null,
  ): RaceField {
    const parsed = FieldData.parse(data);
    FieldScheduleAssertion.assert(parsed.startAt, parsed.lockAt);
    return new RaceField(FieldId.parse(id), parsed, lockedAt);
  }

  get gender(): Gender {
    return this._data.gender;
  }

  get startAt(): Date {
    return this._data.startAt;
  }

  get lockAt(): Date {
    return this._data.lockAt;
  }

  isLockedAt(now: Date): boolean {
    return (
      this.lockedAt !== null || now.getTime() >= this._data.lockAt.getTime()
    );
  }

  assertNotLockedAt(now: Date): void {
    if (this.isLockedAt(now)) {
      throw new FieldLockedError(this.id);
    }
  }

  update(data: FieldData, now: Date): RaceField {
    this.assertNotLockedAt(now);
    return RaceField.create(this.id, data, this.lockedAt);
  }

  lock(now: Date): RaceField {
    if (this.lockedAt !== null) {
      return this;
    }
    return new RaceField(this.id, this._data, now);
  }
}
