export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type AdminUser = {
  __typename?: 'AdminUser';
  createdAt: Scalars['DateTime']['output'];
  disabledAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pseudo: Scalars['String']['output'];
  role: UserRole;
};

export type Bonus = {
  __typename?: 'Bonus';
  points: Scalars['Int']['output'];
  type: BonusType;
};

export enum BonusType {
  MultipleExactPositions = 'MultipleExactPositions',
  Top3Exact = 'Top3Exact',
  Top3Unordered = 'Top3Unordered',
  Top5Exact = 'Top5Exact',
  Top5Unordered = 'Top5Unordered',
  Winner = 'Winner'
}

export type FieldResult = {
  __typename?: 'FieldResult';
  dnfRunnerIdList: Array<Scalars['ID']['output']>;
  fieldId: Scalars['ID']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Runner ids from the winner to the 10th */
  rankingList: Array<Scalars['ID']['output']>;
  /** Increases with each correction */
  version: Scalars['Int']['output'];
  winnerTimeInSeconds: Scalars['Int']['output'];
};

export enum Gender {
  Men = 'Men',
  Women = 'Women'
}

export enum IndexSource {
  Betrail = 'Betrail',
  Itra = 'Itra',
  Manual = 'Manual',
  Utmb = 'Utmb'
}

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  player: Player;
  rank: Scalars['Int']['output'];
  /** Fields where the player scored */
  scoredFieldCount: Scalars['Int']['output'];
  /** Cumulated gap on the winner time, first tie-break */
  timeGapInSeconds?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export type League = {
  __typename?: 'League';
  createdAt: Scalars['DateTime']['output'];
  /** Members predictions on a field, revealed once it locks */
  fieldPredictions: Array<Prediction>;
  id: Scalars['ID']['output'];
  /** Shown to members only, link /join/<code> */
  inviteCode?: Maybe<Scalars['String']['output']>;
  isMember: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  /** Members ranked on one race or on every public race */
  leaderboard: Array<LeaderboardEntry>;
  memberCount: Scalars['Int']['output'];
  members: Array<Player>;
  name: Scalars['String']['output'];
  ownerId: Scalars['ID']['output'];
  visibility: LeagueVisibility;
};


export type LeagueFieldPredictionsArgs = {
  fieldId: Scalars['ID']['input'];
};


export type LeagueLeaderboardArgs = {
  raceId?: InputMaybe<Scalars['ID']['input']>;
};

export enum LeagueVisibility {
  Private = 'Private',
  Public = 'Public'
}

export type Me = {
  __typename?: 'Me';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pseudo: Scalars['String']['output'];
  role: UserRole;
};

export type Mutation = {
  __typename?: 'Mutation';
  addRaceField: Race;
  addRunners: StartList;
  cancelRace: Race;
  changeLeagueVisibility: League;
  createLeague: League;
  createRace: Race;
  deleteLeague: Scalars['Boolean']['output'];
  disableUser: AdminUser;
  enableUser: AdminUser;
  /** Joins a public league */
  joinLeague: League;
  joinLeagueByInviteCode: League;
  leaveLeague: Scalars['Boolean']['output'];
  lockRace: Race;
  /** Locks a field now, for an early or delayed start */
  lockRaceField: Race;
  login: Me;
  logout: Scalars['Boolean']['output'];
  openRace: Race;
  /** Publishes or corrects the result, then rescores the field */
  publishFieldResult: FieldResult;
  regenerateLeagueInviteCode: League;
  register: Me;
  reinstateRunner: StartList;
  removeLeagueMember: League;
  renameLeague: League;
  /** Saves the prediction, complete or not, until the field locks */
  savePrediction: Prediction;
  updateRace: Race;
  updateRaceField: Race;
  updateRunner: StartList;
  withdrawRunner: StartList;
};


export type MutationAddRaceFieldArgs = {
  data: RaceFieldInput;
  raceId: Scalars['ID']['input'];
};


export type MutationAddRunnersArgs = {
  dataList: Array<RunnerInput>;
  fieldId: Scalars['ID']['input'];
};


export type MutationCancelRaceArgs = {
  raceId: Scalars['ID']['input'];
};


