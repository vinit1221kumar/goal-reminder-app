"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CalendarGrid } from "@/components/CalendarGrid";
import { ProgressBar } from "@/components/ProgressBar";
import type { DayStatus, EventItem, EventStats } from "@/store/useStore";
import { formatReadableDate, getTodayKey } from "@/utils/dateHelpers";

type EventCardProps = {
  event: EventItem;
  stats: EventStats;
  dayStatuses: DayStatus[];
  onDeleteEvent: (event: EventItem) => void;
  animationClassName?: string;
};

type Urgency = "ended" | "critical" | "warning" | "normal";

const urgencyConfig: Record<Urgency, {
  border: string;
  badge: string;
  countdownBg: string;
  countdownText: string;
  emoji: string;
}> = {
  ended: {
    border: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    countdownBg: "bg-slate-100 dark:bg-slate-800/60",
    countdownText: "text-slate-700 dark:text-slate-200",
    emoji: "✓",
  },
  critical: {
    border: "border-l-rose-500",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    countdownBg: "bg-rose-50 dark:bg-rose-950/40",
    countdownText: "text-rose-700 dark:text-rose-300",
    emoji: "🔥",
  },
  warning: {
    border: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    countdownBg: "bg-amber-50 dark:bg-amber-950/40",
    countdownText: "text-amber-700 dark:text-amber-300",
    emoji: "⚡",
  },
  normal: {
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    countdownBg: "bg-violet-50 dark:bg-violet-950/40",
    countdownText: "text-violet-700 dark:text-violet-300",
    emoji: "📅",
  },
};

export function EventCard({
  event,
  stats,
  dayStatuses,
  onDeleteEvent,
  animationClassName = "",
}: EventCardProps) {
  const today = getTodayKey();
  const createdAt = format(new Date(event.createdAt), "MMM d, yyyy");

  const urgency: Urgency =
    event.endDate < today ? "ended" :
    stats.daysLeft <= 3 ? "critical" :
    stats.daysLeft <= 7 ? "warning" :
    "normal";

  const cfg = urgencyConfig[urgency];

  const streakLabel = stats.streak > 0 ? `${stats.streak} 🔥` : "—";

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete "${event.title}"? This cannot be undone.`);
    if (!confirmed) return;
    onDeleteEvent(event);
  };

  return (
    <article
      className={[
        "surface-card anim-fade-up anim-hover-lift overflow-hidden border-l-4 transition",
        cfg.border,
        animationClassName,
      ].join(" ")}
    >
      <Link href={`/event/${event.id}`} className="block p-4 sm:p-5">
        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <span className={["inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest", cfg.badge].join(" ")}>
              {cfg.emoji} {urgency === "ended" ? "Ended" : urgency === "critical" ? "Critical" : urgency === "warning" ? "Soon" : "Active"}
            </span>
            <div className="mt-2 rounded-2xl border border-slate-300/80 bg-white px-3 py-2 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/70">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Event name
              </p>
              <h3 className="mt-1 text-[1.05rem] font-black leading-snug tracking-tight text-slate-950 break-words whitespace-normal dark:text-white sm:text-[1.15rem]">
                {event.title || "Untitled event"}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Due {formatReadableDate(event.endDate)}
            </p>
          </div>

          {/* countdown badge */}
          <div className={["anim-pulse-soft shrink-0 rounded-2xl px-3.5 py-2.5 text-center", cfg.countdownBg].join(" ")}>
            <p className={["text-xl font-extrabold leading-none tracking-tight", cfg.countdownText].join(" ")}>
              {event.endDate < today ? "✓" : stats.daysLeft === 0 ? "0" : stats.daysLeft}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {event.endDate < today ? "done" : stats.daysLeft === 0 ? "today" : "days"}
            </p>
          </div>
        </div>

        {/* ── Progress + stats ── */}
        <div className="mt-4 space-y-3">
          <ProgressBar value={stats.progress} label="Completion" />

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-xl bg-emerald-50 px-2 py-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <p className="text-base font-extrabold">{stats.completedDays}</p>
              <p className="font-medium">Done</p>
            </div>
            <div className="rounded-xl bg-rose-50 px-2 py-2 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <p className="text-base font-extrabold">{stats.missedDays}</p>
              <p className="font-medium">Missed</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-2 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="text-base font-extrabold">{stats.totalDays}</p>
              <p className="font-medium">Total</p>
            </div>
            <div className="rounded-xl bg-violet-50 px-2 py-2 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <p className="text-base font-extrabold">{streakLabel}</p>
              <p className="font-medium">Streak</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">Created {createdAt}</p>
        </div>
      </Link>

      {/* ── Mini calendar footer ── */}
      <div className="border-t border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/30 sm:p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Mini calendar
        </p>
        <CalendarGrid
          eventId={event.id}
          startDate={event.startDate}
          endDate={event.endDate}
          dayStatuses={dayStatuses}
          compact
          interactive={false}
          maxDays={14}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link href={`/event/${event.id}`} className="btn-primary anim-press">
            Open details
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-secondary anim-press"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
