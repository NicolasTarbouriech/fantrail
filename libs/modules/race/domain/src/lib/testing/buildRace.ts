import { RaceAggregate, StartListAggregate } from '../aggregates';
import { Gender, IndexSource, RaceStatus } from '../enums';
import { FieldData, RaceData, RunnerData } from '../types';
import { RaceField, Runner } from '../valueObjects';

export const RACE_ID = '11111111-1111-4111-8111-111111111111';
export const MEN_FIELD_ID = '22222222-2222-4222-8222-222222222222';
export const WOMEN_FIELD_ID = '33333333-3333-4333-8333-333333333333';

export const buildRunnerId = (n: number): string =>
  `44444444-4444-4444-8444-${String(n).padStart(12, '0')}`;

export function buildRaceData(overrides: Partial<RaceData> = {}): RaceData {
  return {
    name: 'Diagonale des Fous 2026',
    location: 'Saint-Pierre, La Réunion',
    distanceInKm: 175,
    elevationGainInMeters: 10150,
    timezone: 'Indian/Reunion',
    websiteUrl: 'https://www.grandraid-reunion.com',
    liveTrailUrl: null,
    pickCount: 5,
    timeTolerancePercent: 3,
    ...overrides,
  };
}

export function buildFieldData(overrides: Partial<FieldData> = {}): FieldData {
  return {
    gender: Gender.Men,
    startAt: new Date('2026-10-15T18:00:00Z'),
    lockAt: new Date('2026-10-15T18:00:00Z'),
    ...overrides,
  };
}

export function buildRunnerData(
  overrides: Partial<RunnerData> = {},
): RunnerData {
  return {
    firstName: 'Ludovic',
    lastName: 'Pommeret',
    nationality: 'FRA',
    index: 900,
    indexSource: IndexSource.Utmb,
    utmbUrl: null,
    itraUrl: null,
    ...overrides,
  };
}

export function buildRunner(
  n: number,
  overrides: Partial<RunnerData> = {},
  withdrawnAt: Date | null = null,
): Runner {
  return Runner.create(
    buildRunnerId(n),
    buildRunnerData({ lastName: `Runner ${n}`, index: 900 - n, ...overrides }),
    withdrawnAt,
  );
}

export function buildField({
  id = MEN_FIELD_ID,
  data = {},
  lockedAt = null,
}: {
  id?: string;
  data?: Partial<FieldData>;
  lockedAt?: Date | null;
} = {}): RaceField {
  return RaceField.create(id, buildFieldData(data), lockedAt);
}

export function buildStartList({
  fieldId = MEN_FIELD_ID,
  runnerCount = 10,
}: { fieldId?: string; runnerCount?: number } = {}): StartListAggregate {
  return new StartListAggregate(
    fieldId,
    Array.from({ length: runnerCount }, (_, index) => buildRunner(index + 1)),
  );
}

export function buildRaceAggregate({
  id = RACE_ID,
  data = {},
  status = RaceStatus.Draft,
  fieldList = [
    buildField(),
    buildField({ id: WOMEN_FIELD_ID, data: { gender: Gender.Women } }),
  ],
}: {
  id?: string;
  data?: Partial<RaceData>;
  status?: RaceStatus;
  fieldList?: RaceField[];
} = {}): RaceAggregate {
  return new RaceAggregate(id, buildRaceData(data), status, fieldList);
}
