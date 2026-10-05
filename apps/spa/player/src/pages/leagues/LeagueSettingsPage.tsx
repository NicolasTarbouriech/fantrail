import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { VisibilityOptions, getLeagueNameError } from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  Button,
  Callout,
  Card,
  Heading,
  Hero,
  RefreshIcon,
  Spinner,
  Tag,
  inputClasses,
} from '@trail/shared/design/ui-react';
import { BackLink, DetailPage } from '@trail/shell/fantrail';

import { paths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { getErrorMessage } from '../../services/errors';
import {
  useLeagueSettingsPageMutateDeleteMutation,
  useLeagueSettingsPageMutateRegenerateCodeMutation,
  useLeagueSettingsPageMutateRemoveMemberMutation,
  useLeagueSettingsPageMutateRenameMutation,
  useLeagueSettingsPageMutateVisibilityMutation,
  useLeagueSettingsPageQuery,
} from '../../services/graphql';
import { ConfirmSheet } from './ConfirmSheet';

type PendingConfirm =
  | { kind: 'remove'; userId: string; pseudo: string }
  | { kind: 'delete' }
  | { kind: 'regenerate' };

export function LeagueSettingsPage() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const { leagueId = '' } = useParams();
  const { data, loading } = useLeagueSettingsPageQuery({
    variables: { leagueId },
  });
  const [rename, renameState] = useLeagueSettingsPageMutateRenameMutation();
  const [changeVisibility] = useLeagueSettingsPageMutateVisibilityMutation();
  const [regenerate, regenerateState] =
    useLeagueSettingsPageMutateRegenerateCodeMutation();
  const [removeMember, removeState] =
    useLeagueSettingsPageMutateRemoveMemberMutation();
  const [deleteLeague, deleteState] = useLeagueSettingsPageMutateDeleteMutation(
    {
      refetchQueries: ['LeaguesPage', 'HomePage'],
    },
  );
  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  if (loading && !data) {
    return <Spinner />;
  }
  if (!data) {
    return <Navigate to={paths.leagues} replace />;
  }
  const league = data.league;
  if (!league.isOwner) {
    return <Navigate to={paths.league(league.id)} replace />;
  }
  const currentName = name ?? league.name;

  const submitName = async (event: FormEvent) => {
    event.preventDefault();
    const error = getLeagueNameError(currentName);
    setNameError(error);
    setNotice(null);
    if (error) {
      return;
    }
    try {
      await rename({
        variables: { leagueId: league.id, name: currentName.trim() },
      });
      setName(null);
      setNotice('Ligue renommée.');
    } catch (caught) {
      setNameError(getErrorMessage(caught));
    }
  };

  const updateVisibility = async (visibility: LeagueVisibility) => {
    setNotice(null);
    try {
      await changeVisibility({
        variables: { leagueId: league.id, visibility },
      });
      setNotice(
        visibility === LeagueVisibility.Public
          ? 'Ta ligue est maintenant publique.'
          : 'Ta ligue est maintenant privée.',
      );
    } catch (caught) {
      setNotice(getErrorMessage(caught));
    }
  };

  const runConfirm = async () => {
    if (!confirm) {
      return;
    }
    setConfirmError(null);
    try {
      if (confirm.kind === 'remove') {
        await removeMember({
          variables: { leagueId: league.id, userId: confirm.userId },
        });
      } else if (confirm.kind === 'regenerate') {
        await regenerate({ variables: { leagueId: league.id } });
      } else {
        await deleteLeague({ variables: { leagueId: league.id } });
        navigate(paths.leagues, { replace: true });
        return;
      }
      setConfirm(null);
    } catch (caught) {
      setConfirmError(getErrorMessage(caught));
    }
  };

  const members = [...league.members].sort((a, b) =>
    a.id === league.ownerId
      ? -1
      : b.id === league.ownerId
        ? 1
        : a.pseudo.localeCompare(b.pseudo, 'fr'),
  );

  return (
    <DetailPage
      hero={
        <Hero
          leading={
            <BackLink to={paths.league(league.id)} label="Retour à la ligue" />
          }
          trailing={
            <span className="text-on-primary text-[13px]">
              {league.name} · tu es propriétaire
            </span>
          }
          title="Réglages"
        />
      }
    >
      {notice ? <Callout>{notice}</Callout> : null}
      <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-6">
        <div className="flex flex-col gap-4 md:gap-6">
          <Card variant="flat" className="p-3.5">
            <form onSubmit={submitName} className="flex flex-col gap-2">
              <label
                htmlFor="league-rename"
                className="font-display text-xl font-black tracking-wide uppercase"
              >
                Nom de la ligue
              </label>
              <div className="flex gap-2">
                <input
                  id="league-rename"
                  type="text"
                  maxLength={40}
                  value={currentName}
                  onChange={(event) => setName(event.target.value)}
                  className={`${inputClasses()} grow font-semibold`}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    renameState.loading || currentName.trim() === league.name
                  }
                >
                  Renommer
                </Button>
              </div>
              <span
                className={
                  nameError
                    ? 'text-alert text-xs font-semibold'
                    : 'text-muted text-xs'
                }
              >
                {nameError ?? '3 à 40 caractères, unique.'}
              </span>
            </form>
          </Card>
          <Card variant="flat" className="flex flex-col gap-2.5 p-3.5">
            <Heading className="text-xl">Visibilité</Heading>
            <VisibilityOptions
              name="visibility-edit"
              value={league.visibility}
              onChange={updateVisibility}
            />
          </Card>
          {league.inviteCode ? (
            <Card variant="flat" className="flex flex-col gap-2.5 p-3.5">
              <Heading className="text-xl">Code d’invitation</Heading>
              <span className="border-ink font-display flex h-[52px] items-center justify-center rounded-xl border-2 border-dashed text-[28px] font-black tracking-[0.12em]">
                {league.inviteCode}
              </span>
              <Button
                variant="outline"
                block
                onClick={() => setConfirm({ kind: 'regenerate' })}
              >
                <RefreshIcon size={16} />
                Générer un nouveau code
              </Button>
              <span className="text-muted text-xs">
                L’ancien code et l’ancien lien ne marcheront plus. Les membres
                actuels restent.
              </span>
            </Card>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <Card variant="flat" className="flex flex-col gap-2 p-3.5">
            <Heading className="text-xl">
              Membres · {league.members.length}
            </Heading>
            <ul className="m-0 flex list-none flex-col p-0">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="border-line flex min-h-[52px] items-center gap-2.5 border-b-2 last:border-b-0"
                >
                  <span className="grow text-[15px] font-bold">
                    {member.id === player.id
                      ? `${member.pseudo} · toi`
                      : member.pseudo}
                  </span>
                  {member.id === league.ownerId ? (
                    <Tag tone="highlight">Propriétaire</Tag>
                  ) : (
                    <Button
                      variant="dangerOutline"
                      size="sm"
                      aria-label={`Retirer ${member.pseudo} de la ligue`}
                      onClick={() =>
                        setConfirm({
                          kind: 'remove',
                          userId: member.id,
                          pseudo: member.pseudo,
                        })
                      }
                    >
                      Retirer
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          <Card variant="alert" className="flex flex-col gap-2.5 p-3.5">
            <Heading className="text-alert text-xl">Supprimer la ligue</Heading>
            <span className="text-[13px] leading-snug">
              Le classement de la ligue disparaît pour tous ses membres. Leurs
              pronos et leurs points restent dans leurs autres ligues.
            </span>
            <Button
              variant="danger"
              block
              className="h-12 rounded-xl text-xl"
              onClick={() => setConfirm({ kind: 'delete' })}
            >
              Supprimer {league.name}
            </Button>
          </Card>
        </div>
      </div>
      <ConfirmSheet
        open={confirm !== null}
        title={
          confirm?.kind === 'remove'
            ? `Retirer ${confirm.pseudo} ?`
            : confirm?.kind === 'regenerate'
              ? 'Nouveau code ?'
              : `Supprimer ${league.name} ?`
        }
        confirmLabel={
          confirm?.kind === 'remove'
            ? 'Retirer de la ligue'
            : confirm?.kind === 'regenerate'
              ? 'Générer un nouveau code'
              : 'Supprimer la ligue'
        }
        isPending={
          removeState.loading || regenerateState.loading || deleteState.loading
        }
        error={confirmError}
        onConfirm={runConfirm}
        onClose={() => {
          setConfirm(null);
          setConfirmError(null);
        }}
      >
        {confirm?.kind === 'remove'
          ? `${confirm.pseudo} disparaît du classement de la ligue. Ses pronos et ses points restent dans ses autres ligues. Retour possible avec le code d’invitation.`
          : confirm?.kind === 'regenerate'
            ? 'Le code et le lien actuels ne marcheront plus. Tu devras partager le nouveau.'
            : 'Le classement de la ligue disparaît pour tous ses membres. Cette action est définitive.'}
      </ConfirmSheet>
    </DetailPage>
  );
}
