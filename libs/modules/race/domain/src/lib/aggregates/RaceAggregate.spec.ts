import { ZodError } from 'zod';

import { Gender, RaceStatus } from '../enums';
import {
  FieldGenderAlreadyExistsError,
  FieldNotEnoughRunnersError,
  FieldNotFoundError,
  FieldNotLockedError,
  PickCountLockedError,
  RaceNotEditableError,
  RaceStatusTransitionError,
  RaceWithoutFieldError,
} from '../errors';
import { RaceDeletedNestEvent, RaceEventName } from '../events';
import {
  MEN_FIELD_ID,
  WOMEN_FIELD_ID,
  buildField,
  buildFieldData,
  buildRaceAggregate,
  buildRaceData,
} from '../testing';

describe('RaceAggregate', () => {
  const beforeLock = new Date('2026-10-14T10:00:00Z');
  const afterLock = new Date('2026-10-15T18:00:00Z');

  describe('assertData', () => {
    it('rejects an unknown timezone', () => {
      expect(() =>
        buildRaceAggregate().update(
          buildRaceData({ timezone: 'Mars/Olympus' }),
        ),
      ).toThrow(ZodError);
    });

    it.each(['2026-02-30', '15/10/2026', '2026-10-15T22:00:00Z'])(
      'rejects the start date %s',
      (startDate) => {
        expect(() =>
          buildRaceAggregate().update(buildRaceData({ startDate })),
        ).toThrow(ZodError);
      },
    );

    it.each([3, 5])('accepts %i picks', (pickCount) => {
      expect(() =>
        buildRaceAggregate().update(
          buildRaceData({ pickCount: pickCount as 3 | 5 }),
        ),
      ).not.toThrow();
    });
  });

  it('exposes its data', () => {
    const race = buildRaceAggregate();
    expect(race).toMatchObject({
      name: 'Diagonale des Fous',
      startDate: '2026-10-15',
      timezone: 'Indian/Reunion',
      pickCount: 5,
      timeTolerancePercent: 3,
      status: RaceStatus.Draft,
    });
    expect(race.data.distanceInKm).toBe(175);
  });

  describe('update', () => {
    it('changes the pick count while draft only', () => {
      const race = buildRaceAggregate({ status: RaceStatus.Open });
      expect(() => race.update(buildRaceData({ pickCount: 3 }))).toThrow(
        PickCountLockedError,
      );
      race.update(buildRaceData({ name: 'Diagonale 2026' }));
      expect(race.name).toBe('Diagonale 2026');
    });

    it('refuses a locked race', () => {
      expect(() =>
        buildRaceAggregate({ status: RaceStatus.Locked }).update(
          buildRaceData(),
        ),
      ).toThrow(RaceNotEditableError);
    });
  });

  describe('open', () => {
    it('opens a draft whose fields have enough runners', () => {
      const race = buildRaceAggregate();
      race.open({ [MEN_FIELD_ID]: 5, [WOMEN_FIELD_ID]: 8 });
      expect(race.status).toBe(RaceStatus.Open);
    });

    it('needs a field', () => {
      expect(() => buildRaceAggregate({ fieldList: [] }).open({})).toThrow(
        RaceWithoutFieldError,
      );
    });

    it('needs as many active runners as picks in every field', () => {
      const race = buildRaceAggregate();
      expect(() =>
        race.open({ [MEN_FIELD_ID]: 4, [WOMEN_FIELD_ID]: 8 }),
      ).toThrow(FieldNotEnoughRunnersError);
      expect(() => race.open({ [MEN_FIELD_ID]: 5 })).toThrow(
        FieldNotEnoughRunnersError,
      );
    });
  });

  describe('predictions', () => {
    it('are open while the race is open and the field unlocked', () => {
      const race = buildRaceAggregate({ status: RaceStatus.Open });
      expect(race.isOpenForPredictions(MEN_FIELD_ID, beforeLock)).toBe(true);
      expect(race.isOpenForPredictions(MEN_FIELD_ID, afterLock)).toBe(false);
      expect(
        buildRaceAggregate().isOpenForPredictions(MEN_FIELD_ID, beforeLock),
      ).toBe(false);
    });
  });

  describe('lock', () => {
    it('locks every field', () => {
      const race = buildRaceAggregate({ status: RaceStatus.Open });
      race.lock(beforeLock);
      expect(race.status).toBe(RaceStatus.Locked);
      expect(
        race.fieldList.every((field) => field.lockedAt === beforeLock),
      ).toBe(true);
    });

    it('locks the race once its last field is locked', () => {
      const race = buildRaceAggregate({ status: RaceStatus.Open });
      race.lockField(MEN_FIELD_ID, beforeLock);
      expect(race.status).toBe(RaceStatus.Open);
      race.lockField(WOMEN_FIELD_ID, beforeLock);
      expect(race.status).toBe(RaceStatus.Locked);
    });

    it('refuses a draft', () => {
      expect(() => buildRaceAggregate().lock(beforeLock)).toThrow(
        RaceStatusTransitionError,
      );
    });
  });

  describe('markScored', () => {
    it('scores a race whose fields are all locked', () => {
      const race = buildRaceAggregate({ status: RaceStatus.Open });
      race.markScored(afterLock);
      expect(race.status).toBe(RaceStatus.Scored);
    });

    it('refuses a race with an unlocked field', () => {
      expect(() =>
        buildRaceAggregate({ status: RaceStatus.Open }).markScored(beforeLock),
      ).toThrow(FieldNotLockedError);
    });
  });

  it('cancels a race that is not scored', () => {
    const race = buildRaceAggregate({ status: RaceStatus.Locked });
    race.cancel();
    expect(race.status).toBe(RaceStatus.Cancelled);
    expect(() =>
      buildRaceAggregate({ status: RaceStatus.Scored }).cancel(),
    ).toThrow(RaceStatusTransitionError);
  });

  it('records the deletion of a race, whatever its status', () => {
    const now = new Date('2026-10-05T20:00:00Z');
    const race = buildRaceAggregate({ status: RaceStatus.Cancelled });
    race.delete(now);
    const [event] = race.getUncommittedEvents();
    expect(event).toBeInstanceOf(RaceDeletedNestEvent);
    expect(event).toMatchObject({
      event: {
        name: RaceEventName.RaceDeleted,
        timestamp: now.getTime(),
        payload: {
          raceId: race.id,
          fieldIdList: [MEN_FIELD_ID, WOMEN_FIELD_ID],
        },
      },
    });
    expect(() =>
      buildRaceAggregate({ status: RaceStatus.Open }).delete(now),
    ).not.toThrow();
  });

  describe('fields', () => {
    it('adds a field per gender', () => {
      const race = buildRaceAggregate({ fieldList: [buildField()] });
      const field = race.addField(buildFieldData({ gender: Gender.Women }));
      expect(race.findField(field.id).gender).toBe(Gender.Women);
      expect(() =>
        race.addField(buildFieldData({ gender: Gender.Men })),
      ).toThrow(FieldGenderAlreadyExistsError);
    });

    it('updates a field without taking the gender of another one', () => {
      const race = buildRaceAggregate();
      const lockAt = new Date('2026-10-15T17:00:00Z');
      race.updateField(MEN_FIELD_ID, buildFieldData({ lockAt }), beforeLock);
      expect(race.findField(MEN_FIELD_ID).lockAt).toEqual(lockAt);
      expect(() =>
        race.updateField(
          MEN_FIELD_ID,
          buildFieldData({ gender: Gender.Women }),
          beforeLock,
        ),
      ).toThrow(FieldGenderAlreadyExistsError);
    });

    it('throws on an unknown field', () => {
      expect(() =>
        buildRaceAggregate().findField('55555555-5555-4555-8555-555555555555'),
      ).toThrow(FieldNotFoundError);
    });
  });
});
