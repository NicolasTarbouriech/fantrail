import {
  RACE_STATUS_STEPS,
  getFieldLabel,
  getRaceNextStep,
  getRaceStatusLabel,
  sortByGender,
} from '@trail/modules-frontend';
import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { CheckIcon, cx } from '@trail/shared/design/ui-react';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRace } from './raceTypes';

export type RaceStatusCardProps = {
  race: AdminRace;
  isPending: boolean;
  error: string | null;
  onOpen: () => void;
  onLock: () => void;
  onMarkScored: () => void;
};

export function RaceStatusCard({
  race,
  isPending,
  error,
  onOpen,
  onLock,
  onMarkScored,
}: RaceStatusCardProps) {
  const currentIndex = RACE_STATUS_STEPS.indexOf(race.status);
  const nextStep = getRaceNextStep(race.status);
  const fields = sortByGender(race.fields);
  const readiness = fields.map((field) => {
    const activeCount = field.startList.runners.filter(
      (runner) => !runner.isWithdrawn,
    ).length;
    return {
      id: field.id,
      label: `${getFieldLabel(field.gender)} : ${activeCount} coureurs`,
      isReady: activeCount >= race.pickCount,
    };
  });
  const canOpen = fields.length > 0 && readiness.every((item) => item.isReady);
  const allScored =
    fields.length > 0 && fields.every((field) => Boolean(field.result));

  return (
    <AdminCard>
      <AdminCardHeader title="Statut" />
      {race.status === RaceStatus.Cancelled ? (
        <AdminNotice tone="danger">
          Course annulée : les pronos ne rapportent aucun point et la course est
          hors des classements.
        </AdminNotice>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
          {RACE_STATUS_STEPS.map((status, index) => (
            <li key={status} className="flex items-center gap-2.5">
              {index < currentIndex ? (
                <span className="bg-primary flex size-[22px] items-center justify-center rounded-full text-white">
                  <CheckIcon size={12} />
                </span>
              ) : index === currentIndex ? (
                <span className="border-primary flex size-[22px] items-center justify-center rounded-full border-2">
                  <span className="bg-primary size-2 rounded-full" />
                </span>
              ) : (
                <span className="size-[22px] rounded-full border-2 border-zinc-200" />
              )}
              <span
                className={cx(
                  index === currentIndex ? 'font-semibold' : 'font-normal',
                  index > currentIndex && 'text-zinc-500',
                )}
              >
                {getRaceStatusLabel(status)}
              </span>
            </li>
          ))}
        </ol>
      )}
      {nextStep === 'open' ? (
        <>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[13px]">
            {fields.length === 0 ? (
              <li className="text-red-700">
                Ajoute les champs dans « Champs et start lists ».
              </li>
            ) : null}
            {readiness.map((item) => (
              <li
                key={item.id}
                className={item.isReady ? 'text-zinc-700' : 'text-red-700'}
              >
                {item.isReady ? '✓' : '✗'} {item.label} (minimum{' '}
                {race.pickCount})
              </li>
            ))}
          </ul>
          <p className="m-0 text-[13px] leading-snug text-zinc-600">
            La course apparaît chez les joueurs dès l’ouverture.
          </p>
          <AdminButton
            variant="primary"
            className="justify-center"
            onClick={onOpen}
            disabled={!canOpen || isPending}
          >
            Ouvrir aux pronos
          </AdminButton>
        </>
      ) : null}
      {nextStep === 'lock' ? (
        <>
          <p className="m-0 text-[13px] leading-snug text-zinc-600">
            Chaque champ se verrouille seul à son heure, réglée dans « Champs et
            start lists ». Ce bouton verrouille tous les champs tout de suite.
          </p>
          <AdminButton
            variant="outline"
            className="justify-center"
            onClick={onLock}
            disabled={isPending}
          >
            Verrouiller toute la course
          </AdminButton>
        </>
      ) : null}
      {nextStep === 'markScored' ? (
        <>
          <p className="m-0 text-[13px] leading-snug text-zinc-600">
            {allScored
              ? 'Les résultats de tous les champs sont publiés : tu peux clore la course.'
              : 'Publie d’abord le résultat de chaque champ dans « Résultats ».'}
          </p>
          <AdminButton
            variant="primary"
            className="justify-center"
            onClick={onMarkScored}
            disabled={!allScored || isPending}
          >
            Marquer notée
          </AdminButton>
        </>
      ) : null}
      {race.status === RaceStatus.Scored ? (
        <p className="m-0 text-[13px] leading-snug text-zinc-600">
          Course terminée. Une correction reste possible dans « Résultats » :
          les scores sont recalculés à chaque publication.
        </p>
      ) : null}
      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
    </AdminCard>
  );
}
