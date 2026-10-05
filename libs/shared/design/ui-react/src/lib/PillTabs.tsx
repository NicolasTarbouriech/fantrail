import type { ReactNode } from 'react';

import { cx } from './cx';

export type PillTab = {
  id: string;
  label: ReactNode;
  selected: boolean;
  onSelect: () => void;
};

export type PillTabsProps = {
  label: string;
  tabs: PillTab[];
  compact?: boolean;
  className?: string;
};

export function PillTabs({ label, tabs, compact, className }: PillTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx('grid gap-2', className)}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.selected}
          onClick={tab.onSelect}
          className={cx(
            'font-display flex cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-ink font-extrabold tracking-wide uppercase',
            compact ? 'h-9 text-[15px]' : 'h-11 text-lg',
            tab.selected ? 'bg-ink text-white' : 'bg-white text-ink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
