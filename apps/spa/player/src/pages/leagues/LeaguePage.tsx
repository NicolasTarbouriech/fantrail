import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { formatPlayerCount } from '@trail/modules-frontend';
import {
  LeagueVisibility,
  RaceStatus,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  Button,
  Callout,
  GlobeIcon,
  Hero,
  LockIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  Spinner,
  iconButtonClasses,
} from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { getErrorMessage } from '../../services/errors';
import {
  useLeaguePageMutateJoinMutation,
  useLeaguePageMutateLeaveMutation,
  useLeaguePageQuery,
} from '../../services/graphql';
import { InviteButton } from './InviteButton';
import { LeaderboardList } from './LeaderboardList';
import { LeaveLeagueSheet } from './LeaveLeagueSheet';
import { MemberPicksSection } from './MemberPicksSection';
import { RaceTabs } from './RaceTabs';

export function LeaguePage() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const { leagueId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const raceId = searchParams.get('course');
  const { data, loading, error } = useLeaguePageQuery({
    variables: { leagueId, raceId },
  });
  const [join, joinState] = useLeaguePageMutateJoinMutation({
    refetchQueries: ['LeaguePage', 'LeaguesPage', 'HomePage'],
  });
  const [leave, leaveState] = useLeaguePageMutateLeaveMutation({
    refetchQueries: ['LeaguesPage', 'HomePage'],
  });
  const [isLeaveOpen, setLeaveOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading && !data) {
    return <Spinner />;
  }
  if (error || !data) {
    return (
      <DetailPage
        hero={
          <Hero
            title="Ligue introuvable"
            leading={
              <BackLink to={paths.leagues} label="Retour à mes ligues" />
            }
          />
        }
      >
        <Callout tone="warning">{getErrorMessage(error)}</Callout>
      </DetailPage>
    );
  }

  const league = data.league;
  const isPrivate = league.visibility === LeagueVisibility.Private;
  const owner = league.members.find((member) => member.id === league.ownerId);
  const races = league.races.filter(
    (race) => race.status !== RaceStatus.Cancelled,
  );
  const selectedRace = races.find((race) => race.id === raceId) ?? null;

  const joinLeague = async () => {
    setActionError(null);
    try {
      await join({ variables: { leagueId: league.id } });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  };

  const leaveLeague = async () => {
    setActionError(null);
    try {
      await leave({ variables: { leagueId: league.id } });
      navigate(paths.leagues, { replace: true });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  };

  return (
    <DetailPage
      hero={
        <Hero
          tone={league.isMember ? 'primary' : 'ink'}
          leading={<BackLink to={paths.leagues} label="Retour à mes ligues" />}
          trailing={
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border-2 border-white px-2.5 py-1 text-xs font-bold">
                {isPrivate ? <LockIcon size={13} /> : <GlobeIcon size={13} />}
                {isPrivate ? 'LIGUE PRIVÉE' : 'LIGUE PUBLIQUE'}
              </span>
              {league.isOwner ? (
                <Link
                  to={paths.leagueSettings(league.id)}
                  aria-label="Réglages de la ligue"
                  className={iconButtonClasses()}
                >
                  <SettingsIcon />
                </Link>
              ) : null}
            </div>
          }
          title={league.name}
          subtitle={[
            formatPlayerCount(league.memberCount),
            owner ? `créée par ${owner.pseudo}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        >
          {league.isMember && league.inviteCode ? (
            <InviteButton
              leagueName={league.name}
              inviteCode={league.inviteCode}
            />
          ) : null}
          {!league.isMember ? (
            <Button
              variant="cta"
              size="lg"
              block
              onClick={joinLeague}
              disabled={joinState.loading}
            >
              <PlusIcon />
              Rejoindre la ligue
            </Button>
          ) : null}
        </Hero>
      }
    >
      {actionError && !isLeaveOpen ? (
        <Callout tone="warning">{actionError}</Callout>
      ) : null}
      <div className="grid grow gap-3.5 md:gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="flex flex-col gap-3.5 md:gap-5">
          <RaceTabs
            races={races}
            selectedRaceId={selectedRace?.id ?? null}
            onSelect={(id) =>
              setSearchParams(id ? { course: id } : {}, { replace: true })
            }
          />
          <LeaderboardList
            entries={league.leaderboard}
            myUserId={player.id}
            limit={league.isMember ? undefined : 6}
          />
        </div>
        <div className="flex flex-col gap-3.5 md:gap-5 lg:sticky lg:top-24">
          {league.isMember && selectedRace ? (
            <MemberPicksSection
              leagueId={league.id}
              race={selectedRace}
              members={league.members}
              myUserId={player.id}
            />
          ) : null}
          {league.isMember && !selectedRace ? (
            <div className="border-ink flex items-center gap-2.5 rounded-[14px] border-2 bg-white px-3.5 py-3 text-[13px] leading-snug">
              <LockIcon className="text-primary shrink-0" />
              Les pronos des membres s’affichent dans l’onglet de chaque course,
              dès son départ.
            </div>
          ) : null}
          {!league.isMember ? (
            <Callout>
              Rejoins la ligue pour apparaître dans son classement et voir les
              pronos des membres après chaque départ. Tes pronos restent les
              mêmes dans toutes tes ligues.
            </Callout>
          ) : null}
          {league.isMember && !league.isOwner ? (
            <button
              type="button"
              onClick={() => setLeaveOpen(true)}
              className="text-alert mt-auto flex min-h-11 cursor-pointer items-center gap-2 self-center border-0 bg-transparent px-3 text-sm font-bold"
            >
              <LogOutIcon size={18} />
              Quitter la ligue
            </button>
          ) : null}
        </div>
      </div>
      <LeaveLeagueSheet
        open={isLeaveOpen}
        leagueName={league.name}
        isPrivate={isPrivate}
        isLeaving={leaveState.loading}
        error={actionError}
        onConfirm={leaveLeague}
        onClose={() => setLeaveOpen(false)}
      />
    </DetailPage>
  );
}
