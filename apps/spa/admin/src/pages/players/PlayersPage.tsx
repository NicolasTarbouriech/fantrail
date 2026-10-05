import { useState } from 'react';

import { formatDay } from '@trail/modules-frontend';
import { UserRole } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { SearchIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  AdminButton,
  AdminInput,
  AdminNotice,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import { useCurrentAdmin } from '../../auth/CurrentAdmin';
import { getErrorMessage } from '../../services/errors';
import {
  usePlayersPageMutateDisableMutation,
  usePlayersPageMutateEnableMutation,
  usePlayersPageQuery,
} from '../../services/graphql';
import { ConfirmDialog } from '../races/ConfirmDialog';

export function PlayersPage() {
  const admin = useCurrentAdmin();
  const { data, loading } = usePlayersPageQuery();
  const [disable, disableState] = usePlayersPageMutateDisableMutation();
  const [enable] = usePlayersPageMutateEnableMutation();
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<{ id: string; pseudo: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const query = search.trim().toLowerCase();
  const users = (data?.adminUsers ?? []).filter(
    (user) =>
      !query ||
      user.pseudo.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query),
  );

  const run = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
      setPending(null);
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Joueurs"
        description={`${data?.adminUsers.length ?? 0} comptes. Un compte désactivé ne peut plus se connecter et sort du classement Communauté.`}
      />
      <label className="relative max-w-sm">
        <SearchIcon
          size={16}
          className="absolute top-2.5 left-3 text-zinc-400"
        />
        <AdminInput
          aria-label="Rechercher un joueur"
          placeholder="Pseudo ou email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </label>
      {error && !pending ? (
        <AdminNotice tone="danger">{error}</AdminNotice>
      ) : null}
      {loading && !data ? <Spinner /> : null}
      {data ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Pseudo</AdminTh>
              <AdminTh>Email</AdminTh>
              <AdminTh>Rôle</AdminTh>
              <AdminTh>Inscrit le</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>
                <span className="sr-only">Actions</span>
              </AdminTh>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <AdminTd className="font-semibold">{user.pseudo}</AdminTd>
                <AdminTd className="text-zinc-600">{user.email}</AdminTd>
                <AdminTd>
                  {user.role === UserRole.Admin ? (
                    <AdminBadge tone="gold">Admin</AdminBadge>
                  ) : (
                    <AdminBadge tone="outline">Joueur</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="whitespace-nowrap">
                  {formatDay(user.createdAt)}
                </AdminTd>
                <AdminTd>
                  {user.disabledAt ? (
                    <AdminBadge tone="danger">Désactivé</AdminBadge>
                  ) : (
                    <AdminBadge>Actif</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="text-right">
                  {user.id === admin.id ? null : user.disabledAt ? (
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        run(() => enable({ variables: { userId: user.id } }))
                      }
                    >
                      Réactiver
                    </AdminButton>
                  ) : (
                    <AdminButton
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setPending({ id: user.id, pseudo: user.pseudo })
                      }
                    >
                      Désactiver
                    </AdminButton>
                  )}
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}
      <ConfirmDialog
        open={pending !== null}
        title={`Désactiver ${pending?.pseudo ?? ''} ?`}
        confirmLabel="Désactiver le compte"
        tone="danger"
        isPending={disableState.loading}
        error={error}
        onConfirm={() =>
          pending && run(() => disable({ variables: { userId: pending.id } }))
        }
        onClose={() => {
          setPending(null);
          setError(null);
        }}
      >
        Ce compte ne pourra plus se connecter et sort du classement Communauté.
        Ses pronos et ses points restent dans ses ligues. Tu pourras le
        réactiver.
      </ConfirmDialog>
    </>
  );
}
