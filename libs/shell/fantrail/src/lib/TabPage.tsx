import type { ReactNode } from 'react';

import {
  HomeIcon,
  MountainIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from '@trail/shared/design/ui-react';

import { BottomNav, type BottomNavItem } from './BottomNav';
import { SiteHeader } from './SiteHeader';
import { TopBar } from './TopBar';

export type TabPagePaths = {
  home: string;
  races: string;
  leagues: string;
  scores: string;
  profile: string;
};

export function getTabItems(paths: TabPagePaths): BottomNavItem[] {
  return [
    { label: 'Accueil', to: paths.home, icon: HomeIcon, end: true },
    { label: 'Courses', to: paths.races, icon: MountainIcon, end: true },
    { label: 'Ligues', to: paths.leagues, icon: UsersIcon },
    { label: 'Mes scores', to: paths.scores, icon: TrophyIcon },
    { label: 'Profil', to: paths.profile, icon: UserIcon },
  ];
}

export type PlayerLayoutProps = {
  initial: string;
  paths: TabPagePaths;
  children: ReactNode;
};

/** Every signed-in page: the top navigation from tablets up. */
export function PlayerLayout({ initial, paths, children }: PlayerLayoutProps) {
  return (
    <>
      <SiteHeader
        initial={initial}
        homePath={paths.home}
        profilePath={paths.profile}
        items={getTabItems(paths)}
      />
      {children}
    </>
  );
}

export type TabPageProps = {
  initial: string;
  paths: TabPagePaths;
  children: ReactNode;
};

/** A page of the tab bar: wordmark and tabs on phones, content only from tablets up. */
export function TabPage({ initial, paths, children }: TabPageProps) {
  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl grow flex-col gap-[18px] px-5 pt-4 pb-6 md:gap-6 md:px-8 md:pt-10 md:pb-12">
        <div className="md:hidden">
          <TopBar
            initial={initial}
            profilePath={paths.profile}
            homePath={paths.home}
          />
        </div>
        {children}
      </main>
      <div className="sticky bottom-0 z-10 md:hidden">
        <BottomNav items={getTabItems(paths)} />
      </div>
    </>
  );
}
