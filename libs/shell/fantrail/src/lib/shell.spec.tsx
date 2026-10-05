import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { BackLink } from './BackLink';
import { DetailPage } from './DetailPage';
import { PlayerFrame } from './PlayerFrame';
import { PlayerLayout, TabPage } from './TabPage';

const paths = {
  home: '/',
  leagues: '/ligues',
  scores: '/scores',
  profile: '/profil',
};

describe('PlayerLayout', () => {
  it('renders the top navigation and marks the current tab', () => {
    render(
      <MemoryRouter initialEntries={['/ligues']}>
        <PlayerFrame>
          <PlayerLayout initial="K" paths={paths}>
            <TabPage initial="K" paths={paths}>
              contenu
            </TabPage>
          </PlayerLayout>
        </PlayerFrame>
      </MemoryRouter>,
    );
    const [siteNav, bottomNav] = screen.getAllByRole('navigation', {
      name: 'Navigation principale',
    });
    expect(
      within(siteNav).getByRole('link', { name: 'Ligues' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      within(bottomNav).getByRole('link', { name: 'Accueil' }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getAllByRole('link', { name: 'Mon profil' })[0],
    ).toHaveTextContent('K');
  });
});

describe('DetailPage', () => {
  it('renders its hero and back link', () => {
    render(
      <MemoryRouter>
        <DetailPage hero={<BackLink to="/" label="Retour" />}>
          contenu
        </DetailPage>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Retour' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('main')).toHaveTextContent('contenu');
  });
});
