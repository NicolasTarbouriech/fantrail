import { GetLeagueQuery } from '@trail/modules/league/application';
import {
  LEAGUE_ID,
  LEAGUE_RACE_ID,
  OWNER_ID,
  buildLeagueAggregate,
  buildLeagueUserId,
} from '@trail/modules/league/domain-testing';
import {
  ListPredictionsByFieldQuery,
  ListRevealedPredictionsByFieldQuery,
} from '@trail/modules/prediction/application';
import { PredictionAggregate } from '@trail/modules/prediction/domain';
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
import { GetPlayerTotalPointsQuery } from './GetPlayerTotalPointsQuery';
import { GetPlayerTotalPointsQueryHandler } from './GetPlayerTotalPointsQueryHandler';
import { ListLeaderboardFieldIdsQuery } from './ListLeaderboardFieldIdsQuery';
import { ListLeaderboardFieldIdsQueryHandler } from './ListLeaderboardFieldIdsQueryHandler';
import { ListLeagueFieldPredictionsQuery } from './ListLeagueFieldPredictionsQuery';
import { ListLeagueFieldPredictionsQueryHandler } from './ListLeagueFieldPredictionsQueryHandler';

const u = buildLeagueUserId;
const viewer = { userId: OWNER_ID, isAdmin: false };

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

  it('keeps the public races among a list', async () => {
    const queryBus = queryBusAnswering([
      [ListRacesQuery, [buildRaceAggregate(), otherRace]],
    ]);
    await expect(
      new ListLeaderboardFieldIdsQueryHandler(queryBus).execute(
        new ListLeaderboardFieldIdsQuery({ raceIdList: [otherRace.id] }),
      ),
    ).resolves.toEqual([]);
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
  it('ranks the active players with a prediction on the race', async () => {
    const participant = buildUserAggregate({ id: u(1) });
    const disabled = buildUserAggregate({
      id: u(2),
      disabledAt: new Date('2026-10-01T10:00:00Z'),
    });
    const bystander = buildUserAggregate({ id: u(3) });
    const predictionsOf = (userIdList: string[]) =>
      userIdList.map((userId) => ({
        userId,
      })) as unknown as PredictionAggregate[];
    const queryBus = {
      execute: jest.fn((query: Query<unknown>) => {
        if (query instanceof ListLeaderboardFieldIdsQuery) {
          return Promise.resolve([MEN_FIELD_ID, WOMEN_FIELD_ID]);
        }
        if (query instanceof ListUsersQuery) {
          return Promise.resolve([participant, disabled, bystander]);
        }
        if (query instanceof ListPredictionsByFieldQuery) {
          return Promise.resolve(
            query.input.fieldId === MEN_FIELD_ID
              ? predictionsOf([u(1), u(2)])
              : predictionsOf([u(1)]),
          );
        }
        return Promise.resolve([]);
      }),
    } as unknown as EnhancedQueryBus;
    await new GetCommunityLeaderboardQueryHandler(queryBus).execute(
      new GetCommunityLeaderboardQuery({ raceId: RACE_ID }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListLeaderboardFieldIdsQuery({ raceId: RACE_ID }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeaderboardQuery({
        fieldIdList: [MEN_FIELD_ID, WOMEN_FIELD_ID],
        userIdList: [u(1)],
      }),
    );
  });
});

describe('GetPlayerTotalPointsQueryHandler', () => {
  it('adds up the points of the player on every public race', async () => {
    const queryBus = queryBusAnswering([
      [ListLeaderboardFieldIdsQuery, [MEN_FIELD_ID]],
      [GetLeaderboardQuery, [{ total: 42 }]],
    ]);
    await expect(
      new GetPlayerTotalPointsQueryHandler(queryBus).execute(
        new GetPlayerTotalPointsQuery({ userId: u(1) }),
      ),
    ).resolves.toBe(42);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeaderboardQuery({
        fieldIdList: [MEN_FIELD_ID],
        userIdList: [u(1)],
      }),
    );
  });

  it('counts 0 before any score', async () => {
    const queryBus = queryBusAnswering([
      [ListLeaderboardFieldIdsQuery, []],
      [GetLeaderboardQuery, []],
    ]);
    await expect(
      new GetPlayerTotalPointsQueryHandler(queryBus).execute(
        new GetPlayerTotalPointsQuery({ userId: u(1) }),
      ),
    ).resolves.toBe(0);
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
      new ListLeaderboardFieldIdsQuery({ raceIdList: [LEAGUE_RACE_ID] }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetLeaderboardQuery({
        fieldIdList: [MEN_FIELD_ID],
        userIdList: [OWNER_ID, u(2)],
      }),
    );
  });

  it('keeps one race only when it belongs to the league', async () => {
    const queryBus = queryBusAnswering([
      [GetLeagueQuery, buildLeagueAggregate()],
      [ListLeaderboardFieldIdsQuery, []],
      [GetLeaderboardQuery, []],
    ]);
    const handler = new GetLeagueLeaderboardQueryHandler(queryBus);
    await handler.execute(
      new GetLeagueLeaderboardQuery({
        leagueId: LEAGUE_ID,
        viewer,
        raceId: LEAGUE_RACE_ID,
      }),
    );
    await handler.execute(
      new GetLeagueLeaderboardQuery({
        leagueId: LEAGUE_ID,
        viewer,
        raceId: RACE_ID,
      }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListLeaderboardFieldIdsQuery({ raceIdList: [LEAGUE_RACE_ID] }),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListLeaderboardFieldIdsQuery({ raceIdList: [] }),
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
