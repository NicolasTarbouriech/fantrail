import { FieldLockBeforeStartError } from '../errors';

export class FieldScheduleAssertion {
  static assert(startAt: Date, lockAt: Date): void {
    if (lockAt.getTime() > startAt.getTime()) {
      throw new FieldLockBeforeStartError();
    }
  }
}
