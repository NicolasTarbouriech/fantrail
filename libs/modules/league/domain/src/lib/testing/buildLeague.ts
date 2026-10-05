import { LeagueAggregate } from '../aggregates';
import { LeagueVisibility } from '../enums';
import { LeagueMember } from '../valueObjects';

export const LEAGUE_ID = '88888888-8888-4888-8888-888888888888';
export const buildLeagueUserId = (n: number): string =>
  `66666666-6666-4666-8666-${String(n).padStart(12, '0')}`;
export const OWNER_ID = buildLeagueUserId(1);
export const INVITE_CODE = 'CHAMX742';
export const LEAGUE_RACE_ID = '77777777-7777-4777-8777-777777777771';
export const OTHER_LEAGUE_RACE_ID = '77777777-7777-4777-8777-777777777772';

export function buildLeagueAggregate({
  visibility = LeagueVisibility.Private,
  memberIdList = [OWNER_ID],
  inviteCode = INVITE_CODE,
  raceIdList = [LEAGUE_RACE_ID],
}: {
  visibility?: LeagueVisibility;
  memberIdList?: string[];
  inviteCode?: string;
  raceIdList?: string[];
} = {}): LeagueAggregate {
  return new LeagueAggregate(
    LEAGUE_ID,
    'Les Chamois',
    visibility,
    OWNER_ID,
    inviteCode,
    memberIdList.map(
      (userId) => new LeagueMember(userId, new Date('2026-10-01T10:00:00Z')),
    ),
    new Date('2026-10-01T10:00:00Z'),
    raceIdList,
  );
}
