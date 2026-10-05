import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ScorePickRow } from './ScorePickRow';
import { ScoreTiles } from './ScoreTiles';
import { ToleranceGauge } from './ToleranceGauge';

describe('scoring ui', () => {
  it('renders the pick rows, tiles and gauge', () => {
    render(
      <>
        <ul>
          <ScorePickRow
            position={1}
            runnerName="Léo Martin"
            description="Arrivé 1ᵉʳ"
            points={500}
            isExact
            isWithdrawn={false}
          />
          <ScorePickRow
            position={2}
            runnerName="Maël Grondin"
            description="Retiré"
            points={0}
            isExact={false}
            isWithdrawn
          />
        </ul>
        <ScoreTiles tiles={[{ label: 'Positions', points: 2098 }]} />
        <ToleranceGauge usage={0.31} label="Tolérance utilisée" />
      </>,
    );
    expect(screen.getByText('Exact')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '31');
  });
});
