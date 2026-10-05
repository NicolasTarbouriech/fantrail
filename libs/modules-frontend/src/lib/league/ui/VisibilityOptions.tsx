import { LeagueVisibility } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { cx } from '@trail/shared/design/ui-react';

const OPTIONS = [
  {
    value: LeagueVisibility.Private,
    title: 'Privée',
    description:
      'Sur invitation : tu partages un lien ou un code. Seuls les membres voient le classement.',
  },
  {
    value: LeagueVisibility.Public,
    title: 'Publique',
    description:
      'Visible dans la liste des ligues, tout joueur la rejoint en un clic et voit le classement.',
  },
];

export type VisibilityOptionsProps = {
  name: string;
  value: LeagueVisibility;
  onChange: (value: LeagueVisibility) => void;
};

export function VisibilityOptions({
  name,
  value,
  onChange,
}: VisibilityOptionsProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className={cx(
            'flex cursor-pointer items-start gap-3 rounded-[14px] border-2 p-3.5',
            value === option.value
              ? 'border-ink bg-primary-soft shadow-block'
              : 'border-line-strong bg-white',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="accent-primary mt-0.5 size-5"
          />
          <span className="flex flex-col gap-1">
            <span className="font-display text-[22px] leading-none font-black uppercase">
              {option.title}
            </span>
            <span className="text-muted text-[13px] leading-snug">
              {option.description}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
