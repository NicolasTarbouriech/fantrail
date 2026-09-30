import { BonusType } from '../enums';

export class Bonus {
  constructor(
    public readonly type: BonusType,
    public readonly points: number,
  ) {}
}
