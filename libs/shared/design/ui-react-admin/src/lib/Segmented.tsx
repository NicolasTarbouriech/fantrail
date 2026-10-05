import { cx } from '@trail/shared/design/ui-react';

/** Classes for one item of a segmented control, links or buttons alike. */
export function adminSegmentClasses(isActive: boolean): string {
  return cx(
    'inline-flex h-8 cursor-pointer items-center rounded-md border-0 px-3 text-sm whitespace-nowrap no-underline',
    isActive
      ? 'bg-white font-semibold text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
      : 'bg-transparent font-medium text-zinc-500 hover:text-zinc-900',
  );
}

export const ADMIN_SEGMENTED_GROUP_CLASSES =
  'inline-flex max-w-full gap-1 self-start overflow-x-auto rounded-[10px] bg-zinc-100 p-1';
