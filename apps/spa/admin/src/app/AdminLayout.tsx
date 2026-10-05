import { useApolloClient } from '@apollo/client';
import type { ComponentType } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { getInitial } from '@trail/modules-frontend';
import {
  type IconProps,
  LogOutIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
  cx,
} from '@trail/shared/design/ui-react';
import { adminButtonClasses } from '@trail/shared/design/ui-react-admin';

import { useCurrentAdmin } from '../auth/CurrentAdmin';
import { useRequireAdminMutateLogoutMutation } from '../services/graphql';
import { PLAYER_APP_URL, paths } from './paths';

const NAV_ITEMS: Array<{
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
}> = [
  { label: 'Courses', to: paths.races, icon: TrophyIcon },
  { label: 'Ligues', to: paths.leagues, icon: UsersIcon },
  { label: 'Joueurs', to: paths.players, icon: UserIcon },
];

function navClasses({ isActive }: { isActive: boolean }): string {
  return cx(
    'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm no-underline whitespace-nowrap',
    isActive
      ? 'bg-zinc-100 font-semibold text-zinc-950'
      : 'font-medium text-zinc-600 hover:text-zinc-950',
  );
}

/** Sidebar on desktop, a top bar with the same links on tablets and phones. */
export function AdminLayout() {
  const admin = useCurrentAdmin();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [logout] = useRequireAdminMutateLogoutMutation();

  const signOut = async () => {
    await logout();
    await client.clearStore();
    navigate(paths.login, { replace: true });
  };

  const wordmark = (
    <div className="flex items-center gap-2">
      <span className="font-display text-primary text-2xl font-black tracking-[0.04em]">
        FANTRAIL
      </span>
      <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-600">
        Admin
      </span>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-white text-sm text-zinc-950 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-5 border-r border-zinc-200 bg-zinc-50 px-3 py-4 lg:flex">
        <div className="flex h-10 items-center px-2">{wordmark}</div>
        <nav aria-label="Administration" className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClasses}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 px-2">
          <span className="bg-highlight flex size-8 items-center justify-center rounded-full font-bold">
            {getInitial(admin.pseudo)}
          </span>
          <span className="flex min-w-0 grow flex-col">
            <span className="truncate font-semibold">{admin.pseudo}</span>
            <span className="text-xs text-zinc-500">Administrateur</span>
          </span>
          <button
            type="button"
            aria-label="Se déconnecter"
            onClick={signOut}
            className={adminButtonClasses('ghost', 'icon')}
          >
            <LogOutIcon size={16} />
          </button>
        </div>
      </aside>
      <header className="flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          {wordmark}
          <button
            type="button"
            onClick={signOut}
            className={adminButtonClasses('ghost', 'sm')}
          >
            <LogOutIcon size={16} />
            Déconnexion
          </button>
        </div>
        <nav
          aria-label="Administration"
          className="-mx-1 flex gap-1 overflow-x-auto"
        >
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClasses}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="flex min-w-0 flex-col">
        <div className="hidden h-14 items-center justify-end border-b border-zinc-200 px-6 lg:flex">
          <a href={PLAYER_APP_URL} className={adminButtonClasses('outline')}>
            Voir côté joueur
          </a>
        </div>
        <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
