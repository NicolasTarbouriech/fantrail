import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { AdminBadge } from './Badge';
import { AdminButton, adminButtonClasses } from './Button';
import { AdminCard, AdminCardHeader } from './Card';
import { AdminField, AdminInput, AdminSelect, AdminTextarea } from './Field';
import { AdminNotice } from './Notice';
import { AdminDialog } from './Overlay';
import { AdminPageHeader } from './PageHeader';
import { adminSegmentClasses } from './Segmented';
import { AdminTable, AdminTd, AdminTh } from './Table';

describe('AdminButton', () => {
  it('renders a typed button with its variant', () => {
    render(<AdminButton variant="primary">Publier</AdminButton>);
    const button = screen.getByRole('button', { name: 'Publier' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('bg-primary');
    expect(adminButtonClasses('ghost', 'icon')).toContain('size-8');
  });
});

describe('AdminField', () => {
  it('labels its control and shows the hint or the error', () => {
    const { rerender } = render(
      <AdminField id="name" label="Nom" hint="3 à 40 caractères">
        <AdminInput id="name" />
      </AdminField>,
    );
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByText('3 à 40 caractères')).toBeInTheDocument();
    rerender(
      <AdminField id="name" label="Nom" error="Déjà pris">
        <AdminSelect id="name">
          <option>a</option>
        </AdminSelect>
      </AdminField>,
    );
    expect(screen.getByText('Déjà pris')).toBeInTheDocument();
    rerender(
      <AdminField id="name" label="Nom">
        <AdminTextarea id="name" />
      </AdminField>,
    );
    expect(screen.getByLabelText('Nom').tagName).toBe('TEXTAREA');
  });
});

describe('AdminDialog', () => {
  it('renders nothing when closed and closes from its buttons', () => {
    const onClose = jest.fn();
    const { rerender, container } = render(
      <AdminDialog open={false} title="Importer" onClose={onClose}>
        contenu
      </AdminDialog>,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <AdminDialog
        open
        title="Importer"
        description="Élites hommes"
        footer="pied"
        side="right"
        onClose={onClose}
      >
        contenu
      </AdminDialog>,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('Élites hommes');
    screen
      .getAllByRole('button', { name: 'Fermer' })
      .forEach((button) => fireEvent.click(button));
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(
      <AdminDialog open wide title="Importer" onClose={onClose}>
        contenu
      </AdminDialog>,
    );
    expect(screen.getByRole('dialog').className).toContain('sm:max-w-3xl');
  });
});

describe('display components', () => {
  it('render their content', () => {
    render(
      <>
        <AdminPageHeader
          title="Courses"
          badge={<AdminBadge tone="gold">Notée</AdminBadge>}
          description="Toutes"
          actions="+"
        />
        <AdminPageHeader title="Ligues" />
        <AdminCard tone="danger">
          <AdminCardHeader
            title="Supprimer"
            description="Irréversible"
            action="x"
          />
        </AdminCard>
        <AdminCard>
          <AdminCardHeader title="Statut" />
        </AdminCard>
        <AdminNotice>Info</AdminNotice>
        <AdminNotice tone="success">Ok</AdminNotice>
        <AdminNotice tone="danger">Erreur</AdminNotice>
        <AdminTable>
          <tbody>
            <tr>
              <AdminTh>Course</AdminTh>
              <AdminTd>Diagonale</AdminTd>
            </tr>
          </tbody>
        </AdminTable>
      </>,
    );
    expect(
      screen.getByRole('heading', { name: 'Courses' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Erreur');
    expect(screen.getByText('Diagonale')).toBeInTheDocument();
    expect(adminSegmentClasses(true)).toContain('bg-white');
    expect(adminSegmentClasses(false)).toContain('bg-transparent');
  });
});
