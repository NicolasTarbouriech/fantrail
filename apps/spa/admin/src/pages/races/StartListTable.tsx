import { cx } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  AdminButton,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRunner } from './raceTypes';

const SOURCE_LABELS: Record<string, string> = {
  Utmb: 'UTMB',
  Itra: 'ITRA',
  Betrail: 'Betrail',
  Manual: 'Manuel',
};

export type StartListTableProps = {
  runners: AdminRunner[];
  canEdit: boolean;
  onEdit: (runner: AdminRunner) => void;
  onReinstate: (runner: AdminRunner) => void;
};

function compareRunners(a: AdminRunner, b: AdminRunner): number {
  if (a.isWithdrawn !== b.isWithdrawn) {
    return a.isWithdrawn ? 1 : -1;
  }
  return (
    (a.favoriteRank ?? Number.MAX_SAFE_INTEGER) -
      (b.favoriteRank ?? Number.MAX_SAFE_INTEGER) ||
    a.lastName.localeCompare(b.lastName, 'fr')
  );
}

export function StartListTable({
  runners,
  canEdit,
  onEdit,
  onReinstate,
}: StartListTableProps) {
  if (runners.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        Aucun coureur. Importe un CSV ou ajoute-les un par un.
      </div>
    );
  }
  return (
    <AdminTable>
      <thead>
        <tr>
          <AdminTh>Fav.</AdminTh>
          <AdminTh>Coureur</AdminTh>
          <AdminTh>Nat.</AdminTh>
          <AdminTh className="text-right">Index</AdminTh>
          <AdminTh>Source</AdminTh>
          <AdminTh>Liens</AdminTh>
          <AdminTh>Statut</AdminTh>
          <AdminTh>
            <span className="sr-only">Actions</span>
          </AdminTh>
        </tr>
      </thead>
      <tbody>
        {[...runners].sort(compareRunners).map((runner) => (
          <tr
            key={runner.id}
            className={cx(runner.isWithdrawn && 'text-zinc-500')}
          >
            <AdminTd className="font-bold tabular-nums">
              {runner.favoriteRank ?? '—'}
            </AdminTd>
            <AdminTd
              className={cx(
                'font-semibold whitespace-nowrap',
                runner.isWithdrawn && 'text-zinc-500 line-through',
              )}
            >
              {runner.fullName}
            </AdminTd>
            <AdminTd>{runner.nationality ?? '—'}</AdminTd>
            <AdminTd className="text-right tabular-nums">
              {runner.index ?? '—'}
            </AdminTd>
            <AdminTd>
              {runner.indexSource ? SOURCE_LABELS[runner.indexSource] : '—'}
            </AdminTd>
            <AdminTd>
              <span className="flex gap-2.5 text-[13px]">
                {runner.utmbUrl ? (
                  <a
                    href={runner.utmbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    UTMB
                  </a>
                ) : null}
                {runner.itraUrl ? (
                  <a
                    href={runner.itraUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                  >
                    ITRA
                  </a>
                ) : null}
                {!runner.utmbUrl && !runner.itraUrl ? '—' : null}
              </span>
            </AdminTd>
            <AdminTd>
              {runner.isWithdrawn ? (
                <AdminBadge tone="danger">Retiré</AdminBadge>
              ) : runner.index === null ? (
                <AdminBadge tone="outline">Sans index</AdminBadge>
              ) : null}
            </AdminTd>
            <AdminTd className="text-right">
              {canEdit ? (
                runner.isWithdrawn ? (
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => onReinstate(runner)}
                  >
                    Réintégrer
                  </AdminButton>
                ) : (
                  <AdminButton
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(runner)}
                  >
                    Modifier
                  </AdminButton>
                )
              ) : null}
            </AdminTd>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  );
}
