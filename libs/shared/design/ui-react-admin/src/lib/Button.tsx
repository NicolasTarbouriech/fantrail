import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@trail/shared/design/ui-react';

export type AdminButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'dark';

export type AdminButtonSize = 'sm' | 'md' | 'icon';

const VARIANT_CLASSES: Record<AdminButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark border border-transparent',
  secondary:
    'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border border-transparent',
  outline: 'border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50',
  ghost:
    'border border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100',
  destructive: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
  dark: 'border border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800',
};

const SIZE_CLASSES: Record<AdminButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-3.5 text-sm',
  icon: 'size-8 justify-center',
};

export function adminButtonClasses(
  variant: AdminButtonVariant = 'outline',
  size: AdminButtonSize = 'md',
): string {
  return cx(
    'inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg font-medium whitespace-nowrap no-underline transition-colors disabled:cursor-default disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    variant === 'primary' && 'font-semibold',
  );
}

export type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
};

export function AdminButton({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cx(adminButtonClasses(variant, size), className)}
      {...props}
    />
  );
}
