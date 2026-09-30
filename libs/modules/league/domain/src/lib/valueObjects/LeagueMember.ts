import { UserId } from '../types';

export class LeagueMember {
  constructor(
    public readonly userId: UserId,
    public readonly joinedAt: Date,
  ) {}
}
