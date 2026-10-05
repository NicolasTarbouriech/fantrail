import { z } from 'zod';

import {
  Gender,
  RaceAggregate,
  RaceField,
  RaceStatus,
} from '@trail/modules/race/domain';
import {
  RaceEntity,
  RaceFieldEntity,
} from '@trail/shared/database/data-access-main';

function mapField(entity: RaceFieldEntity): RaceField {
  return RaceField.create(
    entity.id,
    {
      gender: z.nativeEnum(Gender).parse(entity.gender),
      startAt: entity.start_at,
      lockAt: entity.lock_at,
    },
    entity.locked_at,
  );
}

export function mapRaceAggregate(entity: RaceEntity): RaceAggregate {
  const fieldList = [...(entity.field_list ?? [])].sort((a, b) =>
    a.gender.localeCompare(b.gender),
  );
  return new RaceAggregate(
    entity.id,
    {
      name: entity.name,
      startDate: entity.start_date,
      location: entity.location,
      distanceInKm: entity.distance_in_km,
      elevationGainInMeters: entity.elevation_gain_in_meters,
      timezone: entity.timezone,
      websiteUrl: entity.website_url,
      liveTrailUrl: entity.live_trail_url,
      pickCount: z.union([z.literal(3), z.literal(5)]).parse(entity.pick_count),
      timeTolerancePercent: entity.time_tolerance_percent,
      trailEventId: entity.trail_event_id,
    },
    z.nativeEnum(RaceStatus).parse(entity.status),
    fieldList.map(mapField),
  );
}
