import { EventPublisher } from '@nestjs/cqrs';
import { QueryFailedError, Repository } from 'typeorm';

import {
  LeagueNameAlreadyUsedError,
  LeagueNotFoundError,
  LeagueVisibility,
} from '@trail/modules/league/domain';
import {
  INVITE_CODE,
  LEAGUE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '@trail/modules/league/domain-testing';
import {
  LeagueEntity,
  LeagueMemberEntity,
} from '@trail/shared/database/data-access-main';

import { TypeormLeagueRepository } from './TypeormLeagueRepository';

const ENTITY = {
  id: LEAGUE_ID,
  name: 'Les Chamois',
  name_key: 'les chamois',
  visibility: 'private',
  owner_id: OWNER_ID,
  invite_code: INVITE_CODE,
  member_list: [
    {
      league_id: LEAGUE_ID,
      user_id: buildLeagueUserId(2),
      joined_at: new Date('2026-10-02T10:00:00Z'),
    },
    {
      league_id: LEAGUE_ID,
      user_id: OWNER_ID,
      joined_at: new Date('2026-10-01T10:00:00Z'),
    },
  ],
  created_at: new Date('2026-10-01T10:00:00Z'),
} as LeagueEntity;

const nameViolation = (): QueryFailedError =>
  new QueryFailedError(
    'INSERT',
    [],
    Object.assign(new Error('duplicate'), {
      code: '23505',
      constraint: 'UQ_leagues_name_key',
    }),
  );

describe('TypeormLeagueRepository', () => {
  let leagueRepository: Repository<LeagueEntity>;
  let memberRepository: Repository<LeagueMemberEntity>;
  let repository: TypeormLeagueRepository;

  beforeEach(() => {
    leagueRepository = {
      findOne: jest.fn().mockResolvedValue(ENTITY),
      find: jest.fn().mockResolvedValue([ENTITY]),
      create: jest.fn((value) => value),
      save: jest.fn((value) => Promise.resolve({ ...value, id: LEAGUE_ID })),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as Repository<LeagueEntity>;
    memberRepository = {
      find: jest.fn().mockResolvedValue([{ league_id: LEAGUE_ID }]),
    } as unknown as Repository<LeagueMemberEntity>;
    const publisher = {
      mergeObjectContext: jest.fn((aggregate) => aggregate),
    } as unknown as EventPublisher;
    repository = new TypeormLeagueRepository(
      publisher,
      leagueRepository,
      memberRepository,
    );
  });

  it('gets a league with its members in joining order, or throws', async () => {
    const league = await repository.getById(LEAGUE_ID);
    expect(league.memberIdList).toEqual([OWNER_ID, buildLeagueUserId(2)]);
    jest.mocked(leagueRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.getById(LEAGUE_ID)).rejects.toThrow(
      LeagueNotFoundError,
    );
  });

  it('finds a league by invite code, or null', async () => {
    expect((await repository.findByInviteCode(INVITE_CODE))?.id).toBe(
      LEAGUE_ID,
    );
    jest.mocked(leagueRepository.findOne).mockResolvedValueOnce(null);
    await expect(repository.findByInviteCode(INVITE_CODE)).resolves.toBeNull();
  });

  it('lists leagues by visibility and by member', async () => {
    await repository.list({ visibility: LeagueVisibility.Public });
    expect(leagueRepository.find).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { visibility: LeagueVisibility.Public },
      }),
    );
    await repository.list({ memberId: OWNER_ID });
    expect(memberRepository.find).toHaveBeenCalledWith({
      where: { user_id: OWNER_ID },
    });
    expect(leagueRepository.find).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: { id: expect.anything() } }),
    );
    expect(await repository.list()).toHaveLength(1);
  });

  it('creates the league with its owner as first member', async () => {
    await repository.create({
      name: 'Les Chamois',
      visibility: LeagueVisibility.Private,
      ownerId: OWNER_ID,
      inviteCode: INVITE_CODE,
    });
    expect(leagueRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name_key: 'les chamois',
        member_list: [expect.objectContaining({ user_id: OWNER_ID })],
      }),
    );
  });

  it('maps a name already taken to a domain error', async () => {
    jest.mocked(leagueRepository.save).mockRejectedValueOnce(nameViolation());
    await expect(
      repository.create({
        name: 'LES CHAMOIS',
        visibility: LeagueVisibility.Public,
        ownerId: OWNER_ID,
        inviteCode: INVITE_CODE,
      }),
    ).rejects.toThrow(LeagueNameAlreadyUsedError);
    jest
      .mocked(leagueRepository.save)
      .mockRejectedValueOnce(new Error('connection lost'));
    await expect(repository.save(buildLeagueAggregate())).rejects.toThrow(
      'connection lost',
    );
  });

  it('saves the league with its current members', async () => {
    await repository.save(
      buildLeagueAggregate({ memberIdList: [OWNER_ID, buildLeagueUserId(3)] }),
    );
    expect(leagueRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: LEAGUE_ID,
        member_list: [
          expect.objectContaining({ user_id: OWNER_ID }),
          expect.objectContaining({ user_id: buildLeagueUserId(3) }),
        ],
      }),
    );
  });

  it('deletes a league', async () => {
    await repository.delete(LEAGUE_ID);
    expect(leagueRepository.delete).toHaveBeenCalledWith({ id: LEAGUE_ID });
  });
});
