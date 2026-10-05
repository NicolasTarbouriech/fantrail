import { useMemo, useState } from 'react';

import { SearchIcon, cx } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  AdminButton,
  AdminInput,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRunner } from './raceTypes';

const VISIBLE_ROWS = 100;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

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
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const matching = useMemo(() => {
    const query = normalize(search.trim());
    return [...runners]
      .filter((runner) => !query || normalize(runner.fullName).includes(query))
      .sort(compareRunners);
  }, [runners, search]);
  const visible = showAll ? matching : matching.slice(0, VISIBLE_ROWS);

  if (runners.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        Aucun coureur. Importe un CSV ou ajoute-les un par un.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <label className="relative max-w-sm">
        <SearchIcon
          size={16}
          className="absolute top-2.5 left-3 text-zinc-400"
        />
        <AdminInput
          aria-label="Rechercher un coureur"
          placeholder="Rechercher un coureur"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </label>
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
          {visible.map((runner) => (
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
      {matching.length > visible.length ? (
        <AdminButton
          variant="outline"
          className="self-center"
          onClick={() => setShowAll(true)}
        >
          Afficher les {matching.length - visible.length} autres coureurs
        </AdminButton>
      ) : null}
    </div>
  );
}
