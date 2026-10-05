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
import { Callout, Heading, Spinner } from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { paths, tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useNow } from '../../hooks/useNow';
import { type HomePageQuery, useHomePageQuery } from '../../services/graphql';
import { RaceCardContainer } from './RaceCardContainer';
import {
  type HomePrediction,
  type HomeRace,
  getRaceCardSource,
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
          field.startList.runners.map((runner) => [runner.id, runner]),
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

  const races = data?.races ?? [];
  const predictionByFieldId = new Map(
    (data?.myPredictions ?? []).map((prediction) => [
      prediction.fieldId,
      prediction,
    ]),
  );
  const openCount = races.filter(
    (race) => getRaceCardKind(getRaceCardSource(race)) === 'open',
  ).length;
  const community = data
    ? findMyStanding(data.communityLeaderboard, player.id)
    : null;

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <div className="flex flex-col gap-0.5">
        <Heading level={1}>Salut {player.pseudo}</Heading>
        <span className="text-muted text-[15px]">
          {openCount > 1
            ? `${openCount} courses ouvertes aux pronos`
            : openCount === 1
              ? '1 course ouverte aux pronos'
              : 'Aucune course ouverte aux pronos'}
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
          <div className="grid items-start gap-[18px] md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {races.map((race, index) => (
              <RaceCardContainer
                key={race.id}
                race={race}
                predictionByFieldId={predictionByFieldId}
                tone={index % 2 === 0 ? 'primary' : 'ink'}
                now={now}
              />
            ))}
          </div>
        </div>
        {data ? <HomeLeagues data={data} community={community} /> : null}
      </div>
    </TabPage>
  );
}

function HomeLeagues({
  data,
  community,
}: {
  data: HomePageQuery;
  community: ReturnType<typeof findMyStanding>;
}) {
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
      <LeagueRow
        name="Communauté"
        badge="TOUS"
        badgeTone="ink"
        details="tous les joueurs"
        standing={community}
        to={paths.community}
      />
    </section>
  );
}
