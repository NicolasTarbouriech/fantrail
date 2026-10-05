import type { RacePageRaceFragment } from '../../services/graphql';

export type AdminRace = RacePageRaceFragment;
export type AdminField = AdminRace['fields'][number];
export type AdminRunner = AdminField['startList']['runners'][number];
