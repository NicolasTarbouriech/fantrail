import {
  formatNamePart,
  nameTokens,
  restoreApostrophes,
  sameTokens,
  splitUtmbFullname,
  stripAccents,
} from './text';

describe('text', () => {
  it('normalizes names into tokens', () => {
    expect(stripAccents('Élodie Ollé')).toBe('Elodie Olle');
    expect(nameTokens("Jean-Marc N'Diaye")).toEqual([
      'jean',
      'marc',
      'n',
      'diaye',
    ]);
    expect(sameTokens(['marc', 'olle'], ['olle', 'marc'])).toBe(true);
    expect(sameTokens(['marc'], ['marc', 'olle'])).toBe(false);
    expect(sameTokens(['marc', 'olle'], ['marc', 'olla'])).toBe(false);
  });

  it.each([
    ['PUPPI', 'Puppi'],
    ['JEAN-MARC', 'Jean-Marc'],
    ['VAN DER BERG', 'Van der Berg'],
    ['de la FUENTE', 'De la Fuente'],
    ["D'ARTAGNAN", "D'Artagnan"],
    ["KERANFLEC'H", "Keranflec'h"],
    ['  richauvet  ', 'Richauvet'],
  ])('formats %s', (value, expected) => {
    expect(formatNamePart(value)).toBe(expected);
  });

  it('splits a UTMB full name', () => {
    expect(splitUtmbFullname('Ludovic POMMERET')).toEqual({
      firstName: 'Ludovic',
      lastName: 'Pommeret',
    });
    expect(splitUtmbFullname('Marc BERNADES OLLÉ')).toEqual({
      firstName: 'Marc',
      lastName: 'Bernades Ollé',
    });
    expect(splitUtmbFullname('Jean Baptiste DE LA FUENTE')).toEqual({
      firstName: 'Jean Baptiste',
      lastName: 'De la Fuente',
    });
    expect(splitUtmbFullname('JEAN DUPONT')).toEqual({
      firstName: 'Jean',
      lastName: 'Dupont',
    });
    expect(splitUtmbFullname('jean dupont')).toEqual({
      firstName: 'Jean',
      lastName: 'Dupont',
    });
    expect(splitUtmbFullname('KILIAN')).toEqual({
      firstName: '',
      lastName: 'Kilian',
    });
  });

  it('restores the apostrophes UTMB dropped', () => {
    expect(
      restoreApostrophes('Mélanie KERANFLEC H', 'Keranflec’h Mélanie'),
    ).toBe("Mélanie KERANFLEC'H");
    expect(restoreApostrophes('Moussa N DIAYE', "N'Diaye Moussa")).toBe(
      "Moussa N'DIAYE",
    );
    expect(
      restoreApostrophes("Mélanie KERANFLEC'H", 'Keranflec’h Mélanie'),
    ).toBe("Mélanie KERANFLEC'H");
    expect(restoreApostrophes('Moussa NDIAYE', "N'Diaye Moussa")).toBe(
      'Moussa NDIAYE',
    );
    expect(restoreApostrophes('Ludovic POMMERET', 'Pommeret Ludovic')).toBe(
      'Ludovic POMMERET',
    );
    expect(
      splitUtmbFullname(
        restoreApostrophes('Mélanie KERANFLEC H', 'Keranflec’h Mélanie'),
      ),
    ).toEqual({ firstName: 'Mélanie', lastName: "Keranflec'h" });
  });
});
