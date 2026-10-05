import {
  RaceCard,
  type RaceCardProps,
  formatCountdown,
  formatDay,
  formatDayTime,
  formatPoints,
  getFieldLabel,
  getFieldSlug,
  getNextLockAt,
  getPredictionStatusTag,
  getRaceCardKind,
  sortByGender,
} from '@trail/modules-frontend';
import { CheckIcon, LockIcon, Tag } from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import {
  useHomePageGetFieldScoreQuery,
  useHomePageGetRaceScoresQuery,
} from '../../services/graphql';
import {
  type HomeField,
  type HomePrediction,
  type HomeRace,
  getRaceCardSource,
} from './homeRace';

export type RaceCardContainerProps = {
  race: HomeRace;
  predictionByFieldId: Map<string, HomePrediction>;
  tone: 'primary' | 'ink';
  now: Date;
};

function FieldScore({ fieldId }: { fieldId: string }) {
  const { data } = useHomePageGetFieldScoreQuery({ variables: { fieldId } });
  const total = data?.myScorecard?.total;
  return total === undefined ? (
    <Tag tone="soft">Pas de prono</Tag>
  ) : (
    <>
      <span className="font-display text-primary text-[22px] font-black">
        {formatPoints(total)}
      </span>
      <span className="text-muted text-xs">pts</span>
    </>
  );
}

function getFieldTag(
  race: HomeRace,
  field: HomeField,
  prediction: HomePrediction | undefined,
) {
  const tag = getPredictionStatusTag({
    isLocked: field.isLocked,
    pickCount: race.pickCount,
    pickList: prediction?.pickList ?? null,
    winnerTimeInSeconds: prediction?.winnerTimeEstimateInSeconds ?? null,
    withdrawnCount: prediction?.withdrawnRunnerIds.length ?? 0,
  });
  return (
    <Tag tone={tag.tone}>
      {tag.tone === 'primary' ? <CheckIcon size={12} /> : null}
      {tag.label}
    </Tag>
  );
}

export function RaceCardContainer({
  race,
  predictionByFieldId,
  tone,
  now,
}: RaceCardContainerProps) {
  const player = useCurrentPlayer();
  const source = getRaceCardSource(race);
  const kind = getRaceCardKind(source);
  const fields = sortByGender(race.fields);
  const firstStart = fields.map((field) => field.startAt).sort()[0];
  const { data: scoresData } = useHomePageGetRaceScoresQuery({
    variables: { raceId: race.id },
    skip: kind !== 'scored',
  });

  const fieldRows: RaceCardProps['rows'] = fields.map((field) => {
    const slug = getFieldSlug(field.gender);
    const hasResult = Boolean(field.result);
    return {
      id: field.id,
      label: getFieldLabel(field.gender),
      to: hasResult
        ? paths.scorecard(race.id, slug)
        : paths.prediction(race.id, slug),
      trailing: hasResult ? (
        <FieldScore fieldId={field.id} />
      ) : (
        getFieldTag(race, field, predictionByFieldId.get(field.id))
      ),
    };
  });
  const rows: RaceCardProps['rows'] = [
    ...fieldRows,
    {
      id: `${race.id}-leaderboard`,
      label: 'Classement de la course',
      to: paths.raceLeaderboard(race.id),
      trailing: null,
    },
  ];

  if (kind === 'cancelled') {
    return (
      <RaceCard
        tone="cancelled"
        trailEvent={race.trailEvent}
        title={race.name}
        subtitle={[firstStart ? formatDay(firstStart) : null, race.location]
          .filter(Boolean)
          .join(' · ')}
        sticker={{ label: 'Annulée', tone: 'alert' }}
        notice="La course a été annulée. Tes pronos ne rapportent aucun point et ne comptent dans aucun classement."
        rows={[]}
      />
    );
  }

  if (kind === 'scored') {
    const mine = scoresData?.communityLeaderboard.find(
      (entry) => entry.userId === player.id,
    );
    return (
      <RaceCard
        tone={tone}
        trailEvent={race.trailEvent}
        title={race.name}
        subtitle="Résultats publiés"
        sticker={
          mine
            ? { label: `${formatPoints(mine.total)} pts`, tone: 'highlight' }
            : undefined
        }
        rows={rows}
      />
    );
  }

  if (kind === 'locked') {
    return (
      <RaceCard
        tone={tone}
        trailEvent={race.trailEvent}
        title={race.name}
        subtitle={
          firstStart ? `Partie ${formatDayTime(firstStart)}` : 'En course'
        }
        sticker={{
          label: (
            <>
              <LockIcon size={13} />
              En cours
            </>
          ),
          tone: 'ink',
        }}
        rows={rows}
        footer={{ label: 'Voir les pronos de mes ligues', to: paths.leagues }}
      />
    );
  }

  const nextLockAt = getNextLockAt(source);
  return (
    <RaceCard
      tone={tone}
      trailEvent={race.trailEvent}
      title={race.name}
      subtitle={[
        firstStart ? formatDayTime(firstStart) : null,
        `${Math.round(race.distanceInKm)} km`,
      ]
        .filter(Boolean)
        .join(' · ')}
      sticker={
        nextLockAt
          ? { label: formatCountdown(nextLockAt, now), tone: 'highlight' }
          : undefined
      }
      rows={rows}
    />
  );
}
