import { AggregateRoot } from '@nestjs/cqrs';

import { PickListAssertion } from '../assertions';
import {
  FieldId,
  PickSlotList,
  PredictionData,
  PredictionId,
  RunnerId,
  UserId,
  WinnerTimeInSeconds,
} from '../types';
import { PredictionField } from '../valueObjects';

export class PredictionAggregate extends AggregateRoot {
  constructor(
    public readonly id: PredictionId,
    public readonly userId: UserId,
    public readonly fieldId: FieldId,
    private _pickList: PickSlotList,
    private _winnerTimeEstimateInSeconds: WinnerTimeInSeconds | null,
    private _finalizedAt: Date | null,
    private _updatedAt: Date,
  ) {
    super();
  }

  static assertData(data: PredictionData): PredictionData {
    return PredictionData.parse(data);
  }

  get pickList(): PickSlotList {
    return this._pickList;
  }

  get winnerTimeEstimateInSeconds(): WinnerTimeInSeconds | null {
    return this._winnerTimeEstimateInSeconds;
  }

  // Last time the prediction became complete: the earliest one wins a tie.
  get finalizedAt(): Date | null {
    return this._finalizedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isComplete(): boolean {
    return (
      this._pickList.every((runnerId) => runnerId !== null) &&
      this._winnerTimeEstimateInSeconds !== null
    );
  }

  withdrawnRunnerIdList(field: PredictionField): RunnerId[] {
    return this._pickList.flatMap((runnerId) =>
      runnerId !== null && field.isWithdrawn(runnerId) ? [runnerId] : [],
    );
  }

  update(data: PredictionData, field: PredictionField, now: Date): void {
    field.assertOpen();
    const parsed = PredictionAggregate.assertData(data);
    PickListAssertion.assert(parsed.pickList, this._pickList, field);
    this._pickList = parsed.pickList;
    this._winnerTimeEstimateInSeconds = parsed.winnerTimeEstimateInSeconds;
    this._finalizedAt = this.isComplete ? now : null;
    this._updatedAt = now;
  }
}
