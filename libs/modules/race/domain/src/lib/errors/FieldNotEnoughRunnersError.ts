import { DomainError } from '@trail/shared/tooling/util-error';

export class FieldNotEnoughRunnersError extends DomainError {
  constructor(
    public readonly fieldId: string,
    public readonly runnerCount: number,
    public readonly pickCount: number,
  ) {
    super(`Field ${fieldId} has ${runnerCount} runners, ${pickCount} needed`);
  }
}
