import { Button, LogOutIcon, Sheet } from '@trail/shared/design/ui-react';

export type LeaveLeagueSheetProps = {
  open: boolean;
  leagueName: string;
  isPrivate: boolean;
  isLeaving: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

export function LeaveLeagueSheet({
  open,
  leagueName,
  isPrivate,
  isLeaving,
  error,
  onConfirm,
  onClose,
}: LeaveLeagueSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={`Quitter ${leagueName} ?`}>
      <span className="border-ink bg-alert-soft text-alert shadow-sticker flex size-14 -rotate-3 items-center justify-center rounded-[14px] border-2">
        <LogOutIcon size={28} />
      </span>
      <ul className="m-0 flex flex-col gap-1.5 pl-[18px] text-sm leading-snug">
        <li>Tu disparais de son classement.</li>
        <li>
          Tes pronos et tes points restent dans tes autres ligues et dans la
          Communauté.
        </li>
        <li>
          {isPrivate
            ? 'Pour revenir, il te faudra le code d’invitation.'
            : 'Tu pourras la rejoindre de nouveau depuis la liste des ligues publiques.'}
        </li>
      </ul>
      {error ? (
        <p role="alert" className="text-alert m-0 text-sm font-semibold">
          {error}
        </p>
      ) : null}
      <div className="mt-1 flex flex-col gap-2.5">
        <Button
          variant="danger"
          size="lg"
          block
          onClick={onConfirm}
          disabled={isLeaving}
        >
          Quitter la ligue
        </Button>
        <Button
          variant="outline"
          size="lg"
          block
          className="text-[15px]"
          onClick={onClose}
        >
          Rester dans la ligue
        </Button>
      </div>
    </Sheet>
  );
}
