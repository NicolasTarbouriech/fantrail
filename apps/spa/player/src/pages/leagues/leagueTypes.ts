import type { LeaguePageQuery } from '../../services/graphql';

export type LeagueRace = LeaguePageQuery['races'][number];
