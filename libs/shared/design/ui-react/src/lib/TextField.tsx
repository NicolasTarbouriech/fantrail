import type { InputHTMLAttributes, ReactNode } from 'react';

import { cx } from './cx';

export type InputTone = 'default' | 'code' | 'chrono';

const TONE_CLASSES: Record<InputTone, string> = {
  default:
    'h-12 rounded-xl border-2 border-ink bg-white px-3.5 text-base text-ink',
  code: 'font-display h-12 rounded-xl border-2 border-ink bg-white px-3.5 text-[22px] font-extrabold tracking-[0.12em] text-ink uppercase',
  chrono:
    'font-display h-[52px] w-[120px] rounded-xl border-2 border-ink bg-ink px-2.5 text-center text-[34px] font-black tracking-wide text-highlight',
};

export function inputClasses(tone: InputTone = 'default'): string {
  return cx(
    'min-w-0 placeholder:text-faded focus:outline-3 focus:outline-offset-1 focus:outline-primary',
    TONE_CLASSES[tone],
  );
}

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  tone?: InputTone;
};

export function TextField({
  id,
  label,
  hint,
  error,
  tone,
  className,
  ...props
}: TextFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClasses(tone)}
        {...props}
      />
      {error ? (
        <span id={`${id}-error`} className="text-alert text-xs font-semibold">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-muted text-xs">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
