export const LEAGUE_NAME_MIN_LENGTH = 3;
export const LEAGUE_NAME_MAX_LENGTH = 40;

export function getLeagueNameError(name: string): string | null {
  const length = name.trim().length;
  if (length < LEAGUE_NAME_MIN_LENGTH || length > LEAGUE_NAME_MAX_LENGTH) {
    return `Entre ${LEAGUE_NAME_MIN_LENGTH} et ${LEAGUE_NAME_MAX_LENGTH} caractères.`;
  }
  return null;
}
