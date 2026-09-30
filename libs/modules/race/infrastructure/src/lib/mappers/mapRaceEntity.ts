import { DeepPartial } from 'typeorm';

import { RaceAggregate } from '@trail/modules/race/domain';
import {
  RaceEntity,
  RaceFieldEntity,
} from '@trail/shared/database/data-access-main';

export function mapRaceEntity(race: RaceAggregate): DeepPartial<RaceEntity> {
  return {
    id: race.id,
    name: race.data.name,
    location: race.data.location,
    distance_in_km: race.data.distanceInKm,
    elevation_gain_in_meters: race.data.elevationGainInMeters,
    timezone: race.data.timezone,
    website_url: race.data.websiteUrl,
    live_trail_url: race.data.liveTrailUrl,
    pick_count: race.data.pickCount,
    time_tolerance_percent: race.data.timeTolerancePercent,
    status: race.status,
    field_list: race.fieldList.map(
      (field): DeepPartial<RaceFieldEntity> => ({
        id: field.id,
        race_id: race.id,
        gender: field.gender,
        start_at: field.startAt,
        lock_at: field.lockAt,
        locked_at: field.lockedAt,
      }),
    ),
  };
}
