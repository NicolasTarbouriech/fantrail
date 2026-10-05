import type { ButtonHTMLAttributes } from 'react';

import { cx } from './cx';

export type ButtonVariant =
  | 'cta'
  | 'primary'
  | 'ink'
  | 'outline'
  | 'danger'
  | 'dangerOutline'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  cta: 'border-2 border-ink bg-highlight text-ink shadow-block-lg font-display font-black uppercase tracking-wide',
  primary: 'border-2 border-ink bg-primary text-white font-bold',
  ink: 'border-2 border-ink bg-ink text-white font-bold',
  outline: 'border-2 border-ink bg-white text-ink font-bold',
  danger:
    'border-2 border-ink bg-alert text-white shadow-block-lg font-display font-black uppercase tracking-wide',
  dangerOutline: 'border-2 border-alert bg-white text-alert font-bold',
  ghost: 'border-0 bg-transparent text-primary font-bold',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px] rounded-full',
  md: 'h-12 px-4 text-sm rounded-xl',
  lg: 'h-14 px-5 text-[22px] rounded-2xl',
};

export function buttonClasses({
  variant = 'outline',
  size = 'md',
  block = false,
}: ButtonStyleProps = {}): string {
  return cx(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 text-center no-underline disabled:cursor-default disabled:opacity-60',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    block && 'w-full',
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps;

export function Button({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, block }), className)}
      {...props}
    />
  );
}
