export const paths = {
  home: '/',
  login: '/connexion',
  register: '/inscription',
  join: (inviteCode: string) => `/join/${inviteCode}`,
  races: '/courses',
  prediction: (raceId: string, fieldSlug: string) =>
    `/courses/${raceId}/${fieldSlug}`,
  raceLeaderboard: (raceId: string) => `/courses/${raceId}/classement`,
  leagues: '/ligues',
  createLeague: '/ligues/nouvelle',
  league: (leagueId: string, raceId?: string) =>
    raceId ? `/ligues/${leagueId}?course=${raceId}` : `/ligues/${leagueId}`,
  leagueSettings: (leagueId: string) => `/ligues/${leagueId}/reglages`,
  scores: '/scores',
  scorecard: (raceId: string, fieldSlug: string) =>
    `/scores/${raceId}/${fieldSlug}`,
  profile: '/profil',
  points: '/points',
};

export const tabPaths = {
  home: paths.home,
  races: paths.races,
  leagues: paths.leagues,
  scores: paths.scores,
  profile: paths.profile,
};
