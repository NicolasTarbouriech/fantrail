import { formatPoints, getInitial } from '@trail/modules-frontend';
import { Callout, Card, Heading, Spinner } from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useNow } from '../../hooks/useNow';
import { useHomePageQuery, useScoresPageQuery } from '../../services/graphql';
import { RaceCardContainer } from '../home/RaceCardContainer';
import { getPredictionByFieldId, selectMyRaces } from '../home/homeRace';

export function ScoresPage() {
  const player = useCurrentPlayer();
  const now = useNow();
  const { data: homeData, loading } = useHomePageQuery();
  const { data } = useScoresPageQuery();
  const total = data?.myTotalPoints ?? 0;
  const predictionByFieldId = getPredictionByFieldId(
    homeData?.myPredictions ?? [],
  );
  const races = selectMyRaces(homeData?.races ?? [], predictionByFieldId);

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <Heading level={1}>Mes scores</Heading>
      <div className="grid grid-cols-2 gap-2.5 md:max-w-xl md:gap-4">
        <Card
          variant="block"
          className="bg-primary flex flex-col p-3.5 text-white"
        >
          <span className="text-on-primary text-xs font-bold tracking-wide uppercase">
            Total
          </span>
          <span className="font-display text-highlight text-[40px] leading-none font-black">
            {formatPoints(total)}
          </span>
        </Card>
        <Card variant="block" className="flex flex-col p-3.5">
          <span className="text-muted text-xs font-bold tracking-wide uppercase">
            Courses
          </span>
          <span className="font-display text-[40px] leading-none font-black">
            {races.length}
          </span>
        </Card>
      </div>
      {loading && !homeData ? <Spinner /> : null}
      <div className="grid gap-[18px] md:grid-cols-2 md:gap-6">
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
      <Callout className="md:max-w-xl">
        Chaque champ noté a sa scorecard : points pick par pick, multiplicateur
        outsider, chrono et bonus.
      </Callout>
    </TabPage>
  );
}
