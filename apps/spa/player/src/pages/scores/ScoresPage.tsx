import {
  findMyStanding,
  formatPoints,
  formatRank,
  getInitial,
} from '@trail/modules-frontend';
import { Callout, Card, Heading, Spinner } from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useNow } from '../../hooks/useNow';
import { useHomePageQuery, useScoresPageQuery } from '../../services/graphql';
import { RaceCardContainer } from '../home/RaceCardContainer';

export function ScoresPage() {
  const player = useCurrentPlayer();
  const now = useNow();
  const { data: homeData, loading } = useHomePageQuery();
  const { data } = useScoresPageQuery();
  const standing = data
    ? findMyStanding(data.communityLeaderboard, player.id)
    : null;
  const total =
    data?.communityLeaderboard.find((entry) => entry.userId === player.id)
      ?.total ?? 0;
  const predictionByFieldId = new Map(
    (homeData?.myPredictions ?? []).map((prediction) => [
      prediction.fieldId,
      prediction,
    ]),
  );

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
            Communauté
          </span>
          <span className="font-display text-[40px] leading-none font-black">
            {standing ? formatRank(standing.rank) : '—'}
            {standing ? (
              <span className="text-muted ml-1 font-sans text-sm font-semibold">
                / {standing.playerCount}
              </span>
            ) : null}
          </span>
        </Card>
      </div>
      {loading && !homeData ? <Spinner /> : null}
      <div className="grid items-start gap-[18px] md:grid-cols-2 md:gap-6">
        {(homeData?.races ?? []).map((race, index) => (
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
