import { useParams } from 'react-router-dom';

import { formatPlayerCount } from '@trail/modules-frontend';
import { Callout, Hero, Spinner } from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { getErrorMessage } from '../../services/errors';
import { useRaceLeaderboardPageQuery } from '../../services/graphql';
import { LeaderboardList } from '../leagues/LeaderboardList';

export function RaceLeaderboardPage() {
  const player = useCurrentPlayer();
  const { raceId = '' } = useParams();
  const { data, loading, error } = useRaceLeaderboardPageQuery({
    variables: { raceId },
  });

  if (loading && !data) {
    return <Spinner />;
  }
  const back = <BackLink to={paths.home} label="Retour à l’accueil" />;
  if (error || !data) {
    return (
      <DetailPage hero={<Hero title="Course introuvable" leading={back} />}>
        <Callout tone="warning">{getErrorMessage(error)}</Callout>
      </DetailPage>
    );
  }

  const entries = data.communityLeaderboard;
  const hasResult = data.race.fields.some((field) => field.result);
  return (
    <DetailPage
      hero={
        <Hero
          tone="ink"
          leading={back}
          title={data.race.name}
          subtitle={`Classement · ${formatPlayerCount(entries.length)}`}
        />
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3.5 md:gap-5">
        {entries.length > 0 && !hasResult ? (
          <Callout>
            Les points arrivent avec les résultats. Jusque-là, tous les joueurs
            de la course sont à égalité.
          </Callout>
        ) : null}
        {entries.length === 0 ? (
          <Callout>
            Personne n’a encore fait de prono sur cette course. Lance-toi : ton
            prono t’ajoute au classement.
          </Callout>
        ) : (
          <LeaderboardList entries={entries} myUserId={player.id} limit={100} />
        )}
      </div>
    </DetailPage>
  );
}
