import type { ReactNode } from 'react';

import { iconButtonClasses } from './IconButton';
import { CloseIcon } from './icons';

export type SheetProps = {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
  children: ReactNode;
};

/** Bottom sheet on phones, centered dialog from tablets up. */
export function Sheet({
  open,
  title,
  subtitle,
  closeLabel = 'Fermer',
  onClose,
  children,
}: SheetProps) {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center md:p-6">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-[rgba(14,19,48,0.55)]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="bg-ground border-ink relative mt-auto flex max-h-[85vh] w-full flex-col gap-3 rounded-t-[26px] border-t-2 px-5 pt-2.5 pb-5 md:my-auto md:max-h-[80vh] md:max-w-lg md:rounded-[26px] md:border-2 md:pt-5 md:shadow-[0_6px_0_var(--color-ink)]"
      >
        <span className="bg-line-strong h-[5px] w-11 self-center rounded-full md:hidden" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <h2 className="font-display m-0 text-[32px] leading-none font-black uppercase">
              {title}
            </h2>
            {subtitle ? (
              <span className="text-muted text-[13px]">{subtitle}</span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className={iconButtonClasses()}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="-mx-1 flex flex-col gap-2 overflow-y-auto px-1 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}
