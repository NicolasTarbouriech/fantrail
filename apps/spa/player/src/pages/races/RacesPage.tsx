import { getInitial } from '@trail/modules-frontend';
import { Callout, Heading, Spinner } from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useNow } from '../../hooks/useNow';
import { useHomePageQuery } from '../../services/graphql';
import { RaceCardContainer } from '../home/RaceCardContainer';
import { getPredictionByFieldId } from '../home/homeRace';

export function RacesPage() {
  const player = useCurrentPlayer();
  const now = useNow();
  const { data, loading, error } = useHomePageQuery();
  const predictionByFieldId = getPredictionByFieldId(data?.myPredictions ?? []);

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <div className="flex flex-col gap-0.5">
        <Heading level={1}>Courses</Heading>
        <span className="text-muted text-[15px]">
          Fais ton prono sur une course pour la retrouver sur ton accueil.
        </span>
      </div>
      {loading && !data ? <Spinner /> : null}
      {error && !data ? (
        <Callout tone="warning">
          Impossible de charger les courses. Réessaie dans un instant.
        </Callout>
      ) : null}
      <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
        {(data?.races ?? []).map((race, index) => (
          <RaceCardContainer
            key={race.id}
            race={race}
            predictionByFieldId={predictionByFieldId}
            tone={index % 2 === 0 ? 'primary' : 'ink'}
            now={now}
          />
        ))}
      </div>
    </TabPage>
  );
}
