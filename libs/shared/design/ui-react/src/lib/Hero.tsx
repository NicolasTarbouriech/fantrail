import type { ReactNode } from 'react';

import { cx } from './cx';

export type HeroTone = 'primary' | 'ink';

export type HeroProps = {
  tone?: HeroTone;
  leading?: ReactNode;
  trailing?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
};

export function Hero({
  tone = 'primary',
  leading,
  trailing,
  title,
  subtitle,
  children,
}: HeroProps) {
  return (
    <header
      className={cx('text-white', tone === 'primary' ? 'bg-primary' : 'bg-ink')}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3.5 px-5 pt-5 pb-[22px] md:px-8 md:pt-8 md:pb-8">
        {leading || trailing ? (
          <div className="flex items-center justify-between gap-3">
            {leading ?? <span />}
            {trailing}
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-[44px] leading-[0.95] font-black uppercase md:text-[64px]">
            {title}
          </h1>
          {subtitle ? (
            <span
              className={cx(
                'text-[13px] font-medium md:text-[15px]',
                tone === 'primary' ? 'text-on-primary' : 'text-on-ink',
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
        {children ? (
          <div className="flex flex-col gap-3.5 md:max-w-xl">{children}</div>
        ) : null}
      </div>
    </header>
  );
}
