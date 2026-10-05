import {
  formatNamePart,
  nameTokens,
  restoreApostrophes,
  sameTokens,
  splitListName,
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
    expect(splitUtmbFullname('Boris HERNANDEZ (Hernandez BORIS)')).toEqual({
      firstName: 'Boris',
      lastName: 'Hernandez',
    });
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

  it('splits a list name on the UTMB profile sharing its words', () => {
    const split = (name: string, utmbFullname: string) =>
      splitListName(name, {
        utmbName: splitUtmbFullname(utmbFullname),
        isKnownFirstName: () => false,
      });
    expect(split('bouaidat cazaux lorenne', 'Lorenne BOUAIDAT')).toEqual({
      firstName: 'Lorenne',
      lastName: 'Bouaidat Cazaux',
    });
    expect(split('Chouchou Adrien Karim', 'Adrien CHOUCHOU')).toEqual({
      firstName: 'Adrien Karim',
      lastName: 'Chouchou',
    });
    expect(split('Florian Francois', 'Florian FRANCOIS')).toEqual({
      firstName: 'Florian',
      lastName: 'Francois',
    });
    expect(split('MARTIN Martin', 'Martin MARTIN')).toEqual({
      firstName: 'Martin',
      lastName: 'Martin',
    });
  });

  it('splits a list name alone on its case, then on known first names', () => {
    const split = (name: string) =>
      splitListName(name, {
        utmbName: null,
        isKnownFirstName: (word) =>
          ['marie', 'isabelle'].includes(word.toLowerCase()),
      });
    expect(split('ALQUIER THIBAULT Aude')).toEqual({
      firstName: 'Aude',
      lastName: 'Alquier Thibault',
    });
    expect(split('Bolon Marie Isabelle')).toEqual({
      firstName: 'Marie Isabelle',
      lastName: 'Bolon',
    });
    expect(split('MARIE ISABELLE')).toEqual({
      firstName: 'Isabelle',
      lastName: 'Marie',
    });
    expect(split('Ben zaki Fabienne')).toEqual({
      firstName: 'Fabienne',
      lastName: 'Ben Zaki',
    });
    expect(split('Solo')).toBeNull();
  });
});
