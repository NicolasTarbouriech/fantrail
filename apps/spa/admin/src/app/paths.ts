export type RaceTab = 'infos' | 'champs' | 'resultats';

export const paths = {
  login: '/connexion',
  races: '/courses',
  newRace: '/courses/nouvelle',
  race: (raceId: string, tab: RaceTab = 'infos', fieldSlug?: string) =>
    `/courses/${raceId}/${tab}${fieldSlug ? `?champ=${fieldSlug}` : ''}`,
  leagues: '/ligues',
  league: (leagueId: string) => `/ligues/${leagueId}`,
  players: '/joueurs',
};

export const PLAYER_APP_URL: string =
  import.meta.env['VITE_PLAYER_URL'] ?? 'http://localhost:3000';
