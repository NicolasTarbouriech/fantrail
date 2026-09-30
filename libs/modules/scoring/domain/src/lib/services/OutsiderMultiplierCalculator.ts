import {
  OUTSIDER_MULTIPLIER_BASE_IN_TENTHS,
  OUTSIDER_MULTIPLIER_MAX_IN_TENTHS,
} from '../constants';
import { FavoriteRank } from '../types';

// Tenths keep the arithmetic exact: 0.1 × 3 is not 0.3 in floating point.
export class OutsiderMultiplierCalculator {
  static calculateInTenths(favoriteRank: FavoriteRank | null): number {
    if (favoriteRank === null) {
      return OUTSIDER_MULTIPLIER_BASE_IN_TENTHS;
    }
    return Math.min(
      OUTSIDER_MULTIPLIER_BASE_IN_TENTHS + favoriteRank - 1,
      OUTSIDER_MULTIPLIER_MAX_IN_TENTHS,
    );
  }

  static apply(points: number, multiplierInTenths: number): number {
    return Math.round(
      (points * multiplierInTenths) / OUTSIDER_MULTIPLIER_BASE_IN_TENTHS,
    );
  }
}
