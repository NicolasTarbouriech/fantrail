import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';

import { type IconProps, cx } from '@trail/shared/design/ui-react';

export type BottomNavItem = {
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
  end?: boolean;
};

export type BottomNavProps = {
  items: BottomNavItem[];
};

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Navigation principale"
      className="border-ink grid h-[68px] border-t-2 bg-white pb-[env(safe-area-inset-bottom)]"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cx(
              'flex flex-col items-center justify-center gap-[3px] text-xs no-underline',
              isActive ? 'text-primary font-bold' : 'text-muted font-semibold',
            )
          }
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
