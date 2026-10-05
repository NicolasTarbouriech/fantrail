import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatDay } from '@trail/modules-frontend';
import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { LockIcon, SearchIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  AdminBadge,
  AdminInput,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import { paths } from '../../app/paths';
import { useLeaguesPageQuery } from '../../services/graphql';

export function LeaguesPage() {
  const { data, loading } = useLeaguesPageQuery();
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const leagues = (data?.adminLeagues ?? []).filter(
    (league) => !query || league.name.toLowerCase().includes(query),
  );

  return (
    <>
      <AdminPageHeader
        title="Ligues"
        description="Les ligues appartiennent à leurs créateurs : n’interviens que sur un nom problématique ou un membre à retirer."
      />
      <label className="relative max-w-sm">
        <SearchIcon
          size={16}
          className="absolute top-2.5 left-3 text-zinc-400"
        />
        <AdminInput
          aria-label="Rechercher une ligue"
          placeholder="Rechercher une ligue"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </label>
      {loading && !data ? <Spinner /> : null}
      {data ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Ligue</AdminTh>
              <AdminTh>Visibilité</AdminTh>
              <AdminTh>Propriétaire</AdminTh>
              <AdminTh className="text-right">Membres</AdminTh>
              <AdminTh>Créée le</AdminTh>
            </tr>
          </thead>
          <tbody>
            {leagues.map((league) => (
              <tr key={league.id} className="hover:bg-zinc-50">
                <AdminTd>
                  <Link
                    to={paths.league(league.id)}
                    className="font-semibold no-underline"
                  >
                    {league.name}
                  </Link>
                </AdminTd>
                <AdminTd>
                  {league.visibility === LeagueVisibility.Private ? (
                    <AdminBadge>
                      <LockIcon size={12} />
                      Privée
                    </AdminBadge>
                  ) : (
                    <AdminBadge tone="primary">Publique</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd>
                  {league.members.find((member) => member.id === league.ownerId)
                    ?.pseudo ?? '—'}
                </AdminTd>
                <AdminTd className="text-right tabular-nums">
                  {league.memberCount}
                </AdminTd>
                <AdminTd className="whitespace-nowrap">
                  {formatDay(league.createdAt)}
                </AdminTd>
              </tr>
            ))}
            {leagues.length === 0 ? (
              <tr>
                <AdminTd colSpan={5} className="text-center text-zinc-500">
                  Aucune ligue.
                </AdminTd>
              </tr>
            ) : null}
          </tbody>
        </AdminTable>
      ) : null}
    </>
  );
}
