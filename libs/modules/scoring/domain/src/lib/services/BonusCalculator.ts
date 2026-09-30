import { BONUS_POINTS } from '../constants';
import { BonusType } from '../enums';
import { RunnerId } from '../types';
import { Bonus } from '../valueObjects';

export class BonusCalculator {
  static calculate(pickList: RunnerId[], rankingList: RunnerId[]): Bonus[] {
    const bonusList: Bonus[] = [];
    if (pickList[0] === rankingList[0]) {
      bonusList.push(new Bonus(BonusType.Winner, BONUS_POINTS.winner));
    }
    if (BonusCalculator._hasTopUnordered(pickList, rankingList, 3)) {
      bonusList.push(
        new Bonus(BonusType.Top3Unordered, BONUS_POINTS.top3Unordered),
      );
    }
    if (BonusCalculator._hasTopExact(pickList, rankingList, 3)) {
      bonusList.push(new Bonus(BonusType.Top3Exact, BONUS_POINTS.top3Exact));
    }
    if (BonusCalculator._hasTopUnordered(pickList, rankingList, 5)) {
      bonusList.push(
        new Bonus(BonusType.Top5Unordered, BONUS_POINTS.top5Unordered),
      );
    }
    if (BonusCalculator._hasTopExact(pickList, rankingList, 5)) {
      bonusList.push(new Bonus(BonusType.Top5Exact, BONUS_POINTS.top5Exact));
    }
    const exactCount = pickList.filter(
      (runnerId, index) => rankingList[index] === runnerId,
    ).length;
    if (exactCount >= BONUS_POINTS.exactPositionMinCount) {
      bonusList.push(
        new Bonus(
          BonusType.MultipleExactPositions,
          (exactCount * BONUS_POINTS.exactPositionFactor) ** 2,
        ),
      );
    }
    return bonusList;
  }

  private static _hasTopUnordered(
    pickList: RunnerId[],
    rankingList: RunnerId[],
    size: number,
  ): boolean {
    if (pickList.length < size || rankingList.length < size) {
      return false;
    }
    const topRunnerIdSet = new Set(rankingList.slice(0, size));
    return pickList
      .slice(0, size)
      .every((runnerId) => topRunnerIdSet.has(runnerId));
  }

  private static _hasTopExact(
    pickList: RunnerId[],
    rankingList: RunnerId[],
    size: number,
  ): boolean {
    if (pickList.length < size || rankingList.length < size) {
      return false;
    }
    return pickList
      .slice(0, size)
      .every((runnerId, index) => rankingList[index] === runnerId);
  }
}
