import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { RaceChoiceList, toggleRace } from './RaceChoiceList';

describe('RaceChoiceList', () => {
  it('ticks the selected races and toggles one', () => {
    const onToggle = jest.fn();
    render(
      <RaceChoiceList
        name="races"
        races={[
          { id: 'a', name: 'Diagonale des Fous', details: 'jeu. 15 oct.' },
          { id: 'b', name: 'Templiers', details: 'dim. 18 oct.' },
        ]}
        selectedIds={['a']}
        onToggle={onToggle}
      />,
    );
    expect(screen.getByRole('checkbox', { name: /Diagonale/ })).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: /Templiers/ }),
    ).not.toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: /Templiers/ }));
    expect(onToggle).toHaveBeenCalledWith('b');
  });
});

describe('toggleRace', () => {
  it('adds or removes a race', () => {
    expect(toggleRace(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleRace(['a', 'b'], 'a')).toEqual(['b']);
  });
});
