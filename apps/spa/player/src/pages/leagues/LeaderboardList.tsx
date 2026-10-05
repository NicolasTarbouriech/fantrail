import { LeaderboardRow } from '@trail/modules-frontend';
import { Card } from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';

export type LeaderboardListEntry = {
  rank: number;
  userId: string;
  total: number;
  scoredFieldCount: number;
  player: { pseudo: string };
};

export type LeaderboardListProps = {
  entries: LeaderboardListEntry[];
  myUserId: string;
  limit?: number;
};

export function LeaderboardList({
  entries,
  myUserId,
  limit,
}: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <Card variant="dashed" className="text-muted p-4 text-center text-sm">
        Personne n’a encore marqué de points.
      </Card>
    );
  }
  const visible = limit ? entries.slice(0, limit) : entries;
  const mine = entries.find((entry) => entry.userId === myUserId);
  const showMineBelow = mine && !visible.includes(mine);
  return (
    <>
      <ol className="m-0 flex list-none flex-col gap-[9px] p-0">
        {visible.map((entry) => (
          <LeaderboardRow
            key={entry.userId}
            rank={entry.rank}
            pseudo={entry.player.pseudo}
            total={entry.total}
            isMe={entry.userId === myUserId}
            hasScored={entry.scoredFieldCount > 0}
            to={entry.userId === myUserId ? paths.scores : undefined}
            caption={entry.userId === myUserId ? 'Voir mes scores' : undefined}
          />
        ))}
      </ol>
      {showMineBelow ? (
        <ol className="m-0 flex list-none flex-col p-0" aria-label="Ma place">
          <LeaderboardRow
            rank={mine.rank}
            pseudo={mine.player.pseudo}
            total={mine.total}
            isMe
            hasScored={mine.scoredFieldCount > 0}
            to={paths.scores}
            caption="Voir mes scores"
          />
        </ol>
      ) : null}
      {limit && entries.length > limit ? (
        <span className="text-muted self-center text-[13px]">
          … et {entries.length - limit} autres joueurs
        </span>
      ) : null}
    </>
  );
}
