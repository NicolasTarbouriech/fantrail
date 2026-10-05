import { Navigate, useParams } from 'react-router-dom';

import {
  ScorePickRow,
  ScoreTiles,
  ToleranceGauge,
  countExactPicks,
  describePickScore,
  findGenderBySlug,
  formatDuration,
  formatPoints,
  formatWinnerTime,
  getBonusLabel,
  getFieldLabel,
  getToleranceUsage,
  isExactPick,
} from '@trail/modules-frontend';
import {
  Callout,
  Card,
  Heading,
  Hero,
  Spinner,
  Sticker,
  Tag,
} from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import {
  useScorecardPageGetScorecardQuery,
  useScorecardPageQuery,
} from '../../services/graphql';

export function ScorecardPage() {
  const { raceId = '', fieldSlug } = useParams();
  const { data: raceData, loading } = useScorecardPageQuery({
    variables: { raceId },
  });
  const gender = findGenderBySlug(fieldSlug);
  const field = raceData?.race.fields.find(
    (candidate) => candidate.gender === gender,
  );
  const { data, loading: scoreLoading } = useScorecardPageGetScorecardQuery({
    variables: { fieldId: field?.id ?? '' },
    skip: !field,
  });

  if ((loading && !raceData) || (scoreLoading && !data)) {
    return <Spinner />;
  }
  if (!raceData || !field) {
    return <Navigate to={paths.scores} replace />;
  }

  const race = raceData.race;
  const scorecard = data?.myScorecard ?? null;
  const runnerById = new Map(
    field.startList.runners.map((runner) => [runner.id, runner]),
  );
  const back = <BackLink to={paths.scores} label="Retour à mes scores" />;

  if (!scorecard) {
    return (
      <DetailPage
        hero={
          <Hero
            leading={back}
            title="Ta scorecard"
            subtitle={`${race.name} · ${getFieldLabel(field.gender).toLowerCase()}`}
          />
        }
      >
        <Callout>
          Pas de scorecard pour ce champ : le résultat n’est pas encore publié,
          ou ton prono n’était pas complet au départ.
        </Callout>
      </DetailPage>
    );
  }

  const positionPoints = scorecard.picks.reduce(
    (sum, pick) => sum + pick.points,
    0,
  );
  const bonusPoints = scorecard.bonuses.reduce(
    (sum, bonus) => sum + bonus.points,
    0,
  );
  const exactCount = countExactPicks(scorecard.picks);
  const usage = getToleranceUsage(
    scorecard.time.gapInSeconds,
    scorecard.time.actualInSeconds,
    race.timeTolerancePercent,
  );
  const tolerance =
    (scorecard.time.actualInSeconds * race.timeTolerancePercent) / 100;

  return (
    <DetailPage
      hero={
        <Hero
          leading={back}
          trailing={
            <Sticker>Résultat officiel · v{scorecard.resultVersion}</Sticker>
          }
          title="Ta scorecard"
          subtitle={`${race.name} · ${getFieldLabel(field.gender).toLowerCase()}`}
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display text-highlight text-[64px] leading-none font-black">
              {formatPoints(scorecard.total)}
            </span>
            <span className="font-display text-2xl font-black">PTS</span>
          </div>
        </Hero>
      }
    >
      <div className="grid gap-3.5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-3.5 md:gap-5">
          <ScoreTiles
            tiles={[
              { label: 'Positions', points: positionPoints },
              { label: 'Chrono', points: scorecard.time.points },
              { label: 'Bonus', points: bonusPoints },
            ]}
          />
          <Heading className="text-[26px]">
            Tes {scorecard.picks.length} picks
          </Heading>
          <ol className="m-0 flex list-none flex-col gap-[9px] p-0">
            {[...scorecard.picks]
              .sort((a, b) => a.pickPosition - b.pickPosition)
              .map((pick) => {
                const runner = runnerById.get(pick.runnerId);
                const isWithdrawn = runner?.isWithdrawn ?? false;
                return (
                  <ScorePickRow
                    key={pick.pickPosition}
                    position={pick.pickPosition}
                    runnerName={runner?.fullName ?? 'Coureur'}
                    description={describePickScore(pick, isWithdrawn)}
                    points={pick.points}
                    isExact={!isWithdrawn && isExactPick(pick)}
                    isWithdrawn={isWithdrawn}
                  />
                );
              })}
          </ol>
        </div>
        <div className="flex flex-col gap-3.5 md:gap-5 lg:sticky lg:top-24">
          <Card variant="block" className="flex flex-col gap-2.5 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <Heading className="text-xl">Chrono du vainqueur</Heading>
                <span className="text-muted text-[13px]">
                  Toi {formatWinnerTime(scorecard.time.estimateInSeconds)} ·
                  réel {formatWinnerTime(scorecard.time.actualInSeconds)}
                </span>
              </div>
              <span className="font-display text-primary text-[28px] font-black">
                +{formatPoints(scorecard.time.points)}
              </span>
            </div>
            <ToleranceGauge
              usage={usage}
              label="Part de la tolérance utilisée"
            />
            <div className="text-muted flex justify-between text-xs font-semibold">
              <span>Écart {formatDuration(scorecard.time.gapInSeconds)}</span>
              <span>
                Tolérance {formatDuration(tolerance)} (
                {race.timeTolerancePercent} %)
              </span>
            </div>
            <span className="text-[13px] leading-snug">
              {usage >= 1
                ? 'Ton écart dépasse la tolérance : le chrono ne rapporte rien cette fois.'
                : `Ton écart consomme ${Math.round(usage * 100)} % de la tolérance : tu gardes ${100 - Math.round(usage * 100)} % des 200 points, soit ${scorecard.time.points}.`}
            </span>
          </Card>
          <section className="flex flex-col gap-2">
            <Heading className="text-xl">Bonus</Heading>
            {scorecard.bonuses.length === 0 ? (
              <span className="text-muted text-sm">
                Pas de bonus sur ce champ.
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {scorecard.bonuses.map((bonus) => (
                  <Tag key={bonus.type} tone="highlight" className="text-sm">
                    {getBonusLabel(bonus.type, exactCount)} +{bonus.points}
                  </Tag>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DetailPage>
  );
}
