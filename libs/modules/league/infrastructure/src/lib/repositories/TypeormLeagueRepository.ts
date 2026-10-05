import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import {
  CreateLeagueParams,
  InviteCode,
  LeagueAggregate,
  LeagueId,
  LeagueNameAlreadyUsedError,
  LeagueNotFoundError,
  LeagueRepository,
  LeagueVisibility,
  UserId,
} from '@trail/modules/league/domain';
import {
  LEAGUE_NAME_KEY_UNIQUE_INDEX,
  LeagueEntity,
  LeagueMemberEntity,
  isUniqueViolation,
} from '@trail/shared/database/data-access-main';

import { mapLeagueAggregate } from '../mappers/mapLeagueAggregate';

const RELATIONS = ['member_list'];

@Injectable()
export class TypeormLeagueRepository extends LeagueRepository {
  constructor(
    private readonly _publisher: EventPublisher,
    @InjectRepository(LeagueEntity)
    private readonly _leagueRepository: Repository<LeagueEntity>,
    @InjectRepository(LeagueMemberEntity)
    private readonly _memberRepository: Repository<LeagueMemberEntity>,
  ) {
    super();
  }

  async getById(id: LeagueId): Promise<LeagueAggregate> {
    const entity = await this._leagueRepository.findOne({
      where: { id },
      relations: RELATIONS,
    });
    if (!entity) {
      throw new LeagueNotFoundError();
    }
    return this._mapEntity(entity);
  }

  async findByInviteCode(
    inviteCode: InviteCode,
  ): Promise<LeagueAggregate | null> {
    const entity = await this._leagueRepository.findOne({
      where: { invite_code: inviteCode },
      relations: RELATIONS,
    });
    return entity ? this._mapEntity(entity) : null;
  }

  // Filtering on the member relation would load the matching member only, so find the league ids first.
  async list({
    visibility,
    memberId,
  }: { visibility?: LeagueVisibility; memberId?: UserId } = {}): Promise<
    LeagueAggregate[]
  > {
    const where: FindOptionsWhere<LeagueEntity> = visibility
      ? { visibility }
      : {};
    if (memberId) {
      const membershipList = await this._memberRepository.find({
        where: { user_id: memberId },
      });
      where.id = In(membershipList.map(({ league_id }) => league_id));
    }
    const entityList = await this._leagueRepository.find({
      where,
      relations: RELATIONS,
      order: { name: 'ASC' },
    });
    return entityList.map((entity) => this._mapEntity(entity));
  }

  async create({
    name,
    visibility,
    ownerId,
    inviteCode,
    raceIdList,
  }: CreateLeagueParams): Promise<LeagueAggregate> {
    const entity = await this._withUniqueName(() =>
      this._leagueRepository.save(
        this._leagueRepository.create({
          name,
          name_key: LeagueAggregate.nameKey(name),
          visibility,
          owner_id: ownerId,
          invite_code: inviteCode,
          race_id_list: raceIdList,
          member_list: [{ user_id: ownerId, joined_at: new Date() }],
        }),
      ),
    );
    return this.getById(entity.id);
  }

  async save(league: LeagueAggregate): Promise<LeagueAggregate> {
    await this._withUniqueName(() =>
      this._leagueRepository.save(
        this._leagueRepository.create({
          id: league.id,
          name: league.name,
          name_key: LeagueAggregate.nameKey(league.name),
          visibility: league.visibility,
          owner_id: league.ownerId,
          invite_code: league.inviteCode,
          race_id_list: league.raceIdList,
          member_list: league.memberList.map((member) => ({
            league_id: league.id,
            user_id: member.userId,
            joined_at: member.joinedAt,
          })),
        }),
      ),
    );
    return this.getById(league.id);
  }

  async delete(id: LeagueId): Promise<void> {
    await this._leagueRepository.delete({ id });
  }

  private async _withUniqueName<T>(write: () => Promise<T>): Promise<T> {
    try {
      return await write();
    } catch (error) {
      if (isUniqueViolation(error, LEAGUE_NAME_KEY_UNIQUE_INDEX)) {
        throw new LeagueNameAlreadyUsedError();
      }
      throw error;
    }
  }

  private _mapEntity(entity: LeagueEntity): LeagueAggregate {
    const aggregate = mapLeagueAggregate(entity);
    this._publisher.mergeObjectContext(aggregate);
    return aggregate;
  }
}
