import { PickCount, RaceData, RunnerData } from '@trail/modules/race/domain';

import { RaceInput } from './RaceInput';
import { RunnerInput } from './RunnerInput';

export function mapRaceData(input: RaceInput): RaceData {
  return {
    name: input.name,
    startDate: input.startDate,
    location: input.location,
    distanceInKm: input.distanceInKm,
    elevationGainInMeters: input.elevationGainInMeters,
    timezone: input.timezone,
    websiteUrl: input.websiteUrl ?? null,
    liveTrailUrl: input.liveTrailUrl ?? null,
    pickCount: PickCount.parse(input.pickCount),
    timeTolerancePercent: input.timeTolerancePercent,
  };
}

export function mapRunnerData(input: RunnerInput): RunnerData {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    nationality: input.nationality ?? null,
    index: input.index ?? null,
    indexSource: input.indexSource ?? null,
    utmbUrl: input.utmbUrl ?? null,
    itraUrl: input.itraUrl ?? null,
  };
}
