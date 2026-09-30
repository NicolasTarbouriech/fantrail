import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { RaceStatusAssertion } from '../assertions';
import { RaceStatus } from '../enums';
import {
  FieldGenderAlreadyExistsError,
  FieldNotEnoughRunnersError,
  FieldNotFoundError,
  FieldNotLockedError,
  PickCountLockedError,
  RaceWithoutFieldError,
} from '../errors';
import { FieldData, FieldId, PickCount, RaceData, RaceId } from '../types';
import { RaceField } from '../valueObjects';

export class RaceAggregate extends AggregateRoot {
  constructor(
    public readonly id: RaceId,
    private _data: RaceData,
    private _status: RaceStatus,
    private _fieldList: RaceField[],
  ) {
    super();
  }

  static assertData(data: RaceData): RaceData {
    return RaceData.parse(data);
  }

  get data(): RaceData {
    return this._data;
  }

  get name(): string {
    return this._data.name;
  }

  get timezone(): string {
    return this._data.timezone;
  }

  get pickCount(): PickCount {
    return this._data.pickCount;
  }

  get timeTolerancePercent(): number {
    return this._data.timeTolerancePercent;
  }

  get status(): RaceStatus {
    return this._status;
  }

  get fieldList(): RaceField[] {
    return this._fieldList;
  }

  findField(fieldId: FieldId): RaceField {
    const field = this._fieldList.find(({ id }) => id === fieldId);
    if (!field) {
      throw new FieldNotFoundError(fieldId);
    }
    return field;
  }

  isOpenForPredictions(fieldId: FieldId, now: Date): boolean {
    return (
      this._status === RaceStatus.Open &&
      !this.findField(fieldId).isLockedAt(now)
    );
  }

  update(data: RaceData): void {
    RaceStatusAssertion.assertEditable(this._status);
    const parsed = RaceAggregate.assertData(data);
    if (
      parsed.pickCount !== this._data.pickCount &&
      this._status !== RaceStatus.Draft
    ) {
      throw new PickCountLockedError();
    }
    this._data = parsed;
  }

  open(activeRunnerCountByFieldId: Record<FieldId, number>): void {
    RaceStatusAssertion.assertTransition(this._status, RaceStatus.Open);
    if (this._fieldList.length === 0) {
      throw new RaceWithoutFieldError();
    }
    for (const field of this._fieldList) {
      const activeRunnerCount = activeRunnerCountByFieldId[field.id] ?? 0;
      if (activeRunnerCount < this._data.pickCount) {
        throw new FieldNotEnoughRunnersError(
          field.id,
          activeRunnerCount,
          this._data.pickCount,
        );
      }
    }
    this._status = RaceStatus.Open;
  }

  lock(now: Date): void {
    RaceStatusAssertion.assertTransition(this._status, RaceStatus.Locked);
    this._fieldList = this._fieldList.map((field) => field.lock(now));
    this._status = RaceStatus.Locked;
  }

  lockField(fieldId: FieldId, now: Date): void {
    RaceStatusAssertion.assertTransition(this._status, RaceStatus.Locked);
    this._replaceField(fieldId, (field) => field.lock(now));
    if (this._fieldList.every((field) => field.isLockedAt(now))) {
      this._status = RaceStatus.Locked;
    }
  }

  markScored(now: Date): void {
    RaceStatusAssertion.assertTransition(this._status, RaceStatus.Scored);
    const unlockedField = this._fieldList.find(
      (field) => !field.isLockedAt(now),
    );
    if (unlockedField) {
      throw new FieldNotLockedError(unlockedField.id);
    }
    this._status = RaceStatus.Scored;
  }

  cancel(): void {
    RaceStatusAssertion.assertTransition(this._status, RaceStatus.Cancelled);
    this._status = RaceStatus.Cancelled;
  }

  addField(data: FieldData): RaceField {
    RaceStatusAssertion.assertEditable(this._status);
    this._assertGenderAvailable(data, null);
    const field = RaceField.create(randomUUID(), data);
    this._fieldList = [...this._fieldList, field];
    return field;
  }

  updateField(fieldId: FieldId, data: FieldData, now: Date): void {
    RaceStatusAssertion.assertEditable(this._status);
    this._assertGenderAvailable(data, fieldId);
    this._replaceField(fieldId, (field) => field.update(data, now));
  }

  private _assertGenderAvailable(
    data: FieldData,
    fieldId: FieldId | null,
  ): void {
    if (
      this._fieldList.some(
        (field) => field.gender === data.gender && field.id !== fieldId,
      )
    ) {
      throw new FieldGenderAlreadyExistsError(data.gender);
    }
  }

  private _replaceField(
    fieldId: FieldId,
    change: (field: RaceField) => RaceField,
  ): void {
    const updated = change(this.findField(fieldId));
    this._fieldList = this._fieldList.map((field) =>
      field.id === fieldId ? updated : field,
    );
  }
}
