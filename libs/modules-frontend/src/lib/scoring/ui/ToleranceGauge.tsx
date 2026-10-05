export type ToleranceGaugeProps = {
  usage: number;
  label: string;
};

/** Share of the time tolerance the estimate used: the fuller, the fewer points. */
export function ToleranceGauge({ usage, label }: ToleranceGaugeProps) {
  const percent = Math.round(usage * 100);
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="border-ink relative h-4 overflow-hidden rounded-full border-2 bg-white"
    >
      <span
        className="bg-primary absolute inset-y-0 left-0"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
