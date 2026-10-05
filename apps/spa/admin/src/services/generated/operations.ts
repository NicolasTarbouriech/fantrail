import * as Types from '@trail/shared/apps/backend/web/data-access-graphql-types';

export type RequireAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RequireAdminQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, email: string, pseudo: string, role: Types.UserRole } | null };

export type RequireAdminMutateLogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type RequireAdminMutateLogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type LoginPageMutateLoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type LoginPageMutateLoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Me', id: string, email: string, pseudo: string, role: Types.UserRole } };

export type LeaguePageQueryVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageQuery = { __typename?: 'Query', league: { __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, memberCount: number, ownerId: string, inviteCode: string | null, createdAt: string, members: Array<{ __typename?: 'Player', id: string, pseudo: string }>, races: Array<{ __typename?: 'Race', id: string, name: string }>, leaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number }> } };

export type LeaguePageMutateRenameMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type LeaguePageMutateRenameMutation = { __typename?: 'Mutation', renameLeague: { __typename?: 'League', id: string, name: string } };

export type LeaguePageMutateRemoveMemberMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  userId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageMutateRemoveMemberMutation = { __typename?: 'Mutation', removeLeagueMember: { __typename?: 'League', id: string, memberCount: number, members: Array<{ __typename?: 'Player', id: string, pseudo: string }> } };

export type LeaguePageMutateDeleteMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageMutateDeleteMutation = { __typename?: 'Mutation', deleteLeague: boolean };

export type LeaguesPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LeaguesPageQuery = { __typename?: 'Query', adminLeagues: Array<{ __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, memberCount: number, ownerId: string, createdAt: string, members: Array<{ __typename?: 'Player', id: string, pseudo: string }> }> };

export type PlayersPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PlayersPageQuery = { __typename?: 'Query', adminUsers: Array<{ __typename?: 'AdminUser', id: string, email: string, pseudo: string, role: Types.UserRole, disabledAt: string | null, createdAt: string }> };

export type PlayersPageMutateDisableMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type PlayersPageMutateDisableMutation = { __typename?: 'Mutation', disableUser: { __typename?: 'AdminUser', id: string, disabledAt: string | null } };

export type PlayersPageMutateEnableMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type PlayersPageMutateEnableMutation = { __typename?: 'Mutation', enableUser: { __typename?: 'AdminUser', id: string, disabledAt: string | null } };

export type FieldsTabMutateAddFieldMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
  data: Types.RaceFieldInput;
}>;


export type FieldsTabMutateAddFieldMutation = { __typename?: 'Mutation', addRaceField: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type FieldsTabMutateUpdateFieldMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  data: Types.RaceFieldInput;
}>;


export type FieldsTabMutateUpdateFieldMutation = { __typename?: 'Mutation', updateRaceField: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type FieldsTabMutateLockFieldMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
}>;


export type FieldsTabMutateLockFieldMutation = { __typename?: 'Mutation', lockRaceField: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type FieldsTabMutateAddRunnersMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  dataList: Array<Types.RunnerInput> | Types.RunnerInput;
}>;


export type FieldsTabMutateAddRunnersMutation = { __typename?: 'Mutation', addRunners: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> } };

export type FieldsTabMutateUpdateRunnerMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  runnerId: Types.Scalars['ID']['input'];
  data: Types.RunnerInput;
}>;


export type FieldsTabMutateUpdateRunnerMutation = { __typename?: 'Mutation', updateRunner: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> } };

export type FieldsTabMutateWithdrawRunnerMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  runnerId: Types.Scalars['ID']['input'];
}>;


export type FieldsTabMutateWithdrawRunnerMutation = { __typename?: 'Mutation', withdrawRunner: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> } };

export type FieldsTabMutateReinstateRunnerMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  runnerId: Types.Scalars['ID']['input'];
}>;


export type FieldsTabMutateReinstateRunnerMutation = { __typename?: 'Mutation', reinstateRunner: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> } };

export type RaceInfoTabMutateCreateMutationVariables = Types.Exact<{
  data: Types.RaceInput;
}>;


export type RaceInfoTabMutateCreateMutation = { __typename?: 'Mutation', createRace: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateUpdateMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
  data: Types.RaceInput;
}>;


export type RaceInfoTabMutateUpdateMutation = { __typename?: 'Mutation', updateRace: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateOpenMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RaceInfoTabMutateOpenMutation = { __typename?: 'Mutation', openRace: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateLockMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RaceInfoTabMutateLockMutation = { __typename?: 'Mutation', lockRace: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateMarkScoredMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RaceInfoTabMutateMarkScoredMutation = { __typename?: 'Mutation', markRaceScored: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateCancelMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RaceInfoTabMutateCancelMutation = { __typename?: 'Mutation', cancelRace: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RaceInfoTabMutateDeleteMutationVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RaceInfoTabMutateDeleteMutation = { __typename?: 'Mutation', deleteRace: boolean };

export type RacePageRunnerFragment = { __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null };

export type RacePageRaceFragment = { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> };

export type RacePageQueryVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type RacePageQuery = { __typename?: 'Query', race: { __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, websiteUrl: string | null, liveTrailUrl: string | null, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, lockedAt: string | null, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, firstName: string, lastName: string, fullName: string, nationality: string | null, index: number | null, indexSource: Types.IndexSource | null, utmbUrl: string | null, itraUrl: string | null, isWithdrawn: boolean, withdrawnAt: string | null, favoriteRank: number | null }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } | null }> } };

export type RacesPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RacesPageQuery = { __typename?: 'Query', adminRaces: Array<{ __typename?: 'Race', id: string, name: string, startDate: string, location: string, distanceInKm: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startList: { __typename?: 'StartList', fieldId: string, activeRunnerCount: number } }> }> };

export type ResultsTabMutatePublishMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  rankingList: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  winnerTimeInSeconds: Types.Scalars['Int']['input'];
}>;


export type ResultsTabMutatePublishMutation = { __typename?: 'Mutation', publishFieldResult: { __typename?: 'FieldResult', fieldId: string, version: number, rankingList: Array<string>, winnerTimeInSeconds: number, publishedAt: string | null } };
