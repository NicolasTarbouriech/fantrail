import { Bonus } from './Bonus';
import { PickScore } from './PickScore';
import { TimeScore } from './TimeScore';

export class FieldScore {
  constructor(
    public readonly pickScoreList: PickScore[],
    public readonly timeScore: TimeScore,
    public readonly bonusList: Bonus[],
  ) {}

  get positionPoints(): number {
    return this.pickScoreList.reduce(
      (sum, pickScore) => sum + pickScore.points,
      0,
    );
  }

  get bonusPoints(): number {
    return this.bonusList.reduce((sum, bonus) => sum + bonus.points, 0);
  }

  get total(): number {
    return this.positionPoints + this.timeScore.points + this.bonusPoints;
  }
}
