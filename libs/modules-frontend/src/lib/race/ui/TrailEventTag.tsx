import { cx } from '@trail/shared/design/ui-react';

export type TrailEventTagProps = {
  name: string;
  logoUrl: string | null;
  className?: string;
};

/** White pill so that any logo reads on the blue and ink headers. */
export function TrailEventTag({
  name,
  logoUrl,
  className,
}: TrailEventTagProps) {
  return (
    <span
      className={cx(
        'border-ink text-ink inline-flex h-7 max-w-full min-w-0 shrink-0 items-center gap-1.5 self-start rounded-full border-2 bg-white pr-2.5 text-[11px] leading-none font-bold tracking-wide uppercase',
        logoUrl ? 'pl-0.5' : 'pl-2.5',
        className,
      )}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="size-[22px] shrink-0 rounded-full bg-white object-contain"
        />
      ) : null}
      <span className="truncate">{name}</span>
    </span>
  );
}
