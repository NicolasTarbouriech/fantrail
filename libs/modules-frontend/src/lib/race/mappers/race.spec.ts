import {
  Gender,
  RaceStatus,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';

import {
  findGenderBySlug,
  formatCountdown,
  formatDay,
  formatDayTime,
  formatRaceDate,
  formatStartTime,
  getFieldLabel,
  getFieldShortLabel,
  getFieldSlug,
  getNextLockAt,
  getRaceCardKind,
  getRaceShortName,
  sortByGender,
} from './index';

const now = new Date('2026-10-12T06:00:00Z');

describe('formatCountdown', () => {
  it.each([
    ['2026-10-15T20:00:00Z', '3 J 14 H'],
    ['2026-10-18T06:00:00Z', '6 J'],
    ['2026-10-12T11:05:00Z', '5 H 05'],
    ['2026-10-12T06:12:30Z', '12 MIN'],
    ['2026-10-12T06:00:30Z', '< 1 MIN'],
    ['2026-10-11T06:00:00Z', '< 1 MIN'],
  ])('formats the time left before %s', (target, expected) => {
    expect(formatCountdown(target, now)).toBe(expected);
  });
});

describe('formatDate', () => {
  const start = '2026-10-15T18:00:00Z';

  it('formats a day and a time in a timezone', () => {
    expect(formatDay(start, 'Europe/Paris')).toBe('jeu. 15 oct.');
    expect(formatDayTime(start, 'Europe/Paris')).toBe('jeu. 15 oct. · 20:00');
  });

  it('formats a race start date with its year, whatever the timezone', () => {
    expect(formatRaceDate('2026-10-15')).toBe('jeu. 15 oct. 2026');
  });

  it('adds the race local time when it differs', () => {
    expect(formatStartTime(start, 'Indian/Reunion', 'Europe/Paris')).toBe(
      'jeu. 15 oct. 20:00 (22:00 sur place)',
    );
    expect(formatStartTime(start, 'Europe/Paris', 'Europe/Paris')).toBe(
      'jeu. 15 oct. 20:00',
    );
  });
});

describe('fieldLabel', () => {
  it('labels a field and finds it back from its slug', () => {
    expect(getFieldLabel(Gender.Women)).toBe('Élites femmes');
    expect(getFieldShortLabel(Gender.Men)).toBe('Hommes');
    expect(getFieldSlug(Gender.Men)).toBe('hommes');
    expect(findGenderBySlug('femmes')).toBe(Gender.Women);
    expect(findGenderBySlug('scratch')).toBeNull();
    expect(findGenderBySlug(undefined)).toBeNull();
  });

  it('sorts men before women', () => {
    expect(
      sortByGender([{ gender: Gender.Women }, { gender: Gender.Men }]),
    ).toEqual([{ gender: Gender.Men }, { gender: Gender.Women }]);
  });
});

describe('getRaceCardKind', () => {
  const open = {
    isLocked: false,
    lockAt: '2026-10-18T03:15:00Z',
    hasResult: false,
  };
  const locked = {
    isLocked: true,
    lockAt: '2026-10-15T18:00:00Z',
    hasResult: false,
  };
  const scored = {
    isLocked: true,
    lockAt: '2026-10-15T18:00:00Z',
    hasResult: true,
  };

  it.each([
    [RaceStatus.Cancelled, [open], 'cancelled'],
    [RaceStatus.Scored, [locked], 'scored'],
    [RaceStatus.Locked, [scored, scored], 'scored'],
    [RaceStatus.Locked, [locked, scored], 'locked'],
    [RaceStatus.Open, [locked, locked], 'locked'],
    [RaceStatus.Open, [locked, open], 'open'],
    [RaceStatus.Open, [], 'open'],
  ])('maps %s to its card', (status, fields, expected) => {
    expect(getRaceCardKind({ status, fields })).toBe(expected);
  });

  it('returns the next lock of the open fields', () => {
    const later = { ...open, lockAt: '2026-10-19T03:15:00Z' };
    expect(
      getNextLockAt({ status: RaceStatus.Open, fields: [later, locked, open] }),
    ).toBe(open.lockAt);
    expect(
      getNextLockAt({ status: RaceStatus.Locked, fields: [locked] }),
    ).toBeNull();
  });
});

describe('getRaceShortName', () => {
  it.each([
    ['Grand Trail des Templiers 2026', 'Templiers'],
    ['Diagonale des Fous 2026', 'Diagonale'],
    ['Ultra-Trail du Mont-Blanc', 'Mont'],
    ['Le Grand Raid', 'Le'],
    ['2026', '2026'],
  ])('shortens %s', (name, expected) => {
    expect(getRaceShortName(name)).toBe(expected);
  });
});
