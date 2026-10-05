import { isSameNationality, toAlpha3 } from './countries';
import {
  type UtmbCandidate,
  isCompatibleName,
  matchRunner,
  strongestIndex,
} from './matching';

function candidate(overrides: Partial<UtmbCandidate>): UtmbCandidate {
  return {
    id: 1,
    fullname: 'Ludovic POMMERET',
    uri: '7829.ludovic.pommeret',
    index: 925,
    nationality: 'FR',
    sex: 'H',
    ...overrides,
  };
}

describe('countries', () => {
  it('converts alpha-2 codes and compares nationalities', () => {
    expect(toAlpha3('fr')).toBe('FRA');
    expect(toAlpha3('RE')).toBe('REU');
    expect(toAlpha3('XX')).toBeNull();
    expect(toAlpha3(null)).toBeNull();
    expect(isSameNationality('RE', 'FR')).toBe(true);
    expect(isSameNationality('BE', 'FR')).toBe(false);
    expect(isSameNationality(null, 'FR')).toBe(true);
  });
});

describe('matchRunner', () => {
  it('matches the same name and nationality', () => {
    const result = matchRunner(
      { name: 'POMMERET Ludovic', nationality: 'FR' },
      [
        candidate({}),
        candidate({ id: 2, fullname: 'Léa POMMERET', index: 606 }),
      ],
    );
    expect(result).toMatchObject({
      kind: 'match',
      by: 'name',
      candidate: { id: 1 },
    });
  });

  it('takes the strongest homonym only when the gap is clear', () => {
    const strong = candidate({ id: 1, index: 900 });
    expect(
      matchRunner({ name: 'Ludovic Pommeret', nationality: null }, [
        candidate({ id: 2, index: 600 }),
        strong,
      ]),
    ).toMatchObject({ kind: 'match', candidate: { id: 1 } });
    expect(
      matchRunner({ name: 'Ludovic Pommeret', nationality: null }, [
        candidate({ id: 2, index: 880 }),
        strong,
      ]),
    ).toMatchObject({ kind: 'ambiguous' });
  });

  it('accepts a looser name when the known index confirms it', () => {
    const bernades = candidate({
      fullname: 'Marc BERNADES OLLÉ',
      index: 876,
      nationality: 'ES',
    });
    expect(
      matchRunner({ name: 'Marc Bernades', nationality: 'ES', index: 876 }, [
        bernades,
      ]),
    ).toMatchObject({ kind: 'match', by: 'index' });
    const grenfell = candidate({
      fullname: 'Luke GRENFELL-SHAW',
      index: 911,
      nationality: 'GB',
    });
    expect(
      matchRunner(
        { name: 'Luke Grenfell Shaw', nationality: 'FR', index: 911 },
        [grenfell],
      ),
    ).toMatchObject({ kind: 'match', by: 'index' });
  });

  it('sends loose names to review and reports other nationalities', () => {
    const bernades = candidate({
      fullname: 'Marc BERNADES OLLÉ',
      index: 876,
      nationality: 'ES',
    });
    expect(
      matchRunner({ name: 'Bernades Marc', nationality: 'ES' }, [bernades]),
    ).toMatchObject({
      kind: 'partial',
    });
    expect(
      matchRunner({ name: 'Ludovic Pommeret', nationality: 'BE' }, [
        candidate({}),
      ]),
    ).toMatchObject({ kind: 'none', nearCandidates: [{ id: 1 }] });
    expect(
      matchRunner({ name: 'Inconnu Total', nationality: null }, [
        candidate({}),
      ]),
    ).toEqual({
      kind: 'none',
      nearCandidates: [],
    });
  });

  it('compares names and indexes', () => {
    expect(
      isCompatibleName(['marc', 'bernades'], ['marc', 'bernades', 'olle']),
    ).toBe(true);
    expect(isCompatibleName(['marc'], ['marc', 'olle'])).toBe(false);
    expect(
      strongestIndex([candidate({ index: null }), candidate({ index: 700 })]),
    ).toBe(700);
    expect(strongestIndex([])).toBe(0);
  });
});
