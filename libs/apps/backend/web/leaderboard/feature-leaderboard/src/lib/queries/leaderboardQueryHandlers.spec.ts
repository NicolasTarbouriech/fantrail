import { GetLeagueQuery } from '@trail/modules/league/application';
import {
  LEAGUE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '@trail/modules/league/domain-testing';
import { ListRevealedPredictionsByFieldQuery } from '@trail/modules/prediction/application';
import { buildPredictionAggregate } from '@trail/modules/prediction/domain-testing';
import { GetRaceQuery, ListRacesQuery } from '@trail/modules/race/application';
import { PUBLIC_RACE_STATUS_LIST } from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  RACE_ID,
  WOMEN_FIELD_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';
import { GetLeaderboardQuery } from '@trail/modules/scoring/application';
import { ListUsersQuery } from '@trail/modules/user/application';
import { buildUserAggregate } from '@trail/modules/user/domain-testing';
import { EnhancedQueryBus, Query } from '@trail/shared/cqrs/util-nestjs';

import { GetCommunityLeaderboardQuery } from './GetCommunityLeaderboardQuery';
import { GetCommunityLeaderboardQueryHandler } from './GetCommunityLeaderboardQueryHandler';
import { GetLeagueLeaderboardQuery } from './GetLeagueLeaderboardQuery';
import { GetLeagueLeaderboardQueryHandler } from './GetLeagueLeaderboardQueryHandler';
import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';
import { ListLeaderboardFieldIdsQueryHandler } from './ListLeaderboardFieldIdsQueryHandler';
import { ListLeagueFieldPredictionsQuery } from './ListLeagueFieldPredictionsQuery';
import { ListLeagueFieldPredictionsQueryHandler } from './ListLeagueFieldPredictionsQueryHandler';

const u = buildLeagueUserId;
const viewer = { userId: OWNER_ID, isAdmin: false };
const OTHER_RACE_FIELD_ID = '55555555-5555-4555-8555-555555555555';

function queryBusAnswering(
  answers: [new (...args: never[]) => Query<unknown>, unknown][],
): EnhancedQueryBus {
  return {
    execute: jest.fn((query: Query<unknown>) => {
      const answer = answers.find(
        ([queryClass]) => query instanceof queryClass,
      );
      return answer
        ? Promise.resolve(answer[1])
        : Promise.reject(new Error(`unexpected ${query.constructor.name}`));
    }),
  } as unknown as EnhancedQueryBus;
}

describe('ListLeaderboardFieldIdsQueryHandler', () => {
  const otherRace = buildRaceAggregate({
    id: '99999999-9999-4999-8999-999999999999',
    fieldList: [],
  });

  it('adds up the fields of every public race', async () => {
    const queryBus = queryBusAnswering([
      [ListRacesQuery, [buildRaceAggregate(), otherRace]],
    ]);
    await expect(
      new ListLeaderboardFieldIdsQueryHandler(queryBus).execute(
        new ListLeaderboardFieldIdsQuery({}),
      ),
    ).resolves.toEqual([MEN_FIELD_ID, WOMEN_FIELD_ID]);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListRacesQuery({ statusList: PUBLIC_RACE_STATUS_LIST }),
    );
  });

  it('keeps the fields of one race when asked', async () => {
    const queryBus = queryBusAnswering([[GetRaceQuery, buildRaceAggregate()]]);
    await expect(
      new ListLeaderboardFieldIdsQueryHandler(queryBus).execute(
        new ListLeaderboardFieldIdsQuery({ raceId: RACE_ID }),
      ),
    ).resolves.toEqual([MEN_FIELD_ID, WOMEN_FIELD_ID]);
  });
});

describe('GetCommunityLeaderboardQueryHandler', () => {
  it('ranks every active player on the public races', async () => {
    const active = buildUserAggregate({ id: u(1) });
    const disabled = buildUserAggregate({
      id: u(2),
      disabledAt: new Date('2026-10-01T10:00:00Z'),
    });
    const queryBus = queryBusAnswering([
      [ListLeaderboardFieldIdsQuery, [MEN_FIELD_ID, OTHER_RACE_FIELD_ID]],
      [ListUsersQuery, [active, disabled]],
      [GetLeaderboardQuery, []],
    ]);
    await new GetCommunityLeaderboardQueryHandler(queryBus).execute(
      new GetCommunityLeaderboardQuery({ raceId: RACE_ID }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListLeaderboardFieldIdsQuery({ raceId: RACE_ID }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeaderboardQuery({
        fieldIdList: [MEN_FIELD_ID, OTHER_RACE_FIELD_ID],
        userIdList: [u(1)],
      }),
    );
  });
});

describe('GetLeagueLeaderboardQueryHandler', () => {
  it('ranks the members of the league the viewer can see', async () => {
    const queryBus = queryBusAnswering([
      [
        GetLeagueQuery,
        buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] }),
      ],
      [ListLeaderboardFieldIdsQuery, [MEN_FIELD_ID]],
      [GetLeaderboardQuery, []],
    ]);
    await new GetLeagueLeaderboardQueryHandler(queryBus).execute(
      new GetLeagueLeaderboardQuery({ leagueId: LEAGUE_ID, viewer }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeagueQuery({ leagueId: LEAGUE_ID, viewer }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeaderboardQuery({
        fieldIdList: [MEN_FIELD_ID],
        userIdList: [OWNER_ID, u(2)],
      }),
    );
  });
});

describe('ListLeagueFieldPredictionsQueryHandler', () => {
  it('lists the revealed predictions of the league members', async () => {
    const prediction = buildPredictionAggregate();
    const queryBus = queryBusAnswering([
      [
        GetLeagueQuery,
        buildLeagueAggregate({ memberIdList: [OWNER_ID, u(2)] }),
      ],
      [ListRevealedPredictionsByFieldQuery, [prediction]],
    ]);
    await expect(
      new ListLeagueFieldPredictionsQueryHandler(queryBus).execute(
        new ListLeagueFieldPredictionsQuery({
          leagueId: LEAGUE_ID,
          fieldId: MEN_FIELD_ID,
          viewer,
        }),
      ),
    ).resolves.toEqual([prediction]);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListRevealedPredictionsByFieldQuery({
        fieldId: MEN_FIELD_ID,
        userIdList: [OWNER_ID, u(2)],
      }),
    );
  });
});
