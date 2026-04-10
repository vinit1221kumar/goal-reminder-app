"use client";

import { useMemo } from "react";
import { EventCard } from "@/components/EventCard";
import { EventForm } from "@/components/EventForm";
import { calculateEventStats, EMPTY_EVENT_STATS, useStore } from "@/store/useStore";

export function HomeScreen() {
  const events = useStore((state) => state.events);
  const dayStatuses = useStore((state) => state.dayStatuses);
  const deleteEvent = useStore((state) => state.deleteEvent);
  const hasHydrated = useStore((state) => state.hasHydrated);

  const sortedEvents = useMemo(() => {
    return [...events].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }, [events]);

  const eventStatsById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateEventStats>>();
    for (const event of events) {
      map.set(event.id, calculateEventStats(event, dayStatuses));
    }
    return map;
  }, [dayStatuses, events]);

  const totalCompleted = useMemo(() => {
    let sum = 0;
    for (const stats of eventStatsById.values()) {
      sum += stats.completedDays;
    }
    return sum;
  }, [eventStatsById]);

  if (!hasHydrated) {
    return (
      <main className="app-shell flex items-center justify-center">
        <div className="surface-card px-8 py-10 text-center">
          <div className="anim-pulse-soft mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl dark:bg-violet-950/40">
            ⏳
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your study calendar…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell flex flex-col gap-6">
      {/* ── Hero ── */}
      <header className="anim-fade-up space-y-5">
        <div className="surface-card relative overflow-hidden p-6 sm:p-8">
          {/* decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"
          />

          <div className="relative space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              <span className="anim-pulse-soft">🎯</span>
              PWA Countdown Planner
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-gradient">Plan Bold.</span>{" "}
              <span className="text-slate-900 dark:text-slate-50">Study Hard.</span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Track exams, deadlines, and milestones with a calendar that works offline — right from your phone.
            </p>
          </div>
        </div>

        {/* ── Stat chips ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="surface-card anim-fade-up anim-delay-1 anim-hover-lift flex flex-col items-center gap-1.5 p-4 text-center">
            <span className="text-2xl">🎯</span>
            <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-300">{events.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Events</p>
          </div>
          <div className="surface-card anim-fade-up anim-delay-2 anim-hover-lift flex flex-col items-center gap-1.5 p-4 text-center">
            <span className="text-2xl">✅</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalCompleted}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Days Done</p>
          </div>
          <div className="surface-card anim-fade-up anim-delay-3 anim-hover-lift flex flex-col items-center gap-1.5 p-4 text-center">
            <span className="text-2xl">📴</span>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">PWA</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Offline</p>
          </div>
        </div>
      </header>

      {/* ── Form ── */}
      <div className="anim-fade-up anim-delay-2">
        <EventForm />
      </div>

      {/* ── Events list ── */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Your events</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tap a card to view the full calendar and mark your days.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs sm:flex">
            <span className="soft-pill font-semibold text-emerald-700 dark:text-emerald-300">✅ Done</span>
            <span className="soft-pill font-semibold text-rose-700 dark:text-rose-300">❌ Missed</span>
            <span className="soft-pill font-semibold text-slate-600 dark:text-slate-300">⬜ Pending</span>
          </div>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="surface-card anim-fade-up anim-delay-2 border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <div className="anim-float mx-auto mb-4 text-5xl">🚀</div>
            <h3 className="text-xl font-bold">Nothing tracked yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Add your first exam or deadline above and start your countdown today.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {sortedEvents.map((event, index) => {
              const delayClass =
                index % 4 === 0 ? "" :
                index % 4 === 1 ? "anim-delay-1" :
                index % 4 === 2 ? "anim-delay-2" : "anim-delay-3";

              const animationClassName = [
                delayClass,
                index === 0 ? "anim-new-card" : "",
              ].filter(Boolean).join(" ");

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  stats={eventStatsById.get(event.id) ?? EMPTY_EVENT_STATS}
                  dayStatuses={dayStatuses}
                  onDeleteEvent={(targetEvent) => deleteEvent(targetEvent.id)}
                  animationClassName={animationClassName}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
