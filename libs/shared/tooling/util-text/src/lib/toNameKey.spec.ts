import { toNameKey } from './toNameKey';

describe('toNameKey', () => {
  it('ignores case, accents and spacing', () => {
    expect(toNameKey('  Les  Chamois de l’Écrin ')).toBe(
      'les chamois de l’ecrin',
    );
    expect(toNameKey('RÉUNION')).toBe(toNameKey('reunion'));
  });
});
