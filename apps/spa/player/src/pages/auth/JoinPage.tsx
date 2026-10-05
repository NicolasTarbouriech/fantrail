import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  formatPlayerCount,
  normalizeInviteCode,
} from '@trail/modules-frontend';
import {
  Bib,
  Button,
  Callout,
  Card,
  Heading,
  Spinner,
} from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';
import { getErrorMessage } from '../../services/errors';
import {
  useJoinPageMutateJoinMutation,
  useJoinPageQuery,
  useRequireAuthQuery,
} from '../../services/graphql';
import { AuthLayout } from './AuthLayout';
import { RegisterForm } from './RegisterForm';

const STEPS = [
  'Pronostique le top 5 hommes et femmes de chaque course',
  'Estime le chrono du vainqueur',
  'Mise sur les outsiders : jusqu’à ×2 sur tes points',
];

export function JoinPage() {
  const navigate = useNavigate();
  const inviteCode = normalizeInviteCode(useParams()['inviteCode'] ?? '');
  const { data: meData } = useRequireAuthQuery({ fetchPolicy: 'cache-first' });
  const { data, loading, error } = useJoinPageQuery({
    variables: { inviteCode },
  });
  const [join, joinState] = useJoinPageMutateJoinMutation();
  const [joinError, setJoinError] = useState<string | null>(null);
  const me = meData?.me ?? null;
  const league = data?.leagueByInviteCode;

  if (loading && !data) {
    return <Spinner />;
  }
  if (error || !league) {
    return (
      <AuthLayout>
        <Heading level={1}>Invitation introuvable</Heading>
        <Callout tone="warning">
          Ce lien d’invitation ne marche plus : le propriétaire de la ligue a
          peut-être généré un nouveau code.
        </Callout>
        <Link to={paths.home} className="text-primary font-bold">
          Aller à l’accueil
        </Link>
      </AuthLayout>
    );
  }
  if (me && league.isMember) {
    return <Navigate to={paths.league(league.id)} replace />;
  }

  const owner = league.members.find((member) => member.id === league.ownerId);
  const raceNames = (data?.races ?? []).map((race) => race.name).join(' · ');

  const joinLeague = async () => {
    setJoinError(null);
    try {
      const result = await join({ variables: { inviteCode } });
      navigate(
        paths.league(result.data?.joinLeagueByInviteCode.id ?? league.id),
        {
          replace: true,
        },
      );
    } catch (caught) {
      setJoinError(getErrorMessage(caught));
    }
  };

  return (
    <AuthLayout>
      <Card
        variant="block"
        className="bg-primary flex flex-col gap-1 p-5 text-white"
      >
        <span className="text-on-primary text-sm font-semibold">
          {owner ? `${owner.pseudo} t’invite dans sa ligue` : 'Invitation'}
        </span>
        <h1 className="font-display m-0 text-[44px] leading-[0.95] font-black uppercase">
          {league.name}
        </h1>
        <span className="text-on-primary text-[13px]">
          {[formatPlayerCount(league.memberCount), raceNames]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </Card>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 text-sm font-semibold"
          >
            <Bib className="h-9 w-9 text-xl">{index + 1}</Bib>
            {step}
          </li>
        ))}
      </ol>
      {me ? (
        <div className="flex flex-col gap-2">
          <Button
            variant="cta"
            size="lg"
            block
            onClick={joinLeague}
            disabled={joinState.loading}
          >
            Rejoindre {league.name}
          </Button>
          {joinError ? (
            <p role="alert" className="text-alert m-0 text-sm font-semibold">
              {joinError}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <Heading>Crée ton compte</Heading>
          <RegisterForm
            submitLabel={`Rejoindre ${league.name}`}
            onRegistered={joinLeague}
          />
          <p className="m-0 text-center text-sm">
            Déjà un compte ?{' '}
            <Link
              to={`${paths.login}?suite=${encodeURIComponent(paths.join(inviteCode))}`}
              className="text-primary font-bold"
            >
              Connecte-toi
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
