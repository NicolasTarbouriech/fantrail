import { LeagueAggregate } from '../aggregates';
import { LeagueVisibility } from '../enums';
import { InviteCode, LeagueId, LeagueName, RaceId, UserId } from '../types';

export interface CreateLeagueParams {
  name: LeagueName;
  visibility: LeagueVisibility;
  ownerId: UserId;
  inviteCode: InviteCode;
  raceIdList: RaceId[];
}

export abstract class LeagueRepository {
  abstract getById(id: LeagueId): Promise<LeagueAggregate>;
  abstract findByInviteCode(
    inviteCode: InviteCode,
  ): Promise<LeagueAggregate | null>;
  abstract list(filters?: {
    visibility?: LeagueVisibility;
    memberId?: UserId;
    raceId?: RaceId;
  }): Promise<LeagueAggregate[]>;
  // The owner is the first member.
  abstract create(params: CreateLeagueParams): Promise<LeagueAggregate>;
  abstract save(league: LeagueAggregate): Promise<LeagueAggregate>;
  abstract delete(id: LeagueId): Promise<void>;
}
