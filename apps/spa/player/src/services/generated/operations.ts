import * as Types from '@trail/shared/apps/backend/web/data-access-graphql-types';

export type RequireAuthQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type RequireAuthQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, email: string, pseudo: string, role: Types.UserRole } | null };

export type UseAuthActionsMutateLoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type UseAuthActionsMutateLoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Me', id: string, email: string, pseudo: string, role: Types.UserRole } };

export type UseAuthActionsMutateRegisterMutationVariables = Types.Exact<{
  data: Types.RegisterInput;
}>;


export type UseAuthActionsMutateRegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'Me', id: string, email: string, pseudo: string, role: Types.UserRole } };

export type UseAuthActionsMutateLogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type UseAuthActionsMutateLogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type JoinPageQueryVariables = Types.Exact<{
  inviteCode: Types.Scalars['String']['input'];
}>;


export type JoinPageQuery = { __typename?: 'Query', leagueByInviteCode: { __typename?: 'League', id: string, name: string, memberCount: number, ownerId: string, isMember: boolean, members: Array<{ __typename?: 'Player', id: string, pseudo: string }>, races: Array<{ __typename?: 'Race', id: string, name: string }> } };

export type JoinPageMutateJoinMutationVariables = Types.Exact<{
  inviteCode: Types.Scalars['String']['input'];
}>;


export type JoinPageMutateJoinMutation = { __typename?: 'Mutation', joinLeagueByInviteCode: { __typename?: 'League', id: string } };

export type LoginPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LoginPageQuery = { __typename?: 'Query', races: Array<{ __typename?: 'Race', id: string, name: string, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, lockAt: string, isLocked: boolean }> }> };

export type HomePageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', races: Array<{ __typename?: 'Race', id: string, name: string, location: string, distanceInKm: number, timezone: string, pickCount: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, withdrawnRunners: Array<{ __typename?: 'Runner', id: string, fullName: string }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number } | null }> }>, myPredictions: Array<{ __typename?: 'Prediction', id: string, fieldId: string, pickList: Array<string | null>, winnerTimeEstimateInSeconds: number | null, isComplete: boolean, withdrawnRunnerIds: Array<string> }>, myLeagues: Array<{ __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, memberCount: number, leaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> }>, communityLeaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> };

export type HomePageGetRaceScoresQueryVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type HomePageGetRaceScoresQuery = { __typename?: 'Query', communityLeaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> };

export type HomePageGetFieldScoreQueryVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
}>;


export type HomePageGetFieldScoreQuery = { __typename?: 'Query', myScorecard: { __typename?: 'Scorecard', fieldId: string, total: number } | null };

export type CommunityPageQueryVariables = Types.Exact<{
  raceId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type CommunityPageQuery = { __typename?: 'Query', communityLeaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number, player: { __typename?: 'Player', id: string, pseudo: string } }>, races: Array<{ __typename?: 'Race', id: string, name: string, status: Types.RaceStatus }> };

export type CreateLeaguePageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateLeaguePageQuery = { __typename?: 'Query', races: Array<{ __typename?: 'Race', id: string, name: string, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, startAt: string }> }> };

export type CreateLeaguePageMutateCreateMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  visibility: Types.LeagueVisibility;
  raceIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateLeaguePageMutateCreateMutation = { __typename?: 'Mutation', createLeague: { __typename?: 'League', id: string } };

export type LeaguePageQueryVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  raceId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type LeaguePageQuery = { __typename?: 'Query', league: { __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, memberCount: number, ownerId: string, isOwner: boolean, isMember: boolean, inviteCode: string | null, members: Array<{ __typename?: 'Player', id: string, pseudo: string }>, races: Array<{ __typename?: 'Race', id: string, name: string, status: Types.RaceStatus, pickCount: number, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, isLocked: boolean }> }>, leaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number, player: { __typename?: 'Player', id: string, pseudo: string } }> } };

export type LeaguePageGetFieldPredictionsQueryVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  fieldId: Types.Scalars['ID']['input'];
  raceId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageGetFieldPredictionsQuery = { __typename?: 'Query', race: { __typename?: 'Race', id: string, fields: Array<{ __typename?: 'RaceField', id: string, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, lastName: string, favoriteRank: number | null, isWithdrawn: boolean }> } }> }, league: { __typename?: 'League', id: string, fieldPredictions: Array<{ __typename?: 'Prediction', id: string, fieldId: string, pickList: Array<string | null>, winnerTimeEstimateInSeconds: number | null, player: { __typename?: 'Player', id: string, pseudo: string } }> } };

export type LeaguePageMutateJoinMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageMutateJoinMutation = { __typename?: 'Mutation', joinLeague: { __typename?: 'League', id: string, isMember: boolean, memberCount: number } };

export type LeaguePageMutateLeaveMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeaguePageMutateLeaveMutation = { __typename?: 'Mutation', leaveLeague: boolean };

export type LeagueSettingsPageQueryVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeagueSettingsPageQuery = { __typename?: 'Query', races: Array<{ __typename?: 'Race', id: string, name: string, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, startAt: string }> }>, league: { __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, isOwner: boolean, ownerId: string, inviteCode: string | null, raceIds: Array<string>, members: Array<{ __typename?: 'Player', id: string, pseudo: string }> } };

export type LeagueSettingsPageMutateRenameMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type LeagueSettingsPageMutateRenameMutation = { __typename?: 'Mutation', renameLeague: { __typename?: 'League', id: string, name: string } };

export type LeagueSettingsPageMutateVisibilityMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  visibility: Types.LeagueVisibility;
}>;


export type LeagueSettingsPageMutateVisibilityMutation = { __typename?: 'Mutation', changeLeagueVisibility: { __typename?: 'League', id: string, visibility: Types.LeagueVisibility } };

export type LeagueSettingsPageMutateRegenerateCodeMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeagueSettingsPageMutateRegenerateCodeMutation = { __typename?: 'Mutation', regenerateLeagueInviteCode: { __typename?: 'League', id: string, inviteCode: string | null } };

export type LeagueSettingsPageMutateRemoveMemberMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  userId: Types.Scalars['ID']['input'];
}>;


export type LeagueSettingsPageMutateRemoveMemberMutation = { __typename?: 'Mutation', removeLeagueMember: { __typename?: 'League', id: string, memberCount: number, members: Array<{ __typename?: 'Player', id: string, pseudo: string }> } };

export type LeagueSettingsPageMutateDeleteMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeagueSettingsPageMutateDeleteMutation = { __typename?: 'Mutation', deleteLeague: boolean };

export type LeagueSettingsPageMutateRacesMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
  raceIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type LeagueSettingsPageMutateRacesMutation = { __typename?: 'Mutation', changeLeagueRaces: { __typename?: 'League', id: string, raceIds: Array<string> } };

export type LeaguesPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LeaguesPageQuery = { __typename?: 'Query', myLeagues: Array<{ __typename?: 'League', id: string, name: string, visibility: Types.LeagueVisibility, memberCount: number, leaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> }>, publicLeagues: Array<{ __typename?: 'League', id: string, name: string, memberCount: number, isMember: boolean }>, communityLeaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> };

export type LeaguesPageMutateJoinByCodeMutationVariables = Types.Exact<{
  inviteCode: Types.Scalars['String']['input'];
}>;


export type LeaguesPageMutateJoinByCodeMutation = { __typename?: 'Mutation', joinLeagueByInviteCode: { __typename?: 'League', id: string } };

export type LeaguesPageMutateJoinMutationVariables = Types.Exact<{
  leagueId: Types.Scalars['ID']['input'];
}>;


export type LeaguesPageMutateJoinMutation = { __typename?: 'Mutation', joinLeague: { __typename?: 'League', id: string } };

export type PredictionPageQueryVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type PredictionPageQuery = { __typename?: 'Query', race: { __typename?: 'Race', id: string, name: string, distanceInKm: number, elevationGainInMeters: number, timezone: string, pickCount: number, timeTolerancePercent: number, status: Types.RaceStatus, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startAt: string, lockAt: string, isLocked: boolean, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, fullName: string, lastName: string, nationality: string | null, index: number | null, favoriteRank: number | null, isWithdrawn: boolean }> }, result: { __typename?: 'FieldResult', fieldId: string, version: number } | null }> }, myPredictions: Array<{ __typename?: 'Prediction', id: string, fieldId: string, pickList: Array<string | null>, winnerTimeEstimateInSeconds: number | null, isComplete: boolean, finalizedAt: string | null, updatedAt: string, withdrawnRunnerIds: Array<string> }> };

export type PredictionPageMutateSaveMutationVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
  pickList: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
  winnerTimeEstimateInSeconds?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type PredictionPageMutateSaveMutation = { __typename?: 'Mutation', savePrediction: { __typename?: 'Prediction', id: string, fieldId: string, pickList: Array<string | null>, winnerTimeEstimateInSeconds: number | null, isComplete: boolean, finalizedAt: string | null, updatedAt: string, withdrawnRunnerIds: Array<string> } };

export type ScorecardPageQueryVariables = Types.Exact<{
  raceId: Types.Scalars['ID']['input'];
}>;


export type ScorecardPageQuery = { __typename?: 'Query', race: { __typename?: 'Race', id: string, name: string, timeTolerancePercent: number, fields: Array<{ __typename?: 'RaceField', id: string, gender: Types.Gender, startList: { __typename?: 'StartList', fieldId: string, runners: Array<{ __typename?: 'Runner', id: string, fullName: string, isWithdrawn: boolean }> } }> } };

export type ScorecardPageGetScorecardQueryVariables = Types.Exact<{
  fieldId: Types.Scalars['ID']['input'];
}>;


export type ScorecardPageGetScorecardQuery = { __typename?: 'Query', myScorecard: { __typename?: 'Scorecard', fieldId: string, resultVersion: number, total: number, picks: Array<{ __typename?: 'PickScore', pickPosition: number, runnerId: string, finishPosition: number | null, favoriteRank: number | null, positionPoints: number, multiplier: number, points: number }>, time: { __typename?: 'TimeScore', estimateInSeconds: number, actualInSeconds: number, gapInSeconds: number, points: number }, bonuses: Array<{ __typename?: 'Bonus', type: Types.BonusType, points: number }> } | null };

export type ScoresPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ScoresPageQuery = { __typename?: 'Query', communityLeaderboard: Array<{ __typename?: 'LeaderboardEntry', rank: number, userId: string, total: number, scoredFieldCount: number }> };
