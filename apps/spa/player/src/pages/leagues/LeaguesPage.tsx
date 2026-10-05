import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  LeagueRow,
  findMyStanding,
  formatPlayerCount,
  getInitial,
  isInviteCode,
  normalizeInviteCode,
} from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  Button,
  Card,
  Heading,
  PlusIcon,
  Spinner,
  buttonClasses,
  inputClasses,
} from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { paths, tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { getErrorMessage } from '../../services/errors';
import {
  useLeaguesPageMutateJoinByCodeMutation,
  useLeaguesPageMutateJoinMutation,
  useLeaguesPageQuery,
} from '../../services/graphql';

export function LeaguesPage() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const { data, loading } = useLeaguesPageQuery();
  const [joinByCode, joinByCodeState] =
    useLeaguesPageMutateJoinByCodeMutation();
  const [join, joinState] = useLeaguesPageMutateJoinMutation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isInviteCode(code)) {
      setError('Un code fait 8 caractères, par exemple CHAMX742.');
      return;
    }
    try {
      const result = await joinByCode({
        variables: { inviteCode: normalizeInviteCode(code) },
      });
      if (result.data) {
        navigate(paths.league(result.data.joinLeagueByInviteCode.id));
      }
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  const joinPublic = async (leagueId: string) => {
    setError(null);
    try {
      await join({ variables: { leagueId } });
      navigate(paths.league(leagueId));
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  const publicLeagues = (data?.publicLeagues ?? []).filter(
    (league) => !league.isMember,
  );

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <Heading level={1}>Mes ligues</Heading>
      <div className="grid gap-[18px] md:grid-cols-2 md:items-start md:gap-6">
        <div className="flex flex-col gap-[18px] md:col-start-1 md:row-start-1">
          <Link
            to={paths.createLeague}
            className={buttonClasses({
              variant: 'cta',
              size: 'lg',
              block: true,
            })}
          >
            <PlusIcon />
            Créer une ligue
          </Link>
          <Card variant="flat" className="p-3.5">
            <form onSubmit={submitCode} className="flex flex-col gap-2">
              <label htmlFor="invite-code" className="text-sm font-bold">
                Tu as reçu un code ?
              </label>
              <div className="flex gap-2">
                <input
                  id="invite-code"
                  type="text"
                  placeholder="CHAMX742"
                  autoCapitalize="characters"
                  autoComplete="off"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className={`${inputClasses('code')} grow`}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={joinByCodeState.loading}
                >
                  Rejoindre
                </Button>
              </div>
              {error ? (
                <p
                  role="alert"
                  className="text-alert m-0 text-sm font-semibold"
                >
                  {error}
                </p>
              ) : null}
            </form>
          </Card>
        </div>
        {loading && !data ? <Spinner /> : null}
        {data ? (
          <section className="flex flex-col gap-2.5 md:col-start-2 md:row-span-2 md:row-start-1">
            <Heading>Tes ligues</Heading>
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
              <span className="text-muted text-sm">
                Aucune ligue pour l’instant. Le classement de tous les joueurs
                est sur chaque course.
              </span>
            ) : null}
          </section>
        ) : null}
        {publicLeagues.length > 0 ? (
          <section className="flex flex-col gap-2.5 md:col-start-1">
            <Heading>Ligues publiques</Heading>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {publicLeagues.map((league) => (
                <li
                  key={league.id}
                  className="border-line-strong flex min-h-14 items-center gap-3 rounded-xl border-2 bg-white pr-2 pl-3.5"
                >
                  <Link
                    to={paths.league(league.id)}
                    className="text-ink flex grow flex-col no-underline"
                  >
                    <span className="text-[15px] font-bold">{league.name}</span>
                    <span className="text-muted text-xs">
                      {formatPlayerCount(league.memberCount)}
                    </span>
                  </Link>
                  <Button
                    variant="ink"
                    size="sm"
                    disabled={joinState.loading}
                    onClick={() => joinPublic(league.id)}
                  >
                    Rejoindre
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </TabPage>
  );
}
