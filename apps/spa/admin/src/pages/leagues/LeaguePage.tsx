import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  formatDay,
  formatPoints,
  getLeagueNameError,
} from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { ChevronRightIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminField,
  AdminInput,
  AdminNotice,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import { paths } from '../../app/paths';
import { getErrorMessage } from '../../services/errors';
import {
  useLeaguePageMutateDeleteMutation,
  useLeaguePageMutateRemoveMemberMutation,
  useLeaguePageMutateRenameMutation,
  useLeaguePageQuery,
} from '../../services/graphql';
import { ConfirmDialog } from '../races/ConfirmDialog';

type Pending =
  | { kind: 'remove'; userId: string; pseudo: string }
  | { kind: 'delete' }
  | null;

export function LeaguePage() {
  const navigate = useNavigate();
  const { leagueId = '' } = useParams();
  const { data, loading } = useLeaguePageQuery({ variables: { leagueId } });
  const [rename, renameState] = useLeaguePageMutateRenameMutation();
  const [removeMember, removeState] = useLeaguePageMutateRemoveMemberMutation({
    refetchQueries: ['LeaguePage'],
  });
  const [deleteLeague, deleteState] = useLeaguePageMutateDeleteMutation({
    refetchQueries: ['LeaguesPage'],
  });
  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);

  if (loading && !data) {
    return <Spinner />;
  }
  if (!data) {
    return <AdminNotice tone="danger">Ligue introuvable.</AdminNotice>;
  }
  const league = data.league;
  const currentName = name ?? league.name;
  const totalByUserId = new Map(
    league.leaderboard.map((entry) => [entry.userId, entry.total]),
  );
  const owner = league.members.find((member) => member.id === league.ownerId);

  const submitName = async (event: FormEvent) => {
    event.preventDefault();
    const problem = getLeagueNameError(currentName);
    setNameError(problem);
    setNotice(null);
    if (problem) {
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

  const confirm = async () => {
    setError(null);
    try {
      if (pending?.kind === 'remove') {
        await removeMember({
          variables: { leagueId: league.id, userId: pending.userId },
        });
        setPending(null);
      } else if (pending?.kind === 'delete') {
        await deleteLeague({ variables: { leagueId: league.id } });
        navigate(paths.leagues, { replace: true });
      }
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <>
      <nav
        aria-label="Fil d’Ariane"
        className="flex items-center gap-2 text-sm text-zinc-500"
      >
        <Link to={paths.leagues} className="no-underline hover:text-zinc-950">
          Ligues
        </Link>
        <ChevronRightIcon size={14} />
        <span className="font-medium text-zinc-950">{league.name}</span>
      </nav>
      <AdminPageHeader
        title={league.name}
        badge={
          league.visibility === LeagueVisibility.Private ? (
            <AdminBadge>Privée</AdminBadge>
          ) : (
            <AdminBadge tone="primary">Publique</AdminBadge>
          )
        }
        description={[
          owner
            ? `Créée par ${owner.pseudo} le ${formatDay(league.createdAt)}`
            : null,
          `${league.memberCount} membres`,
          league.races.map((race) => race.name).join(', ') || 'aucune course',
          league.inviteCode ? `code d’invitation ${league.inviteCode}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      />
      {notice ? <AdminNotice tone="success">{notice}</AdminNotice> : null}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Membre</AdminTh>
              <AdminTh>Rôle</AdminTh>
              <AdminTh className="text-right">Cumul</AdminTh>
              <AdminTh>
                <span className="sr-only">Actions</span>
              </AdminTh>
            </tr>
          </thead>
          <tbody>
            {league.members.map((member) => (
              <tr key={member.id}>
                <AdminTd className="font-semibold">{member.pseudo}</AdminTd>
                <AdminTd>
                  {member.id === league.ownerId ? (
                    <AdminBadge tone="gold">Propriétaire</AdminBadge>
                  ) : (
                    <AdminBadge tone="outline">Membre</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="text-right tabular-nums">
                  {formatPoints(totalByUserId.get(member.id) ?? 0)}
                </AdminTd>
                <AdminTd className="text-right">
                  {member.id === league.ownerId ? (
                    <span className="text-zinc-400">—</span>
                  ) : (
                    <AdminButton
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setPending({
                          kind: 'remove',
                          userId: member.id,
                          pseudo: member.pseudo,
                        })
                      }
                    >
                      Retirer
                    </AdminButton>
                  )}
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
        <div className="flex flex-col gap-4">
          <AdminCard>
            <AdminCardHeader
              title="Renommer la ligue"
              description="Pour un nom injurieux ou trompeur."
            />
            <form onSubmit={submitName} className="flex flex-col gap-3">
              <AdminField
                id="league-name"
                label="Nom"
                hint="3 à 40 caractères, unique sans tenir compte des majuscules ni des accents."
                error={nameError}
              >
                <AdminInput
                  id="league-name"
                  value={currentName}
                  maxLength={40}
                  onChange={(event) => setName(event.target.value)}
                />
              </AdminField>
              <AdminButton
                type="submit"
                variant="primary"
                className="self-start"
                disabled={
                  renameState.loading || currentName.trim() === league.name
                }
              >
                Enregistrer
              </AdminButton>
            </form>
          </AdminCard>
          <AdminCard tone="danger">
            <AdminCardHeader
              title="Supprimer la ligue"
              description="Le classement disparaît pour tous ses membres. Leurs pronos et leurs points restent ailleurs."
            />
            <AdminButton
              variant="destructive"
              className="self-start"
              onClick={() => setPending({ kind: 'delete' })}
            >
              Supprimer la ligue…
            </AdminButton>
          </AdminCard>
        </div>
      </div>
      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.kind === 'remove'
            ? `Retirer ${pending.pseudo} ?`
            : `Supprimer ${league.name} ?`
        }
        confirmLabel={
          pending?.kind === 'remove'
            ? 'Retirer de la ligue'
            : 'Supprimer la ligue'
        }
        tone="danger"
        isPending={removeState.loading || deleteState.loading}
        error={error}
        onConfirm={confirm}
        onClose={() => {
          setPending(null);
          setError(null);
        }}
      >
        {pending?.kind === 'remove'
          ? 'Le membre disparaît du classement de la ligue. Ses pronos et ses points restent dans ses autres ligues.'
          : 'Cette action est définitive pour tous les membres.'}
      </ConfirmDialog>
    </>
  );
}
