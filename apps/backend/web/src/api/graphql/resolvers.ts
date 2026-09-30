import { LeagueResolver } from './modules/league/resolvers/LeagueResolver';
import { PredictionResolver } from './modules/prediction/resolvers/PredictionResolver';
import { RaceFieldResolver } from './modules/race/resolvers/RaceFieldResolver';
import { RaceResolver } from './modules/race/resolvers/RaceResolver';
import { StartListResolver } from './modules/race/resolvers/StartListResolver';
import { FieldResultResolver } from './modules/result/resolvers/FieldResultResolver';
import { LeaderboardEntryResolver } from './modules/scoring/resolvers/LeaderboardEntryResolver';
import { ScoringResolver } from './modules/scoring/resolvers/ScoringResolver';
import { AuthResolver } from './modules/user/resolvers/AuthResolver';
import { UserResolver } from './modules/user/resolvers/UserResolver';

export const resolvers = [
  RaceResolver,
  RaceFieldResolver,
  StartListResolver,
  AuthResolver,
  UserResolver,
  PredictionResolver,
  FieldResultResolver,
  ScoringResolver,
  LeaderboardEntryResolver,
  LeagueResolver,
];
