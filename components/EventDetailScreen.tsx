"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { calculateEventStats, EMPTY_EVENT_STATS, useStore } from "@/store/useStore";
import { formatReadableDate, getTodayKey } from "@/utils/dateHelpers";

type EventDetailScreenProps = {
  eventId: string;
};

export function EventDetailScreen({ eventId }: EventDetailScreenProps) {
  const router = useRouter();
  const event = useStore((state) => state.events.find((item) => item.id === eventId));
  const dayStatuses = useStore((state) => state.dayStatuses);
  const updateDayStatus = useStore((state) => state.updateDayStatus);
  const setDayStatus = useStore((state) => state.setDayStatus);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const hasHydrated = useStore((state) => state.hasHydrated);

  const today = getTodayKey();

  const title = useMemo(() => event?.title ?? "Event details", [event?.title]);
  const stats = useMemo(() => {
    if (!event) return EMPTY_EVENT_STATS;
    return calculateEventStats(event, dayStatuses);
  }, [dayStatuses, event]);

  if (!hasHydrated) {
    return (
      <main className="app-shell flex items-center justify-center">
        <div className="surface-card px-8 py-10 text-center">
          <div className="anim-pulse-soft mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl dark:bg-violet-950/40">
            ⏳
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading event…</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="app-shell flex max-w-4xl items-center justify-center">
        <div className="surface-card w-full p-8 text-center">
          <div className="mx-auto mb-4 text-5xl">🔍</div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Not found
          </p>
          <h1 className="mt-2 text-2xl font-bold">This event no longer exists.</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Go back to the home page to create a new countdown.
          </p>
          <Link href="/" className="btn-primary mt-6">
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  const isEnded = event.endDate < today;

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete "${event.title}"? This cannot be undone.`);
    if (!confirmed) return;
    deleteEvent(event.id);
    router.push("/");
  };

  return (
    <main className="app-shell flex flex-col gap-6">
      {/* ── Nav ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="soft-pill anim-press text-sm font-bold text-violet-700 dark:text-violet-300">
          ← Back to events
        </Link>
        <button type="button" onClick={handleDelete} className="btn-secondary anim-press">
          Delete event
        </button>
      </div>

      {/* ── Hero card ── */}
      <section className="surface-card anim-fade-up relative overflow-hidden p-5 sm:p-7">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl"
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              🎯 Event detail
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {formatReadableDate(event.startDate)} → {formatReadableDate(event.endDate)}
            </p>
          </div>

          {/* big countdown */}
          <div className={[
            "flex shrink-0 flex-col items-center justify-center rounded-3xl p-5 text-center lg:w-40",
            isEnded
              ? "bg-slate-100 dark:bg-slate-800/60"
              : stats.daysLeft <= 3
                ? "bg-rose-50 dark:bg-rose-950/40"
                : stats.daysLeft <= 7
                  ? "bg-amber-50 dark:bg-amber-950/40"
                  : "bg-violet-50 dark:bg-violet-950/40",
          ].join(" ")}>
            <p className={[
              "anim-count-up text-5xl font-extrabold leading-none tracking-tight",
              isEnded
                ? "text-slate-500 dark:text-slate-400"
                : stats.daysLeft <= 3
                  ? "text-rose-600 dark:text-rose-400"
                  : stats.daysLeft <= 7
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-gradient",
            ].join(" ")}>
              {isEnded ? "✓" : stats.daysLeft}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {isEnded ? "Ended" : stats.daysLeft === 0 ? "Due today!" : "days left"}
            </p>
            {stats.streak > 0 && (
              <p className="mt-2 rounded-full bg-white/60 px-2 py-0.5 text-xs font-bold text-orange-600 dark:bg-slate-700/60 dark:text-orange-400">
                {stats.streak} 🔥 streak
              </p>
            )}
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="relative mt-6 space-y-5">
          <ProgressBar value={stats.progress} label="Overall completion" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{stats.completedDays}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70">
                Completed
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-900/60 dark:bg-rose-950/40">
              <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{stats.missedDays}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-rose-600/70 dark:text-rose-400/70">
                Missed
              </p>
            </div>
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center dark:border-violet-900/60 dark:bg-violet-950/40">
              <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-300">{stats.remainingDays}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-violet-600/70 dark:text-violet-400/70">
                Remaining
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">{stats.totalDays}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calendar ── */}
      <section className="surface-card anim-fade-up anim-delay-1 p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Daily calendar</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tap today or future days to toggle between completed and pending.
            </p>
          </div>
          <div className="hidden flex-wrap gap-2 text-xs sm:flex">
            <span className="soft-pill font-semibold text-emerald-700 dark:text-emerald-300">✅ Done</span>
            <span className="soft-pill font-semibold text-rose-700 dark:text-rose-300">❌ Missed</span>
            <span className="soft-pill font-semibold text-slate-600 dark:text-slate-300">⬜ Pending</span>
          </div>
        </div>

        <CalendarGrid
          eventId={event.id}
          startDate={event.startDate}
          endDate={event.endDate}
          dayStatuses={dayStatuses}
          onToggleDayStatus={updateDayStatus}
          onSetDayStatus={setDayStatus}
          compact={false}
          interactive
        />
      </section>
    </main>
  );
}
