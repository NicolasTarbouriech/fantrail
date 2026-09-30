import { FavoriteRank, RunnerId } from '../types';

export class PickScore {
  constructor(
    public readonly pickPosition: number,
    public readonly runnerId: RunnerId,
    public readonly finishPosition: number | null,
    public readonly favoriteRank: FavoriteRank | null,
    public readonly positionPoints: number,
    public readonly multiplierInTenths: number,
    public readonly points: number,
  ) {}

  get isExact(): boolean {
    return this.finishPosition === this.pickPosition;
  }
}
