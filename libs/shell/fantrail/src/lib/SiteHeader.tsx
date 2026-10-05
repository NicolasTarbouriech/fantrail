import { Link, NavLink } from 'react-router-dom';

import { cx } from '@trail/shared/design/ui-react';

import type { BottomNavItem } from './BottomNav';

export type SiteHeaderProps = {
  initial: string;
  homePath: string;
  profilePath: string;
  items: BottomNavItem[];
};

/** Top navigation from tablets up, where the bottom tab bar goes away. */
export function SiteHeader({
  initial,
  homePath,
  profilePath,
  items,
}: SiteHeaderProps) {
  return (
    <header className="border-ink sticky top-0 z-20 hidden border-b-2 bg-white md:block">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center gap-6 px-8">
        <Link
          to={homePath}
          className="font-display text-primary text-[30px] font-black tracking-[0.04em] no-underline"
        >
          FANTRAIL
        </Link>
        <nav
          aria-label="Navigation principale"
          className="flex grow items-center gap-1"
        >
          {items.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cx(
                  'flex h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold no-underline',
                  isActive
                    ? 'border-ink bg-ink text-white'
                    : 'text-muted hover:text-ink border-transparent',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to={profilePath}
          aria-label="Mon profil"
          className="border-ink bg-highlight text-ink font-display flex size-11 items-center justify-center rounded-full border-2 text-[22px] font-black no-underline"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
