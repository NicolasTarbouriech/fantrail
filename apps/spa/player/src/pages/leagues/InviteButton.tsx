import { useState } from 'react';

import { buildInviteLink } from '@trail/modules-frontend';
import { Button, CopyIcon } from '@trail/shared/design/ui-react';

export type InviteButtonProps = {
  leagueName: string;
  inviteCode: string;
};

export function InviteButton({ leagueName, inviteCode }: InviteButtonProps) {
  const [copied, setCopied] = useState(false);
  const link = buildInviteLink(window.location.origin, inviteCode);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rejoins ${leagueName} sur Fantrail`,
          text: `Viens pronostiquer avec nous dans ${leagueName} : code ${inviteCode}`,
          url: link,
        });
        return;
      } catch {
        // Share sheet dismissed: fall back to the clipboard.
      }
    }
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex items-center gap-2.5">
      <Button
        variant="cta"
        className="h-11 grow rounded-xl text-lg"
        onClick={share}
      >
        <CopyIcon size={18} />
        {copied ? 'Lien copié !' : 'Inviter des potes'}
      </Button>
      <span className="font-display -rotate-3 rounded-[10px] border-2 border-dashed border-white px-2.5 py-1.5 text-lg font-black tracking-[0.08em]">
        {inviteCode}
      </span>
    </div>
  );
}
