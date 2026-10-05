import {
  clearPick,
  countPicks,
  createPickList,
  formatDuration,
  formatFavoriteRank,
  formatMultiplier,
  formatWinnerTime,
  getMissingPickHint,
  getMultiplier,
  getPredictionStatusTag,
  isOutsider,
  isSamePickList,
  movePick,
  parseWinnerTime,
  setPick,
} from './index';

describe('multiplier', () => {
  it.each([
    [null, 1],
    [1, 1],
    [2, 1.1],
    [7, 1.6],
    [11, 2],
    [25, 2],
  ])('gives rank %s a multiplier of %s', (rank, expected) => {
    expect(getMultiplier(rank)).toBe(expected);
  });

  it('formats the multiplier and the favorite rank', () => {
    expect(formatMultiplier(1.6)).toBe('×1.6');
    expect(formatMultiplier(2)).toBe('×2.0');
    expect(isOutsider(6)).toBe(true);
    expect(isOutsider(5)).toBe(false);
    expect(isOutsider(null)).toBe(false);
    expect(formatFavoriteRank(2)).toBe('Favori n°2');
    expect(formatFavoriteRank(7)).toBe('Favori n°7 · outsider');
    expect(formatFavoriteRank(null)).toBe('Sans index');
  });
});

describe('winnerTime', () => {
  it.each([
    ['23:45', 85_500],
    ['7h05', 25_500],
    [' 24 : 00 ', 86_400],
    ['23:61', null],
    ['00:00', null],
    ['abc', null],
  ])('parses %s', (value, expected) => {
    expect(parseWinnerTime(value)).toBe(expected);
  });

  it('formats a time and a duration', () => {
    expect(formatWinnerTime(85_500)).toBe('23:45');
    expect(formatWinnerTime(null)).toBe('');
    expect(formatWinnerTime(undefined)).toBe('');
    expect(formatDuration(780)).toBe('13 min');
    expect(formatDuration(-7200)).toBe('2 h');
    expect(formatDuration(2592)).toBe('43 min');
    expect(formatDuration(4500)).toBe('1 h 15');
  });
});

describe('pickList', () => {
  it('creates a list of the pick count', () => {
    expect(createPickList(3, ['a'])).toEqual(['a', null, null]);
    expect(createPickList(2)).toEqual([null, null]);
  });

  it('sets, swaps, clears and moves picks', () => {
    const list = setPick(createPickList(3), 0, 'a');
    expect(list).toEqual(['a', null, null]);
    expect(setPick(['a', 'b', null], 1, 'a')).toEqual(['b', 'a', null]);
    expect(setPick(['a', null, null], 2, 'a')).toEqual([null, null, 'a']);
    expect(clearPick(['a', 'b', 'c'], 1)).toEqual(['a', null, 'c']);
    expect(movePick(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(movePick(['a'], 3, 0)).toEqual([null, 'a']);
    expect(countPicks(['a', null, 'c'])).toBe(2);
    expect(isSamePickList(['a', null], ['a', null])).toBe(true);
    expect(isSamePickList(['a', null], ['a', 'b'])).toBe(false);
    expect(isSamePickList(['a'], ['a', null])).toBe(false);
  });
});

describe('getPredictionStatusTag', () => {
  const base = {
    isLocked: false,
    pickCount: 5,
    pickList: ['a', 'b', 'c', 'd', 'e'],
    winnerTimeInSeconds: 85_500,
    withdrawnCount: 0,
  };

  it.each([
    [{}, 'Complet', 'primary'],
    [{ withdrawnCount: 1 }, '5/5 · 1 retiré', 'alert'],
    [{ withdrawnCount: 2 }, '5/5 · 2 retirés', 'alert'],
    [{ pickList: null, winnerTimeInSeconds: null }, 'À faire', 'dashed'],
    [{ winnerTimeInSeconds: null }, 'Chrono à saisir', 'outline'],
    [{ pickList: ['a', null, null, null, null] }, '1/5', 'outline'],
    [{ isLocked: true }, 'Verrouillé', 'soft'],
    [{ isLocked: true, pickList: null }, 'Incomplet · 0 pt', 'alert'],
  ])('labels %j', (override, label, tone) => {
    expect(getPredictionStatusTag({ ...base, ...override })).toMatchObject({
      label,
      tone,
    });
  });
});

describe('getMissingPickHint', () => {
  it('tells what is missing', () => {
    expect(getMissingPickHint(5, ['a', 'b', 'c', null, null], 1)).toBe(
      'Encore 2 coureurs et ton prono compte',
    );
    expect(getMissingPickHint(5, ['a', 'b', 'c', 'd', null], 1)).toBe(
      'Encore un coureur et ton prono compte',
    );
    expect(getMissingPickHint(2, ['a', 'b'], null)).toBe(
      'Saisis le chrono du vainqueur et ton prono compte',
    );
    expect(getMissingPickHint(2, ['a', 'b'], 1)).toBeNull();
  });
});
