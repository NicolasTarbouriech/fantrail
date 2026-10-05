import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { WithdrawnAlert } from './WithdrawnAlert';

describe('WithdrawnAlert', () => {
  const item = {
    id: '1',
    runnerName: 'Maël Grondin',
    context: 'Diagonale',
    to: '/p',
  };

  it('renders nothing without withdrawn runner', () => {
    const { container } = render(<WithdrawnAlert items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('links each withdrawn runner to its prediction', () => {
    const { rerender } = render(
      <MemoryRouter>
        <WithdrawnAlert items={[item]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('1 coureur retiré : ce pick vaut 0 point'),
    ).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <WithdrawnAlert items={[item, { ...item, id: '2' }]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('2 coureurs retirés : ces picks valent 0 point'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/p');
  });
});
