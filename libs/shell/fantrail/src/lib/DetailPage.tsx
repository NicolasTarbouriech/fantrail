import type { ReactNode } from 'react';

export type DetailPageProps = {
  hero: ReactNode;
  children: ReactNode;
};

/** A page reached from a tab: its own hero with a back button, no tab bar. */
export function DetailPage({ hero, children }: DetailPageProps) {
  return (
    <>
      {hero}
      <main className="mx-auto flex w-full max-w-6xl grow flex-col gap-3.5 px-5 pt-4 pb-6 md:gap-6 md:px-8 md:pt-8 md:pb-12">
        {children}
      </main>
    </>
  );
}
