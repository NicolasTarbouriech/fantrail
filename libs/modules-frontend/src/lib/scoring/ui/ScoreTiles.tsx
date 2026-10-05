import { formatPoints } from '../../league/mappers';

export type ScoreTilesProps = {
  tiles: Array<{ label: string; points: number }>;
};

export function ScoreTiles({ tiles }: ScoreTilesProps) {
  return (
    <dl className="m-0 grid grid-cols-3 gap-2">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="border-ink flex flex-col-reverse items-center rounded-[14px] border-2 bg-white px-1.5 py-2.5"
        >
          <dt className="text-muted text-xs font-bold tracking-wide uppercase">
            {tile.label}
          </dt>
          <dd className="font-display m-0 text-[28px] font-black">
            {formatPoints(tile.points)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
