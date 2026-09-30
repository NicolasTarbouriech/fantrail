import {
  LeagueNotFoundError,
  LeagueNotVisibleError,
  LeagueRepository,
  LeagueVisibility,
} from '@trail/modules/league/domain';
import {
  INVITE_CODE,
  LEAGUE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '@trail/modules/league/domain-testing';

import { GetLeagueByInviteCodeQuery } from './GetLeagueByInviteCodeQuery';
import { GetLeagueByInviteCodeQueryHandler } from './GetLeagueByInviteCodeQueryHandler';
import { GetLeagueQuery } from './GetLeagueQuery';
import { GetLeagueQueryHandler } from './GetLeagueQueryHandler';
import { ListLeaguesQuery } from './ListLeaguesQuery';
import { ListLeaguesQueryHandler } from './ListLeaguesQueryHandler';

describe('league query handlers', () => {
  const league = buildLeagueAggregate();
  const leagueRepository = {
    getById: jest.fn().mockResolvedValue(league),
    findByInviteCode: jest.fn().mockResolvedValue(league),
    list: jest.fn().mockResolvedValue([league]),
  } as unknown as LeagueRepository;

  it('GetLeagueQueryHandler shows a private league to its members only', async () => {
    const handler = new GetLeagueQueryHandler(leagueRepository);
    await expect(
      handler.execute(
        new GetLeagueQuery({
          leagueId: LEAGUE_ID,
          viewer: { userId: OWNER_ID, isAdmin: false },
        }),
      ),
    ).resolves.toBe(league);
    await expect(
      handler.execute(
        new GetLeagueQuery({
          leagueId: LEAGUE_ID,
          viewer: { userId: buildLeagueUserId(5), isAdmin: false },
        }),
      ),
    ).rejects.toThrow(LeagueNotVisibleError);
  });

  it('GetLeagueByInviteCodeQueryHandler reads the league of a code, or throws', async () => {
    const handler = new GetLeagueByInviteCodeQueryHandler(leagueRepository);
    await expect(
      handler.execute(
        new GetLeagueByInviteCodeQuery({ inviteCode: INVITE_CODE }),
      ),
    ).resolves.toBe(league);
    jest.mocked(leagueRepository.findByInviteCode).mockResolvedValueOnce(null);
    await expect(
      handler.execute(
        new GetLeagueByInviteCodeQuery({ inviteCode: INVITE_CODE }),
      ),
    ).rejects.toThrow(LeagueNotFoundError);
  });

  it('ListLeaguesQueryHandler filters by visibility and member', async () => {
    await new ListLeaguesQueryHandler(leagueRepository).execute(
      new ListLeaguesQuery({
        visibility: LeagueVisibility.Public,
        memberId: OWNER_ID,
      }),
    );
    expect(leagueRepository.list).toHaveBeenCalledWith({
      visibility: LeagueVisibility.Public,
      memberId: OWNER_ID,
    });
  });
});
