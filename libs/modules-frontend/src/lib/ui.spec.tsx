import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LeaderboardRow, LeagueRow } from './league';
import { MemberPicks, PickSlot, RunnerOption } from './prediction';
import { RaceCard } from './race';

describe('RaceCard', () => {
  it('lists the fields and the footer link', () => {
    render(
      <MemoryRouter>
        <RaceCard
          tone="primary"
          title="Diagonale des Fous"
          subtitle="jeu. 15 oct."
          sticker={{ label: '3 J', tone: 'highlight' }}
          rows={[
            { id: 'm', label: 'Élites hommes', to: '/m', trailing: 'À faire' },
          ]}
          footer={{ label: 'Voir les pronos', to: '/ligues' }}
        />
        <RaceCard
          tone="cancelled"
          title="Templiers"
          subtitle="dim. 18 oct."
          notice="Course annulée"
          rows={[]}
        />
        <RaceCard tone="ink" title="Test" subtitle="—" rows={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Élites hommes/ })).toHaveAttribute(
      'href',
      '/m',
    );
    expect(
      screen.getByRole('link', { name: 'Voir les pronos' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Course annulée')).toBeInTheDocument();
  });
});

describe('PickSlot', () => {
  const runner = {
    fullName: 'Kenji Sato',
    favoriteRank: 7,
    isWithdrawn: false,
  };

  it('chooses a runner from every open state', () => {
    const onChoose = jest.fn();
    const { rerender } = render(
      <PickSlot position={1} runner={null} onChoose={onChoose} />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Choisis ton 1ᵉʳ coureur/ }),
    );
    rerender(
      <PickSlot
        position={2}
        runner={runner}
        onChoose={onChoose}
        dragHandle="⠿"
      />,
    );
    expect(screen.getByText('×1.6')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Kenji Sato/ }));
    rerender(
      <PickSlot
        position={2}
        runner={{ ...runner, isWithdrawn: true }}
        onChoose={onChoose}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Changer' }));
    expect(onChoose).toHaveBeenCalledTimes(3);
  });

  it('highlights the active place', () => {
    const { rerender } = render(
      <PickSlot position={1} runner={null} isActive onChoose={jest.fn()} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    rerender(<PickSlot position={1} runner={runner} isActive />);
    expect(screen.getByText('Kenji Sato').closest('div')).toHaveClass(
      'outline-primary',
    );
    rerender(
      <PickSlot
        position={1}
        runner={{ ...runner, isWithdrawn: true }}
        isActive
      />,
    );
    expect(
      screen.getByText('Kenji Sato').closest('div.border-alert'),
    ).toHaveClass('outline-primary');
  });

  it('is read-only once locked', () => {
    const { rerender } = render(
      <PickSlot position={3} runner={null} isLocked />,
    );
    expect(screen.getByText('Place vide')).toBeInTheDocument();
    rerender(
      <PickSlot
        position={3}
        runner={{ ...runner, isWithdrawn: true }}
        isLocked
      />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<PickSlot position={3} runner={runner} isLocked />);
    expect(screen.getByRole('button', { name: /Kenji Sato/ })).toBeDisabled();
  });
});

describe('RunnerOption', () => {
  it('shows the multiplier or where the runner is picked', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <RunnerOption
        fullName="Léo Martin"
        favoriteRank={1}
        details="FRA · index 912"
        pickedLabel={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText('×1.0')).toBeInTheDocument();
    rerender(
      <RunnerOption
        fullName="Léo Martin"
        favoriteRank={null}
        details="FRA"
        pickedLabel="Déjà 1ᵉʳ"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('Déjà 1ᵉʳ')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

describe('MemberPicks', () => {
  it('lists the member picks', () => {
    render(
      <ul>
        <MemberPicks
          pseudo="Juju"
          isMe
          winnerTime=""
          picks={[
            {
              position: 1,
              lastName: 'Martin',
              isOutsider: false,
              isWithdrawn: false,
            },
            {
              position: 2,
              lastName: 'Sato',
              isOutsider: true,
              isWithdrawn: false,
            },
            { position: 3, lastName: '', isOutsider: false, isWithdrawn: true },
          ]}
        />
      </ul>,
    );
    expect(screen.getByText('Juju · toi')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});

describe('league rows', () => {
  it('renders the leaderboard and league rows', () => {
    render(
      <MemoryRouter>
        <ol>
          <LeaderboardRow
            rank={1}
            pseudo="Juju"
            total={3105}
            isMe={false}
            hasScored
          />
          <LeaderboardRow
            rank={2}
            pseudo="Kilian"
            total={2412}
            isMe
            hasScored
            to="/scores"
            caption="Voir ta scorecard"
          />
          <LeaderboardRow
            rank={3}
            pseudo="Bob"
            total={0}
            isMe={false}
            hasScored={false}
          />
        </ol>
        <LeagueRow
          name="Les Chamois"
          badge="PRIVÉE"
          badgeTone="outline"
          details="6 joueurs"
          standing={{ rank: 2, playerCount: 6 }}
          to="/ligues/1"
        />
        <LeagueRow
          name="Communauté"
          badge="TOUS"
          badgeTone="ink"
          details="tous les joueurs"
          standing={null}
          to="/ligues/communaute"
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Kilian · toi/ })).toHaveAttribute(
      'href',
      '/scores',
    );
    expect(screen.getByText('2ᵉ')).toBeInTheDocument();
  });
});
