import { Link } from 'react-router-dom';

import { ChevronRightIcon, WarningIcon } from '@trail/shared/design/ui-react';

export type WithdrawnAlertItem = {
  id: string;
  runnerName: string;
  context: string;
  to: string;
};

export type WithdrawnAlertProps = {
  items: WithdrawnAlertItem[];
};

export function WithdrawnAlert({ items }: WithdrawnAlertProps) {
  if (items.length === 0) {
    return null;
  }
  const title =
    items.length > 1
      ? `${items.length} coureurs retirés : ces picks valent 0 point`
      : '1 coureur retiré : ce pick vaut 0 point';
  return (
    <section
      aria-label="Coureurs retirés"
      className="border-alert bg-alert-soft flex flex-col gap-2 rounded-[14px] border-2 border-dashed p-3"
    >
      <div className="flex items-center gap-2">
        <WarningIcon className="text-alert shrink-0" />
        <span className="text-sm font-bold">{title}</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              className="text-ink flex min-h-11 items-center gap-2.5 rounded-[10px] bg-white px-2.5 no-underline"
            >
              <span className="flex grow flex-col">
                <span className="text-sm font-bold">{item.runnerName}</span>
                <span className="text-muted text-xs">{item.context}</span>
              </span>
              <span className="text-alert text-[13px] font-bold">
                Remplacer
              </span>
              <ChevronRightIcon size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