export type MutationChangeLeagueVisibilityArgs = {
  leagueId: Scalars['ID']['input'];
  visibility: LeagueVisibility;
};


export type MutationCreateLeagueArgs = {
  name: Scalars['String']['input'];
  visibility: LeagueVisibility;
};


export type MutationCreateRaceArgs = {
  data: RaceInput;
};


export type MutationDeleteLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationDisableUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationEnableUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationJoinLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationJoinLeagueByInviteCodeArgs = {
  inviteCode: Scalars['String']['input'];
};


export type MutationLeaveLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationLockRaceArgs = {
  raceId: Scalars['ID']['input'];
};


export type MutationLockRaceFieldArgs = {
  fieldId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationOpenRaceArgs = {
  raceId: Scalars['ID']['input'];
};


export type MutationPublishFieldResultArgs = {
  dnfRunnerIdList?: Array<Scalars['ID']['input']>;
  fieldId: Scalars['ID']['input'];
  rankingList: Array<Scalars['ID']['input']>;
  winnerTimeInSeconds: Scalars['Int']['input'];
};


export type MutationRegenerateLeagueInviteCodeArgs = {
  leagueId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationReinstateRunnerArgs = {
  fieldId: Scalars['ID']['input'];
  runnerId: Scalars['ID']['input'];
};


export type MutationRemoveLeagueMemberArgs = {
  leagueId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRenameLeagueArgs = {
  leagueId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationSavePredictionArgs = {
  fieldId: Scalars['ID']['input'];
  pickList: Array<InputMaybe<Scalars['ID']['input']>>;
  winnerTimeEstimateInSeconds?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateRaceArgs = {
  data: RaceInput;
  raceId: Scalars['ID']['input'];
};


export type MutationUpdateRaceFieldArgs = {
  data: RaceFieldInput;
  fieldId: Scalars['ID']['input'];
};


export type MutationUpdateRunnerArgs = {
  data: RunnerInput;
  fieldId: Scalars['ID']['input'];
  runnerId: Scalars['ID']['input'];
};


export type MutationWithdrawRunnerArgs = {
  fieldId: Scalars['ID']['input'];
  runnerId: Scalars['ID']['input'];
};

export type PickScore = {
  __typename?: 'PickScore';
  favoriteRank?: Maybe<Scalars['Int']['output']>;
  /** Null outside the top 10 or when the runner did not finish */
  finishPosition?: Maybe<Scalars['Int']['output']>;
  /** Outsider multiplier, from 1.0 to 2.0 */
  multiplier: Scalars['Float']['output'];
  pickPosition: Scalars['Int']['output'];
  points: Scalars['Int']['output'];
  positionPoints: Scalars['Int']['output'];
  runnerId: Scalars['ID']['output'];
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['ID']['output'];
  pseudo: Scalars['String']['output'];
};

export type Prediction = {
  __typename?: 'Prediction';
  fieldId: Scalars['ID']['output'];
  finalizedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** Only complete predictions score points */
  isComplete: Scalars['Boolean']['output'];
  /** Runner id per pick position, null while not chosen */
  pickList: Array<Maybe<Scalars['ID']['output']>>;
  player: Player;
  updatedAt: Scalars['DateTime']['output'];
  winnerTimeEstimateInSeconds?: Maybe<Scalars['Int']['output']>;
  /** Picked runners who withdrew: they will score 0 */
  withdrawnRunnerIds: Array<Scalars['ID']['output']>;
};

export type Query = {
  __typename?: 'Query';
  adminLeagues: Array<League>;
  adminRaces: Array<Race>;
  adminUsers: Array<AdminUser>;
  /** Every player, on one race or on all public races */
  communityLeaderboard: Array<LeaderboardEntry>;
  league: League;
  /** Preview of the league behind an invite link, before joining */
  leagueByInviteCode: League;
  me?: Maybe<Me>;
  myLeagues: Array<League>;
  myPrediction?: Maybe<Prediction>;
  myPredictions: Array<Prediction>;
  /** Null until the field is scored or without complete prediction */
  myScorecard?: Maybe<Scorecard>;
  publicLeagues: Array<League>;
  race: Race;
  /** Races open to predictions, locked or scored */
  races: Array<Race>;
};


export type QueryAdminRacesArgs = {
  statusList?: InputMaybe<Array<RaceStatus>>;
};


export type QueryCommunityLeaderboardArgs = {
  raceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeagueArgs = {
  leagueId: Scalars['ID']['input'];
};


export type QueryLeagueByInviteCodeArgs = {
  inviteCode: Scalars['String']['input'];
};


export type QueryMyPredictionArgs = {
  fieldId: Scalars['ID']['input'];
};


export type QueryMyScorecardArgs = {
  fieldId: Scalars['ID']['input'];
};


export type QueryRaceArgs = {
  raceId: Scalars['ID']['input'];
};

export type Race = {
  __typename?: 'Race';
  distanceInKm: Scalars['Float']['output'];
  elevationGainInMeters: Scalars['Int']['output'];
  fields: Array<RaceField>;
  id: Scalars['ID']['output'];
  liveTrailUrl?: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pickCount: Scalars['Int']['output'];
  status: RaceStatus;
  timeTolerancePercent: Scalars['Float']['output'];
  /** IANA timezone of the race, e.g. Indian/Reunion */
  timezone: Scalars['String']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type RaceField = {
  __typename?: 'RaceField';
  gender: Gender;
  id: Scalars['ID']['output'];
  isLocked: Scalars['Boolean']['output'];
  lockAt: Scalars['DateTime']['output'];
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Null until the result is published */
  result?: Maybe<FieldResult>;
  startAt: Scalars['DateTime']['output'];
  startList: StartList;
};

export type RaceFieldInput = {
  gender: Gender;
  lockAt: Scalars['DateTime']['input'];
  startAt: Scalars['DateTime']['input'];
};

export type RaceInput = {
  distanceInKm: Scalars['Float']['input'];
  elevationGainInMeters: Scalars['Int']['input'];
  liveTrailUrl?: InputMaybe<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
  /** 3 or 5 */
  pickCount: Scalars['Int']['input'];
  timeTolerancePercent: Scalars['Float']['input'];
  /** IANA timezone of the race, e.g. Europe/Paris */
  timezone: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export enum RaceStatus {
  Cancelled = 'Cancelled',
  Draft = 'Draft',
  Locked = 'Locked',
  Open = 'Open',
  Scored = 'Scored'
}

export type RegisterInput = {
  email: Scalars['String']['input'];
  /** At least 8 characters with a letter, a digit and a special character */
  password: Scalars['String']['input'];
  /** 3 to 20 characters, unique regardless of case and accents */
  pseudo: Scalars['String']['input'];
};

export type Runner = {
  __typename?: 'Runner';
  /** 1 = best index among active runners */
  favoriteRank?: Maybe<Scalars['Int']['output']>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  indexSource?: Maybe<IndexSource>;
  isWithdrawn: Scalars['Boolean']['output'];
  itraUrl?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  /** ISO 3166-1 alpha-3 code */
  nationality?: Maybe<Scalars['String']['output']>;
  utmbUrl?: Maybe<Scalars['String']['output']>;
  withdrawnAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RunnerInput = {
  firstName: Scalars['String']['input'];
  index?: InputMaybe<Scalars['Int']['input']>;
  indexSource?: InputMaybe<IndexSource>;
  itraUrl?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  /** ISO 3166-1 alpha-3 code */
  nationality?: InputMaybe<Scalars['String']['input']>;
  utmbUrl?: InputMaybe<Scalars['String']['input']>;
};

export type Scorecard = {
  __typename?: 'Scorecard';
  bonuses: Array<Bonus>;
  fieldId: Scalars['ID']['output'];
  picks: Array<PickScore>;
  resultVersion: Scalars['Int']['output'];
  time: TimeScore;
  total: Scalars['Int']['output'];
};

export type StartList = {
  __typename?: 'StartList';
  fieldId: Scalars['ID']['output'];
  runners: Array<Runner>;
};

export type TimeScore = {
  __typename?: 'TimeScore';
  actualInSeconds: Scalars['Int']['output'];
  estimateInSeconds: Scalars['Int']['output'];
  gapInSeconds: Scalars['Int']['output'];
  points: Scalars['Int']['output'];
};

export enum UserRole {
  Admin = 'Admin',
  Player = 'Player'
}
