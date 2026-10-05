import type { LeaguePageQuery } from '../../services/graphql';

export type LeagueRace = LeaguePageQuery['league']['races'][number];
