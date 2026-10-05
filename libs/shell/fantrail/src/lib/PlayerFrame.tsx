import type { ReactNode } from 'react';

export type PlayerFrameProps = {
  children: ReactNode;
};

export function PlayerFrame({ children }: PlayerFrameProps) {
  return (
    <div className="bg-ground text-ink flex min-h-dvh w-full flex-col font-sans">
      {children}
    </div>
  );
}
