import {
  InvalidInviteCodeError,
  LeagueAggregate,
  LeagueForbiddenError,
  LeagueRaceRepository,
  LeagueRepository,
  LeagueVisibility,
  LeagueWithoutRaceError,
} from '@trail/modules/league/domain';
import {
  INVITE_CODE,
  LEAGUE_ID,
  LEAGUE_RACE_ID,
  OTHER_LEAGUE_RACE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '@trail/modules/league/domain-testing';

import { ChangeLeagueRacesCommand } from './ChangeLeagueRacesCommand';
import { ChangeLeagueRacesCommandHandler } from './ChangeLeagueRacesCommandHandler';
import { ChangeLeagueVisibilityCommand } from './ChangeLeagueVisibilityCommand';
import { ChangeLeagueVisibilityCommandHandler } from './ChangeLeagueVisibilityCommandHandler';
import { CreateLeagueCommand } from './CreateLeagueCommand';
import { CreateLeagueCommandHandler } from './CreateLeagueCommandHandler';
import { DeleteLeagueCommand } from './DeleteLeagueCommand';
import { DeleteLeagueCommandHandler } from './DeleteLeagueCommandHandler';
import { JoinLeagueByInviteCodeCommand } from './JoinLeagueByInviteCodeCommand';
import { JoinLeagueByInviteCodeCommandHandler } from './JoinLeagueByInviteCodeCommandHandler';
import { JoinLeagueCommand } from './JoinLeagueCommand';
import { JoinLeagueCommandHandler } from './JoinLeagueCommandHandler';
import { LeaveLeagueCommand } from './LeaveLeagueCommand';
import { LeaveLeagueCommandHandler } from './LeaveLeagueCommandHandler';
import { RegenerateLeagueInviteCodeCommand } from './RegenerateLeagueInviteCodeCommand';
import { RegenerateLeagueInviteCodeCommandHandler } from './RegenerateLeagueInviteCodeCommandHandler';
import { RemoveLeagueMemberCommand } from './RemoveLeagueMemberCommand';
import { RemoveLeagueMemberCommandHandler } from './RemoveLeagueMemberCommandHandler';
import { RenameLeagueCommand } from './RenameLeagueCommand';
import { RenameLeagueCommandHandler } from './RenameLeagueCommandHandler';

const u = buildLeagueUserId;
const owner = { userId: OWNER_ID, isAdmin: false };

describe('league command handlers', () => {
  let league: LeagueAggregate;
  let leagueRepository: LeagueRepository;
  let leagueRaceRepository: LeagueRaceRepository;

  beforeEach(() => {
    league = buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] });
    leagueRaceRepository = {
      listAvailableRaceIds: jest.fn(() =>
        Promise.resolve([LEAGUE_RACE_ID, OTHER_LEAGUE_RACE_ID]),
      ),
    } as unknown as LeagueRaceRepository;
    leagueRepository = {
      getById: jest.fn(() => Promise.resolve(league)),
      findByInviteCode: jest.fn(() => Promise.resolve(league)),
      create: jest.fn(() => Promise.resolve(league)),
      save: jest.fn((aggregate) => Promise.resolve(aggregate)),
      delete: jest.fn(),
    } as unknown as LeagueRepository;
  });

  it('CreateLeagueCommandHandler creates the league with a fresh invite code', async () => {
    await new CreateLeagueCommandHandler(
      leagueRepository,
      leagueRaceRepository,
    ).execute(
      new CreateLeagueCommand({
        ownerId: OWNER_ID,
        name: 'Les Chamois',
        visibility: LeagueVisibility.Private,
        raceIdList: [LEAGUE_RACE_ID, LEAGUE_RACE_ID],
      }),
    );
    expect(leagueRepository.create).toHaveBeenCalledWith({
      name: 'Les Chamois',
      visibility: LeagueVisibility.Private,
      ownerId: OWNER_ID,
      inviteCode: expect.stringMatching(/^[A-HJ-NP-Z2-9]{8}$/),
      raceIdList: [LEAGUE_RACE_ID],
    });
  });

  it('CreateLeagueCommandHandler refuses a league without an available race', async () => {
    const handler = new CreateLeagueCommandHandler(
      leagueRepository,
      leagueRaceRepository,
    );
    const input = {
      ownerId: OWNER_ID,
      name: 'Les Chamois',
      visibility: LeagueVisibility.Public,
    };
    await expect(
      handler.execute(new CreateLeagueCommand({ ...input, raceIdList: [] })),
    ).rejects.toThrow(LeagueWithoutRaceError);
    expect(leagueRepository.create).not.toHaveBeenCalled();
  });

  it('ChangeLeagueRacesCommandHandler changes the races and saves the league', async () => {
    const saved = await new ChangeLeagueRacesCommandHandler(
      leagueRepository,
      leagueRaceRepository,
    ).execute(
      new ChangeLeagueRacesCommand({
        actor: owner,
        leagueId: LEAGUE_ID,
        raceIdList: [OTHER_LEAGUE_RACE_ID],
      }),
    );
    expect(saved.raceIdList).toEqual([OTHER_LEAGUE_RACE_ID]);
    expect(leagueRepository.save).toHaveBeenCalledWith(league);
  });

  it('JoinLeagueCommandHandler joins a public league', async () => {
    league = buildLeagueAggregate({ visibility: LeagueVisibility.Public });
    const saved = await new JoinLeagueCommandHandler(leagueRepository).execute(
      new JoinLeagueCommand({ userId: u(3), leagueId: LEAGUE_ID }),
    );
    expect(saved.hasMember(u(3))).toBe(true);
  });

  it('JoinLeagueByInviteCodeCommandHandler joins with the code, typed in any case', async () => {
    const saved = await new JoinLeagueByInviteCodeCommandHandler(
      leagueRepository,
    ).execute(
      new JoinLeagueByInviteCodeCommand({
        userId: u(3),
        inviteCode: INVITE_CODE.toLowerCase(),
      }),
    );
    expect(saved.hasMember(u(3))).toBe(true);
    expect(leagueRepository.findByInviteCode).toHaveBeenCalledWith(INVITE_CODE);
  });

  it('JoinLeagueByInviteCodeCommandHandler refuses an unknown code', async () => {
    jest.mocked(leagueRepository.findByInviteCode).mockResolvedValueOnce(null);
    await expect(
      new JoinLeagueByInviteCodeCommandHandler(leagueRepository).execute(
        new JoinLeagueByInviteCodeCommand({
          userId: u(3),
          inviteCode: 'ZZZZZZZZ',
        }),
      ),
    ).rejects.toThrow(InvalidInviteCodeError);
  });

  it('LeaveLeagueCommandHandler lets a member leave', async () => {
    const saved = await new LeaveLeagueCommandHandler(leagueRepository).execute(
      new LeaveLeagueCommand({ userId: u(2), leagueId: LEAGUE_ID }),
    );
    expect(saved.hasMember(u(2))).toBe(false);
  });

  it('RemoveLeagueMemberCommandHandler lets the owner remove a member', async () => {
    const saved = await new RemoveLeagueMemberCommandHandler(
      leagueRepository,
    ).execute(
      new RemoveLeagueMemberCommand({
        actor: owner,
        leagueId: LEAGUE_ID,
        userId: u(2),
      }),
    );
    expect(saved.memberIdList).toEqual([OWNER_ID]);
  });

  it('RenameLeagueCommandHandler renames the league', async () => {
    const saved = await new RenameLeagueCommandHandler(
      leagueRepository,
    ).execute(
      new RenameLeagueCommand({
        actor: owner,
        leagueId: LEAGUE_ID,
        name: 'Les Bouquetins',
      }),
    );
    expect(saved.name).toBe('Les Bouquetins');
  });

  it('ChangeLeagueVisibilityCommandHandler makes the league public', async () => {
    const saved = await new ChangeLeagueVisibilityCommandHandler(
      leagueRepository,
    ).execute(
      new ChangeLeagueVisibilityCommand({
        actor: owner,
        leagueId: LEAGUE_ID,
        visibility: LeagueVisibility.Public,
      }),
    );
    expect(saved.isPublic).toBe(true);
  });

  it('RegenerateLeagueInviteCodeCommandHandler replaces the code', async () => {
    const saved = await new RegenerateLeagueInviteCodeCommandHandler(
      leagueRepository,
    ).execute(
      new RegenerateLeagueInviteCodeCommand({
        actor: owner,
        leagueId: LEAGUE_ID,
      }),
    );
    expect(saved.inviteCode).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
  });

  it('DeleteLeagueCommandHandler deletes for the owner only', async () => {
    const handler = new DeleteLeagueCommandHandler(leagueRepository);
    await expect(
      handler.execute(
        new DeleteLeagueCommand({
          actor: { userId: u(2), isAdmin: false },
          leagueId: LEAGUE_ID,
        }),
      ),
    ).rejects.toThrow(LeagueForbiddenError);
    expect(leagueRepository.delete).not.toHaveBeenCalled();
    await expect(
      handler.execute(
        new DeleteLeagueCommand({ actor: owner, leagueId: LEAGUE_ID }),
      ),
    ).resolves.toBe(true);
    expect(leagueRepository.delete).toHaveBeenCalledWith(LEAGUE_ID);
  });
});
