import { useState } from 'react';

import {
  MemberPicks,
  createPickList,
  formatWinnerTime,
  getFieldShortLabel,
  isOutsider,
  sortByGender,
} from '@trail/modules-frontend';
import { LockIcon, Spinner, cx } from '@trail/shared/design/ui-react';

import { useLeaguePageGetFieldPredictionsQuery } from '../../services/graphql';
import type { LeagueRace } from './leagueTypes';

export type MemberPicksSectionProps = {
  leagueId: string;
  race: LeagueRace;
  members: Array<{ id: string; pseudo: string }>;
  myUserId: string;
};

export function MemberPicksSection({
  leagueId,
  race,
  members,
  myUserId,
}: MemberPicksSectionProps) {
  const lockedFields = sortByGender(race.fields).filter(
    (field) => field.isLocked,
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const field =
    lockedFields.find((candidate) => candidate.id === selectedFieldId) ??
    lockedFields[0];
  const { data, loading } = useLeaguePageGetFieldPredictionsQuery({
    variables: { leagueId, fieldId: field?.id ?? '', raceId: race.id },
    skip: !field,
  });

  if (!field) {
    return (
      <div className="border-ink flex items-center gap-2.5 rounded-[14px] border-2 bg-white px-3.5 py-3 text-[13px] leading-snug">
        <LockIcon className="text-primary shrink-0" />
        Les pronos des membres s’afficheront au départ de la course.
      </div>
    );
  }

  const runnerById = new Map(
    (
      data?.race.fields.find((candidate) => candidate.id === field.id)
        ?.startList.runners ?? []
    ).map((runner) => [runner.id, runner]),
  );
  const predictions = data?.league.fieldPredictions ?? [];
  const predictedIds = new Set(
    predictions.map((prediction) => prediction.player.id),
  );
  const withoutPrediction = members.filter(
    (member) => !predictedIds.has(member.id),
  );
  const sorted = [...predictions].sort((a, b) =>
    a.player.id === myUserId
      ? -1
      : b.player.id === myUserId
        ? 1
        : a.player.pseudo.localeCompare(b.player.pseudo, 'fr'),
  );

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2.5">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold">
          <LockIcon size={15} className="text-primary" />
          Pronos révélés
        </span>
        {lockedFields.length > 1 ? (
          <div
            role="group"
            aria-label="Champ"
            className="border-ink flex overflow-hidden rounded-full border-2"
          >
            {lockedFields.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={candidate.id === field.id}
                onClick={() => setSelectedFieldId(candidate.id)}
                className={cx(
                  'font-display h-9 cursor-pointer border-0 px-3 text-[15px] font-extrabold tracking-wide uppercase',
                  candidate.id === field.id
                    ? 'bg-ink text-white'
                    : 'text-ink bg-white',
                )}
              >
                {getFieldShortLabel(candidate.gender)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {loading && !data ? <Spinner /> : null}
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {sorted.map((prediction) => (
          <MemberPicks
            key={prediction.id}
            pseudo={prediction.player.pseudo}
            isMe={prediction.player.id === myUserId}
            winnerTime={formatWinnerTime(
              prediction.winnerTimeEstimateInSeconds,
            )}
            picks={createPickList(race.pickCount, prediction.pickList).map(
              (runnerId, index) => {
                const runner = runnerId ? runnerById.get(runnerId) : undefined;
                return {
                  position: index + 1,
                  lastName: runner?.lastName ?? '',
                  isOutsider: isOutsider(runner?.favoriteRank ?? null),
                  isWithdrawn: runner?.isWithdrawn ?? false,
                };
              },
            )}
          />
        ))}
        {data
          ? withoutPrediction.map((member) => (
              <li
                key={member.id}
                className="border-faded flex flex-col rounded-[14px] border-2 border-dashed p-3"
              >
                <span className="text-muted text-base font-bold">
                  {member.pseudo}
                </span>
                <span className="text-muted text-xs">
                  Pas de prono sur ce champ · 0 pt
                </span>
              </li>
            ))
          : null}
      </ul>
      <div className="text-muted flex items-center gap-2 text-xs">
        <span className="border-ink border-t-primary bg-highlight h-3.5 w-[18px] shrink-0 rounded border-2 border-t-4" />
        outsider (favori n°6 et au-delà)
      </div>
    </section>
  );
}
