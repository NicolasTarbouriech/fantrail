import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { Bib } from './Bib';
import { Button, buttonClasses } from './Button';
import { Callout } from './Callout';
import { Card } from './Card';
import { Heading } from './Heading';
import { Hero } from './Hero';
import { IconButton } from './IconButton';
import { PillTabs } from './PillTabs';
import { Sheet } from './Sheet';
import { Spinner } from './Spinner';
import { Sticker } from './Sticker';
import { Tag } from './Tag';
import { TextField } from './TextField';
import { cx } from './cx';
import { CheckIcon, GripIcon } from './icons';

describe('cx', () => {
  it('joins the truthy class names', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('Button', () => {
  it('renders a button with the variant classes', () => {
    render(
      <Button variant="cta" size="lg" block>
        Valider
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Valider' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('bg-highlight');
    expect(button.className).toContain('w-full');
  });

  it('exposes its classes for links', () => {
    expect(buttonClasses()).toContain('border-ink');
  });
});

describe('IconButton', () => {
  it('is labelled', () => {
    render(
      <IconButton label="Retour" tone="highlight">
        <CheckIcon />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Retour' }).className).toContain(
      'bg-highlight',
    );
  });
});

describe('PillTabs', () => {
  it('selects a tab', () => {
    const onSelect = jest.fn();
    render(
      <PillTabs
        label="Champ"
        compact
        tabs={[
          { id: 'men', label: 'Hommes', selected: true, onSelect: jest.fn() },
          { id: 'women', label: 'Femmes', selected: false, onSelect },
        ]}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Hommes' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Femmes' }));
    expect(onSelect).toHaveBeenCalled();
  });
});

describe('TextField', () => {
  it('links its label, hint and error', () => {
    const { rerender } = render(
      <TextField id="pseudo" label="Pseudo" hint="3 à 20 caractères" />,
    );
    expect(screen.getByLabelText('Pseudo')).toHaveAccessibleDescription(
      '3 à 20 caractères',
    );
    rerender(<TextField id="pseudo" label="Pseudo" error="Déjà pris" />);
    expect(screen.getByLabelText('Pseudo')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    rerender(<TextField id="pseudo" label="Pseudo" tone="code" />);
    expect(screen.getByLabelText('Pseudo')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Sheet', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Sheet open={false} title="Choisis" onClose={jest.fn()}>
        contenu
      </Sheet>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('closes from its buttons', () => {
    const onClose = jest.fn();
    render(
      <Sheet open title="Choisis" subtitle="32 coureurs" onClose={onClose}>
        contenu
      </Sheet>,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('32 coureurs');
    screen
      .getAllByRole('button', { name: 'Fermer' })
      .forEach((button) => fireEvent.click(button));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('display components', () => {
  it('render their content', () => {
    render(
      <>
        <Bib tone="gold">1</Bib>
        <Callout>Info</Callout>
        <Callout tone="warning">Attention</Callout>
        <Card variant="alert">Carte</Card>
        <Heading level={1}>Titre</Heading>
        <Heading>Sous-titre</Heading>
        <Hero
          tone="ink"
          title="Diagonale"
          subtitle="175 km"
          trailing={<Sticker tone="ink">En cours</Sticker>}
        >
          <Tag tone="alert">Retiré</Tag>
        </Hero>
        <Hero title="Ligue" />
        <Sticker tilt="right">3 J</Sticker>
        <Spinner />
        <GripIcon size={18} />
      </>,
    );
    expect(screen.getByRole('heading', { name: 'Titre' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Attention');
    expect(screen.getByRole('status')).toHaveTextContent('Chargement');
    expect(screen.getByText('En cours')).toBeInTheDocument();
  });
});
