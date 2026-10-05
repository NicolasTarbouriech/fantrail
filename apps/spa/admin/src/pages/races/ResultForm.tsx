import { useState } from 'react';

import { formatClockTime, parseClockTime } from '@trail/modules-frontend';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminField,
  AdminInput,
  AdminNotice,
  AdminSelect,
} from '@trail/shared/design/ui-react-admin';

import { ConfirmDialog } from './ConfirmDialog';
import type { AdminField as RaceFieldType } from './raceTypes';

const RANKED_PLACES = 10;

export type ResultFormProps = {
  field: RaceFieldType;
  isPending: boolean;
  error: string | null;
  onPublish: (
    rankingList: string[],
    winnerTimeInSeconds: number,
  ) => Promise<boolean>;
};

export function ResultForm({
  field,
  isPending,
  error,
  onPublish,
}: ResultFormProps) {
  const runners = [...field.startList.runners]
    .filter((runner) => !runner.isWithdrawn)
    .sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
  const runnerById = new Map(
    field.startList.runners.map((runner) => [runner.id, runner]),
  );
  const [ranking, setRanking] = useState<string[]>(() =>
    Array.from(
      { length: RANKED_PLACES },
      (_, index) => field.result?.rankingList[index] ?? '',
    ),
  );
  const [timeInput, setTimeInput] = useState(
    field.result ? formatClockTime(field.result.winnerTimeInSeconds) : '',
  );
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const filled = ranking.filter(Boolean);
  const duplicates = new Set(
    filled.filter((id, index) => filled.indexOf(id) !== index),
  );
  const hasGap =
    ranking.findIndex((id) => !id) !== -1 &&
    ranking.slice(ranking.findIndex((id) => !id)).some(Boolean);
  const winnerTime = parseClockTime(timeInput);
  const version = field.result?.version ?? 0;

  const check = () => {
    if (filled.length === 0) {
      return 'Saisis au moins le vainqueur.';
    }
    if (duplicates.size > 0) {
      return 'Un coureur ne peut apparaître qu’une fois.';
    }
    if (hasGap) {
      return 'Remplis les places dans l’ordre, sans trou.';
    }
    if (winnerTime === null) {
      return 'Temps du vainqueur au format hh:mm:ss.';
    }
    return null;
  };

  const askPublish = () => {
    const problem = check();
    setLocalError(problem);
    if (!problem) {
      setConfirmOpen(true);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <AdminCard className="p-0">
        <div className="px-5 pt-5">
          <AdminCardHeader
            title="Classement officiel"
            description="Saisis le top 10 depuis LiveTrail. Tout coureur hors du top 10 marque 0."
          />
        </div>
        <ol className="m-0 flex list-none flex-col p-0">
          {ranking.map((runnerId, index) => (
            <li
              key={index}
              className="grid grid-cols-[56px_minmax(0,1fr)_96px] items-center gap-2 border-t border-zinc-100 px-5 py-1.5"
            >
              <span className="font-bold tabular-nums">{index + 1}</span>
              <AdminSelect
                aria-label={`Coureur en position ${index + 1}`}
                value={runnerId}
                onChange={(event) =>
                  setRanking((current) =>
                    current.map((id, position) =>
                      position === index ? event.target.value : id,
                    ),
                  )
                }
                className={
                  duplicates.has(runnerId) ? 'border-red-400' : undefined
                }
              >
                <option value="">—</option>
                {runners.map((runner) => (
                  <option key={runner.id} value={runner.id}>
                    {runner.lastName.toUpperCase()} {runner.firstName}
                  </option>
                ))}
              </AdminSelect>
              <span className="text-right text-[13px] text-zinc-500">
                {runnerId && runnerById.get(runnerId)?.favoriteRank
                  ? `favori n°${runnerById.get(runnerId)?.favoriteRank}`
                  : ''}
              </span>
            </li>
          ))}
        </ol>
      </AdminCard>
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <AdminCard>
          <AdminField
            id="winner-time"
            label="Temps du vainqueur"
            hint="Format hh:mm:ss, temps officiel LiveTrail."
          >
            <AdminInput
              id="winner-time"
              inputMode="numeric"
              placeholder="23:32:00"
              value={timeInput}
              onChange={(event) => setTimeInput(event.target.value)}
              className="tabular-nums"
            />
          </AdminField>
        </AdminCard>
        <AdminCard>
          <AdminCardHeader
            title="Publication"
            description={
              field.result?.publishedAt
                ? `Version ${version} en ligne.`
                : 'Aucune version publiée.'
            }
          />
          <AdminNotice>
            Publier recalcule les scores de tous les joueurs. Une correction
            crée une nouvelle version.
          </AdminNotice>
          {localError || error ? (
            <AdminNotice tone="danger">{localError ?? error}</AdminNotice>
          ) : null}
          <AdminButton
            variant="primary"
            className="justify-center"
            onClick={askPublish}
            disabled={isPending || !field.isLocked}
          >
            {version > 0
              ? `Publier la correction (v${version + 1})`
              : 'Publier le résultat'}
          </AdminButton>
          {!field.isLocked ? (
            <p className="m-0 text-[13px] text-zinc-500">
              Le champ doit être verrouillé avant de publier son résultat.
            </p>
          ) : null}
        </AdminCard>
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title={
          version > 0
            ? `Publier la version ${version + 1} ?`
            : 'Publier le résultat ?'
        }
        confirmLabel="Publier"
        isPending={isPending}
        error={error}
        onConfirm={async () => {
          if (winnerTime !== null && (await onPublish(filled, winnerTime))) {
            setConfirmOpen(false);
          }
        }}
        onClose={() => setConfirmOpen(false)}
      >
        Les scores de ce champ sont recalculés pour tous les joueurs et les
        classements des ligues sont mis à jour.
      </ConfirmDialog>
    </div>
  );
}
