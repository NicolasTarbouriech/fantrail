import type { ButtonHTMLAttributes } from 'react';

import { cx } from './cx';

export type IconButtonTone = 'white' | 'highlight';

export function iconButtonClasses(tone: IconButtonTone = 'white'): string {
  return cx(
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-ink text-ink',
    tone === 'white' ? 'bg-white' : 'bg-highlight',
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: IconButtonTone;
};

export function IconButton({
  label,
  tone,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(iconButtonClasses(tone), className)}
      {...props}
    />
  );
}
