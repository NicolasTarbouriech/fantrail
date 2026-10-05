import { Link } from 'react-router-dom';

import {
  LeagueRow,
  WithdrawnAlert,
  type WithdrawnAlertItem,
  findMyStanding,
  formatPlayerCount,
  getFieldLabel,
  getFieldSlug,
  getInitial,
  getRaceCardKind,
} from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  Callout,
  Card,
  Heading,
  Spinner,
  buttonClasses,
} from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { paths, tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useNow } from '../../hooks/useNow';
import { type HomePageQuery, useHomePageQuery } from '../../services/graphql';
import { RaceGroupList } from './RaceGroupList';
import {
  type HomePrediction,
  type HomeRace,
  getPredictionByFieldId,
  getRaceCardSource,
  selectMyRaces,
} from './homeRace';

function getWithdrawnItems(
  races: HomeRace[],
  predictionByFieldId: Map<string, HomePrediction>,
): WithdrawnAlertItem[] {
  return races.flatMap((race) =>
    race.fields
      .filter((field) => !field.isLocked)
      .flatMap((field) => {
        const prediction = predictionByFieldId.get(field.id);
        const runnerById = new Map(
          field.startList.withdrawnRunners.map((runner) => [runner.id, runner]),
        );
        return (prediction?.withdrawnRunnerIds ?? []).map((runnerId) => ({
          id: `${field.id}-${runnerId}`,
          runnerName: runnerById.get(runnerId)?.fullName ?? 'Coureur retiré',
          context: `${race.name} · ${getFieldLabel(field.gender).toLowerCase()}`,
          to: paths.prediction(race.id, getFieldSlug(field.gender)),
        }));
      }),
  );
}

export function HomePage() {
  const player = useCurrentPlayer();
  const now = useNow();
  const { data, loading, error } = useHomePageQuery();

  const predictionByFieldId = getPredictionByFieldId(data?.myPredictions ?? []);
  const races = selectMyRaces(data?.races ?? [], predictionByFieldId);
  const openCount = races.filter(
    (race) => getRaceCardKind(getRaceCardSource(race)) === 'open',
  ).length;

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <div className="flex flex-col gap-0.5">
        <Heading level={1}>Salut {player.pseudo}</Heading>
        <span className="text-muted text-[15px]">
          {races.length === 0
            ? 'Tes courses apparaissent ici dès ton premier prono'
            : openCount > 1
              ? `${openCount} de tes courses ouvertes aux pronos`
              : openCount === 1
                ? '1 de tes courses ouverte aux pronos'
                : 'Tes courses'}
        </span>
      </div>
      <div className="grid gap-[18px] lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-col gap-[18px]">
          {loading && !data ? <Spinner /> : null}
          {error && !data ? (
            <Callout tone="warning">
              Impossible de charger les courses. Réessaie dans un instant.
            </Callout>
          ) : null}
          <WithdrawnAlert
            items={getWithdrawnItems(races, predictionByFieldId)}
          />
          {data && races.length === 0 ? (
            <Card
              variant="dashed"
              className="flex flex-col items-start gap-3 p-4"
            >
              <span className="text-[15px] leading-snug">
                Choisis tes courses dans la liste : fais ton prono et la course
                rejoint ton accueil, avec son classement.
              </span>
              <Link
                to={paths.races}
                className={buttonClasses({ variant: 'cta', size: 'md' })}
              >
                Voir les courses
              </Link>
            </Card>
          ) : null}
          <RaceGroupList
            races={races}
            predictionByFieldId={predictionByFieldId}
            now={now}
            gridClassName="md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
          />
        </div>
        {data ? <HomeLeagues data={data} /> : null}
      </div>
    </TabPage>
  );
}

function HomeLeagues({ data }: { data: HomePageQuery }) {
  const player = useCurrentPlayer();
  return (
    <section className="flex flex-col gap-2.5 lg:sticky lg:top-24">
      <Heading>Mes ligues</Heading>
      {data.myLeagues.map((league) => (
        <LeagueRow
          key={league.id}
          name={league.name}
          badge={
            league.visibility === LeagueVisibility.Private
              ? 'PRIVÉE'
              : 'PUBLIQUE'
          }
          badgeTone="outline"
          details={formatPlayerCount(league.memberCount)}
          standing={findMyStanding(league.leaderboard, player.id)}
          to={paths.league(league.id)}
        />
      ))}
      {data.myLeagues.length === 0 ? (
        <p className="text-muted m-0 text-sm">
          Pas besoin de ligue pour jouer.{' '}
          <Link to={paths.leagues} className="text-primary font-bold">
            Crée ou rejoins une ligue
          </Link>{' '}
          pour affronter tes potes.
        </p>
      ) : null}
    </section>
  );
}
