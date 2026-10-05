import { Link, useNavigate } from 'react-router-dom';

import { getInitial } from '@trail/modules-frontend';
import {
  Button,
  ChevronRightIcon,
  LogOutIcon,
} from '@trail/shared/design/ui-react';
import { TabPage } from '@trail/shell/fantrail';

import { paths, tabPaths } from '../../app/paths';
import { useCurrentPlayer } from '../../auth/CurrentPlayer';
import { useAuthActions } from '../../auth/useAuthActions';

export function ProfilePage() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  return (
    <TabPage initial={getInitial(player.pseudo)} paths={tabPaths}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-[18px] md:gap-6">
        <div className="border-ink bg-primary shadow-block-lg flex flex-col items-center gap-2.5 rounded-[18px] border-2 px-4 py-[22px] text-white">
          <span className="border-ink bg-highlight text-ink font-display flex size-[84px] items-center justify-center rounded-full border-[3px] text-5xl font-black">
            {getInitial(player.pseudo)}
          </span>
          <h1 className="font-display m-0 text-[40px] leading-none font-black uppercase">
            {player.pseudo}
          </h1>
          <span className="text-on-primary text-sm">{player.email}</span>
        </div>
        <ul className="border-ink m-0 list-none overflow-hidden rounded-[14px] border-2 bg-white p-0">
          <li className="border-line flex min-h-[54px] items-center justify-between gap-3 border-b-2 px-4">
            <span className="text-muted text-sm">Pseudo</span>
            <span className="text-[15px] font-bold">{player.pseudo}</span>
          </li>
          <li className="border-line flex min-h-[54px] items-center justify-between gap-3 border-b-2 px-4">
            <span className="text-muted text-sm">Email</span>
            <span className="truncate text-[15px] font-bold">
              {player.email}
            </span>
          </li>
          <li>
            <Link
              to={paths.points}
              className="text-ink flex min-h-[54px] items-center justify-between gap-3 px-4 no-underline"
            >
              <span className="text-[15px] font-bold">
                Comment on marque des points
              </span>
              <ChevronRightIcon size={18} />
            </Link>
          </li>
        </ul>
        <Button
          variant="dangerOutline"
          size="md"
          block
          className="font-display h-[52px] rounded-[14px] text-xl font-black uppercase"
          onClick={async () => {
            await logout();
            navigate(paths.login, { replace: true });
          }}
        >
          <LogOutIcon />
          Se déconnecter
        </Button>
      </div>
    </TabPage>
  );
}
