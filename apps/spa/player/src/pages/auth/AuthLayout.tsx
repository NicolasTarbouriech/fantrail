import type { ReactNode } from 'react';

export type AuthLayoutProps = {
  children: ReactNode;
};

/** One column on phones, a centered card from tablets up. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex grow flex-col md:items-center md:justify-center md:px-6 md:py-12">
      <div className="flex w-full grow flex-col gap-6 px-5 pt-4 pb-8 md:max-w-md md:grow-0 md:rounded-[22px] md:border-2 md:border-ink md:bg-white md:px-8 md:pt-6 md:pb-8 md:shadow-[0_6px_0_var(--color-ink)]">
        <span className="font-display text-primary flex h-11 items-center text-[30px] font-black tracking-[0.04em]">
          FANTRAIL
        </span>
        {children}
      </div>
    </main>
  );
}
