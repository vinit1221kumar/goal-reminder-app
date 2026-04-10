"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  getDatesInRange,
  getTodayKey,
  isPastDate,
  parseDateKey,
} from "@/utils/dateHelpers";
import type { DayStatus } from "@/store/useStore";

type CalendarGridProps = {
  eventId: string;
  startDate: string;
  endDate: string;
  dayStatuses: DayStatus[];
  onToggleDayStatus?: (eventId: string, date: string) => void;
  onSetDayStatus?: (
    eventId: string,
    date: string,
    status: "completed" | "missed" | "pending",
  ) => void;
  compact?: boolean;
  interactive?: boolean;
  maxDays?: number;
};

export function CalendarGrid({
  eventId,
  startDate,
  endDate,
  dayStatuses,
  onToggleDayStatus,
  onSetDayStatus,
  compact = false,
  interactive = true,
  maxDays,
}: CalendarGridProps) {
  const today = getTodayKey();

  const dates = useMemo(() => {
    const allDates = getDatesInRange(startDate, endDate);
    return typeof maxDays === "number" ? allDates.slice(0, maxDays) : allDates;
  }, [endDate, maxDays, startDate]);

  const statusMap = useMemo(() => {
    return new Map(
      dayStatuses
        .filter((status) => status.eventId === eventId)
        .map((status) => [status.date, status.status]),
    );
  }, [dayStatuses, eventId]);

  return (
    <div className="space-y-3">
      <div
        className={[
          "grid gap-2",
          compact
            ? "grid-cols-7 gap-1"
            : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7",
        ].join(" ")}
      >
        {dates.map((date) => {
          const stored = statusMap.get(date);
          const status = isPastDate(date, today)
            ? stored === "completed"
              ? "completed"
              : "missed"
            : stored === "completed"
              ? "completed"
              : stored === "missed"
                ? "missed"
              : "pending";

          const dateLabel = compact
            ? format(parseDateKey(date), "dd/MM")
            : format(parseDateKey(date), "dd/MM/yyyy");

          const styles =
            status === "completed"
              ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 dark:border-emerald-900/60 dark:from-emerald-950/45 dark:to-emerald-900/35 dark:text-emerald-200"
              : status === "missed"
                ? "border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 dark:border-rose-900/60 dark:from-rose-950/45 dark:to-rose-900/35 dark:text-rose-200"
                : "border-slate-200 bg-slate-50/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300";

          const canEdit = interactive && !isPastDate(date, today);
          const isToggleable = canEdit && typeof onToggleDayStatus === "function";

          return (
              <div
              key={date}
              role={isToggleable ? "button" : undefined}
              aria-pressed={isToggleable ? status === "completed" : undefined}
              aria-disabled={!canEdit}
              tabIndex={isToggleable ? 0 : -1}
              onClick={() => {
                if (!isToggleable) return;
                onToggleDayStatus(eventId, date);
              }}
              onKeyDown={(event) => {
                if (!isToggleable) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onToggleDayStatus(eventId, date);
              }}
              className={[
                "group anim-press rounded-2xl border p-3 text-left shadow-sm transition duration-200",
                "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
                canEdit
                  ? "cursor-pointer"
                  : "cursor-not-allowed hover:translate-y-0 hover:shadow-sm",
                isToggleable ? "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900" : "",
                compact ? "min-h-14 p-2.5" : "min-h-32 p-3",
                styles,
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    compact
                      ? "text-[11px] font-semibold leading-none"
                      : "text-[11px] font-semibold uppercase leading-tight tracking-[0.14em]"
                  }
                >
                  {dateLabel}
                </span>
                <span className="text-base" aria-hidden>
                  {status === "completed" ? "✅" : status === "missed" ? "❌" : "⬜"}
                </span>
              </div>
              {!compact && (
                <p className="mt-2 text-xs leading-5 text-current/70">
                  {status === "completed"
                    ? "Completed"
                    : status === "missed"
                      ? "Missed"
                      : isPastDate(date, today)
                        ? "Locked"
                        : "Tap to complete"}
                </p>
              )}

              {!compact && canEdit && onSetDayStatus ? (
                <div className="mt-3 grid w-full grid-cols-2 gap-1.5">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSetDayStatus(
                        eventId,
                        date,
                        status === "completed" ? "pending" : "completed",
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      event.stopPropagation();
                      onSetDayStatus(
                        eventId,
                        date,
                        status === "completed" ? "pending" : "completed",
                      );
                    }}
                    className={[
                      "flex min-w-0 items-center justify-center rounded-lg border px-2 py-1 text-[11px] font-semibold leading-none transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                      status === "completed"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/25 dark:text-emerald-300 dark:hover:bg-emerald-950/45",
                    ].join(" ")}
                    aria-label={
                      status === "completed"
                        ? `Clear completed status for ${date}`
                        : `Mark ${date} as completed`
                    }
                  >
                    {status === "completed" ? "↺ Clear" : "✅ Done"}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSetDayStatus(
                        eventId,
                        date,
                        status === "missed" ? "pending" : "missed",
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      event.stopPropagation();
                      onSetDayStatus(
                        eventId,
                        date,
                        status === "missed" ? "pending" : "missed",
                      );
                    }}
                    className={[
                      "flex min-w-0 items-center justify-center rounded-lg border px-2 py-1 text-[11px] font-semibold leading-none transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                      status === "missed"
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/25 dark:text-rose-300 dark:hover:bg-rose-950/45",
                    ].join(" ")}
                    aria-label={
                      status === "missed"
                        ? `Clear missed status for ${date}`
                        : `Mark ${date} as missed`
                    }
                  >
                    {status === "missed" ? "↺ Clear" : "❌ Miss"}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {typeof maxDays === "number" && dates.length === maxDays ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mini view shows the first {maxDays} days of this event.
        </p>
      ) : null}
    </div>
  );
}
