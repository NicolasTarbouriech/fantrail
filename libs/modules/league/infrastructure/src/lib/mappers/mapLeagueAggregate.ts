import { z } from 'zod';

import {
  LeagueAggregate,
  LeagueMember,
  LeagueVisibility,
} from '@trail/modules/league/domain';
import { LeagueEntity } from '@trail/shared/database/data-access-main';

export function mapLeagueAggregate(entity: LeagueEntity): LeagueAggregate {
  const memberList = [...(entity.member_list ?? [])].sort(
    (a, b) => a.joined_at.getTime() - b.joined_at.getTime(),
  );
  return new LeagueAggregate(
    entity.id,
    entity.name,
    z.nativeEnum(LeagueVisibility).parse(entity.visibility),
    entity.owner_id,
    entity.invite_code,
    memberList.map(
      (member) => new LeagueMember(member.user_id, member.joined_at),
    ),
    entity.created_at,
    entity.race_id_list,
  );
}
