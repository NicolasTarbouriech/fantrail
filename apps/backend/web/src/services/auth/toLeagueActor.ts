import { LeagueActor } from '@trail/modules/league/domain';
import { UserAggregate } from '@trail/modules/user/domain';

export function toLeagueActor(user: UserAggregate): LeagueActor {
  return { userId: user.id, isAdmin: user.isAdmin };
}
