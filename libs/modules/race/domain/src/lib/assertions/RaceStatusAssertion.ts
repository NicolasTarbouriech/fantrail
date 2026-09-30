import { RaceStatus } from '../enums';
import { RaceNotEditableError, RaceStatusTransitionError } from '../errors';

const ALLOWED_TRANSITIONS: Record<RaceStatus, RaceStatus[]> = {
  [RaceStatus.Draft]: [RaceStatus.Open, RaceStatus.Cancelled],
  [RaceStatus.Open]: [
    RaceStatus.Locked,
    RaceStatus.Scored,
    RaceStatus.Cancelled,
  ],
  [RaceStatus.Locked]: [RaceStatus.Scored, RaceStatus.Cancelled],
  [RaceStatus.Scored]: [],
  [RaceStatus.Cancelled]: [],
};

const EDITABLE_STATUS_LIST = [RaceStatus.Draft, RaceStatus.Open];

export class RaceStatusAssertion {
  static assertTransition(from: RaceStatus, to: RaceStatus): void {
    if (!ALLOWED_TRANSITIONS[from].includes(to)) {
      throw new RaceStatusTransitionError(from, to);
    }
  }

  static assertEditable(status: RaceStatus): void {
    if (!EDITABLE_STATUS_LIST.includes(status)) {
      throw new RaceNotEditableError(status);
    }
  }
}
