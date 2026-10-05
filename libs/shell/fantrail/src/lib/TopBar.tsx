import { Link } from 'react-router-dom';

export type TopBarProps = {
  initial: string;
  profilePath: string;
  homePath: string;
};

export function TopBar({ initial, profilePath, homePath }: TopBarProps) {
  return (
    <div className="flex h-11 items-center justify-between">
      <Link
        to={homePath}
        className="font-display text-primary text-[30px] font-black tracking-[0.04em] no-underline"
      >
        FANTRAIL
      </Link>
      <Link
        to={profilePath}
        aria-label="Mon profil"
        className="border-ink bg-highlight text-ink font-display flex size-11 items-center justify-center rounded-full border-2 text-[22px] font-black no-underline"
      >
        {initial}
      </Link>
    </div>
  );
}
