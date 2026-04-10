type ProgressBarProps = {
  value: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  const trackColor =
    safeValue >= 80 ? "bg-emerald-100 dark:bg-emerald-950/40" :
    safeValue >= 50 ? "bg-violet-100 dark:bg-violet-950/30" :
    "bg-slate-200 dark:bg-slate-800";

  const fillGradient =
    safeValue >= 80 ? "from-emerald-500 to-teal-400" :
    safeValue >= 50 ? "from-violet-500 to-blue-500" :
    "from-blue-500 to-violet-500";

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500 dark:text-slate-400">{label ?? "Progress"}</span>
        <span className={[
          "rounded-full px-2 py-0.5 font-bold",
          safeValue >= 80
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            : safeValue >= 50
              ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        ].join(" ")}>
          {safeValue}%
        </span>
      </div>
      <div className={["h-2.5 overflow-hidden rounded-full", trackColor].join(" ")}>
        <div
          className={["h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out", fillGradient].join(" ")}
          style={{ width: `${safeValue}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
