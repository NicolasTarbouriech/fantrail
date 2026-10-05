import {
  IndexSource,
  RaceStatus,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';

import {
  formatClockTime,
  fromRaceLocalInput,
  getRaceNextStep,
  getRaceStatusLabel,
  isRaceEditable,
  maskClockTime,
  parseClockTime,
  parseStartListCsv,
  toRaceLocalInput,
} from './index';

describe('raceTime', () => {
  it('converts between the race local time and UTC', () => {
    expect(toRaceLocalInput('2026-10-15T18:00:00.000Z', 'Indian/Reunion')).toBe(
      '2026-10-15T22:00',
    );
    expect(fromRaceLocalInput('2026-10-18T05:15', 'Europe/Paris')).toBe(
      '2026-10-18T03:15:00.000Z',
    );
    expect(fromRaceLocalInput('18/10/2026', 'Europe/Paris')).toBeNull();
  });
});

describe('raceStatus', () => {
  it.each([
    [RaceStatus.Draft, 'Brouillon', 'open', true],
    [RaceStatus.Open, 'Ouverte', 'lock', true],
    [RaceStatus.Locked, 'Verrouillée', 'markScored', false],
    [RaceStatus.Scored, 'Notée', null, false],
    [RaceStatus.Cancelled, 'Annulée', null, false],
  ])('describes %s', (status, label, nextStep, editable) => {
    expect(getRaceStatusLabel(status)).toBe(label);
    expect(getRaceNextStep(status)).toBe(nextStep);
    expect(isRaceEditable(status)).toBe(editable);
  });
});

describe('clockTime', () => {
  it.each([
    ['23:32:00', 84_720],
    ['7:05', 25_500],
    ['00:00:00', null],
    ['23:61:00', null],
    ['23:10:75', null],
    ['vingt', null],
  ])('parses %s', (value, expected) => {
    expect(parseClockTime(value)).toBe(expected);
  });

  it.each([
    ['2', 2, '2'],
    ['234', 2, '2:34'],
    ['23h45', 2, '23:45'],
    ['234567', 2, '234:56'],
    ['2332', 3, '23:32'],
    ['23320', 3, '2:33:20'],
    ['23:32:00', 3, '23:32:00'],
    ['10032001', 3, '100:32:00'],
    ['', 3, ''],
  ] as const)('masks %s in %s parts', (value, partCount, expected) => {
    expect(maskClockTime(value, partCount)).toBe(expected);
  });

  it('formats seconds', () => {
    expect(formatClockTime(84_720)).toBe('23:32:00');
    expect(formatClockTime(25_505)).toBe('07:05:05');
  });
});

describe('parseStartListCsv', () => {
  it('reads, validates and deduplicates the lines', () => {
    const csv = [
      'prenom;nom;nationalite;index;source;utmb;itra',
      'Arthur;Blanc;fra;921;UTMB;https://utmb.world/runner/1;',
      'Hugo;Perrin;FR;842;utmb;;',
      'Jakob;Weber;DEU;8x5;itra;;',
      'Nils;Berg;NOR;902;utmb;;',
      'Yanis;Benali;MAR;;;;',
      'Owen;Price;GBR;890;strava;;',
      ';Sans prénom;;;;;',
      'arthur;BLANC;FRA;921;utmb;;',
      '',
      '"Félix","Garnier","FRA","870","",,',
    ].join('\n');
    const result = parseStartListCsv(csv, [
      { firstName: 'Nils', lastName: 'Berg', nationality: 'NOR', index: 902 },
    ]);
    expect(result.lines.map((line) => line.state)).toEqual([
      'ready',
      'error',
      'error',
      'duplicate',
      'ready',
      'error',
      'error',
      'duplicate',
      'ready',
    ]);
    expect(result.errorCount).toBe(4);
    expect(result.duplicateCount).toBe(2);
    expect(result.readyRunners).toEqual([
      {
        firstName: 'Arthur',
        lastName: 'Blanc',
        nationality: 'FRA',
        index: 921,
        indexSource: IndexSource.Utmb,
        utmbUrl: 'https://utmb.world/runner/1',
        itraUrl: null,
      },
      {
        firstName: 'Yanis',
        lastName: 'Benali',
        nationality: 'MAR',
        index: null,
        indexSource: null,
        utmbUrl: null,
        itraUrl: null,
      },
      {
        firstName: 'Félix',
        lastName: 'Garnier',
        nationality: 'FRA',
        index: 870,
        indexSource: IndexSource.Manual,
        utmbUrl: null,
        itraUrl: null,
      },
    ]);
    expect(result.lines[1]).toMatchObject({
      lineNumber: 3,
      message: 'Nationalité : 3 lettres attendues (FRA)',
    });
  });

  it('keeps namesakes with another nationality or index', () => {
    const result = parseStartListCsv(
      [
        'Simon;Martin;FRA;624;utmb;;',
        'Simon;Martin;FRA;616;utmb;;',
        'Simon;Martin;FRA;624;utmb;;',
      ].join('\n'),
      [],
    );
    expect(result.lines.map((line) => line.state)).toEqual([
      'ready',
      'ready',
      'duplicate',
    ]);
  });

  it('reads a file without header', () => {
    expect(
      parseStartListCsv('Léo,Martin,FRA,912,utmb', []).readyRunners,
    ).toHaveLength(1);
  });
});
