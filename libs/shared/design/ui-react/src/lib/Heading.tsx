import type { ReactNode } from 'react';

import { cx } from './cx';

export type HeadingProps = {
  level?: 1 | 2;
  children: ReactNode;
  className?: string;
};

export function Heading({ level = 2, children, className }: HeadingProps) {
  const classes = cx(
    'font-display m-0 font-black uppercase leading-[0.95]',
    level === 1 ? 'text-[40px]' : 'text-2xl tracking-wide',
    className,
  );
  return level === 1 ? (
    <h1 className={classes}>{children}</h1>
  ) : (
    <h2 className={classes}>{children}</h2>
  );
}
