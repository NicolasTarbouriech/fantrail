import { useSearchParams } from 'react-router-dom';

import { formatPlayerCount } from '@trail/modules-frontend';
import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { Hero, Spinner } from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useCommunityPageQuery } from '../../services/graphql';
import { LeaderboardList } from './LeaderboardList';
import { RaceTabs } from './RaceTabs';

export function CommunityPage() {
  const player = useCurrentPlayer();
  const [searchParams, setSearchParams] = useSearchParams();
  const raceId = searchParams.get('course');
  const { data, loading } = useCommunityPageQuery({ variables: { raceId } });
  const races = (data?.races ?? []).filter(
    (race) => race.status !== RaceStatus.Cancelled,
  );

  return (
    <DetailPage
      hero={
        <Hero
          tone="ink"
          leading={<BackLink to={paths.leagues} label="Retour à mes ligues" />}
          title="Communauté"
          subtitle={
            data
              ? `${formatPlayerCount(data.communityLeaderboard.length)} · tous les joueurs`
              : 'Tous les joueurs'
          }
        />
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3.5 md:gap-5">
        <RaceTabs
          races={races}
          selectedRaceId={races.find((race) => race.id === raceId)?.id ?? null}
          onSelect={(id) =>
            setSearchParams(id ? { course: id } : {}, { replace: true })
          }
        />
        {loading && !data ? <Spinner /> : null}
        {data ? (
          <LeaderboardList
            entries={data.communityLeaderboard}
            myUserId={player.id}
            limit={50}
          />
        ) : null}
      </div>
    </DetailPage>
  );
}
