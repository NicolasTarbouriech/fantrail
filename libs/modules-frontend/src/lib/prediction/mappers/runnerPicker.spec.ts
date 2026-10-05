import { selectPickerRunners } from './runnerPicker';

const runner = (
  lastName: string,
  favoriteRank: number | null,
  isWithdrawn = false,
) => ({
  fullName: `Léo ${lastName}`,
  lastName,
  favoriteRank,
  isWithdrawn,
});

describe('selectPickerRunners', () => {
  const runners = [
    runner('Zola', 3),
    runner('Martin', 1),
    runner('Écuyer', null),
    runner('Retiré', 2, true),
    runner('Blanc', 4),
  ];

  it('keeps the best indexes of the field without a search', () => {
    expect(
      selectPickerRunners(runners, { query: '', order: 'index', limit: 2 }),
    ).toEqual({ runners: [runners[1], runners[0]], hiddenCount: 2 });
    expect(
      selectPickerRunners(runners, {
        query: '',
        order: 'name',
        limit: 3,
      }).runners.map((item) => item.lastName),
    ).toEqual(['Blanc', 'Martin', 'Zola']);
  });

  it('searches the whole start list, accents ignored', () => {
    expect(
      selectPickerRunners(runners, {
        query: ' ecuy',
        order: 'index',
        limit: 1,
      }),
    ).toEqual({ runners: [runners[2]], hiddenCount: 0 });
    expect(
      selectPickerRunners(runners, { query: 'retir', order: 'name' }).runners,
    ).toEqual([]);
  });

  it('shows 50 runners by default', () => {
    const many = Array.from({ length: 60 }, (_, index) =>
      runner(`R${index}`, index + 1),
    );
    expect(
      selectPickerRunners(many, { query: '', order: 'index' }),
    ).toMatchObject({
      hiddenCount: 10,
    });
  });
});
