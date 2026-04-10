"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { format } from "date-fns";
import {
  daysUntil,
  getDatesInRange,
  getTodayKey,
  getTotalDays,
  isPastDate,
} from "@/utils/dateHelpers";

export type EventItem = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type DayStatus = {
  eventId: string;
  date: string;
  status: "completed" | "missed" | "pending";
  updatedAt: string;
};

export type EventStats = {
  totalDays: number;
  completedDays: number;
  missedDays: number;
  remainingDays: number;
  progress: number;
  streak: number;
  daysLeft: number;
};

export const EMPTY_EVENT_STATS: EventStats = {
  totalDays: 0,
  completedDays: 0,
  missedDays: 0,
  remainingDays: 0,
  progress: 0,
  streak: 0,
  daysLeft: 0,
};

type StoreState = {
  hasHydrated: boolean;
  events: EventItem[];
  dayStatuses: DayStatus[];
  setHasHydrated: (value: boolean) => void;
  addEvent: (title: string, endDate: string) => EventItem | null;
  deleteEvent: (eventId: string) => void;
  setDayStatus: (
    eventId: string,
    date: string,
    status: "completed" | "missed" | "pending",
  ) => void;
  updateDayStatus: (eventId: string, date: string) => void;
  getEventById: (eventId: string) => EventItem | undefined;
  getDayStatus: (eventId: string, date: string) => "completed" | "missed" | "pending";
  getEventStats: (eventId: string) => EventStats;
};

function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredDayStatus(
  dayStatuses: DayStatus[],
  eventId: string,
  date: string,
): DayStatus | undefined {
  return dayStatuses.find((status) => status.eventId === eventId && status.date === date);
}

function resolveDayStatus(
  dayStatuses: DayStatus[],
  event: EventItem,
  date: string,
): "completed" | "missed" | "pending" {
  const stored = getStoredDayStatus(dayStatuses, event.id, date);

  if (isPastDate(date)) {
    return stored?.status === "completed" ? "completed" : "missed";
  }

  if (stored?.status === "completed" || stored?.status === "missed") {
    return stored.status;
  }

  return "pending";
}

function calculateStats(event: EventItem, dayStatuses: DayStatus[]): EventStats {
  const dates = getDatesInRange(event.startDate, event.endDate);
  const today = getTodayKey();

  let completedDays = 0;
  let missedDays = 0;

  for (const date of dates) {
    const status = resolveDayStatus(dayStatuses, event, date);
    if (status === "completed") {
      completedDays += 1;
    } else if (status === "missed") {
      missedDays += 1;
    }
  }

  const totalDays = getTotalDays(event.startDate, event.endDate);
  const remainingDays = Math.max(totalDays - completedDays - missedDays, 0);
  const progress = totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);

  let streak = 0;
  for (let index = dates.length - 1; index >= 0; index -= 1) {
    const date = dates[index];
    const status = resolveDayStatus(dayStatuses, event, date);

    if (status === "completed") {
      streak += 1;
      continue;
    }

    if (date < today) {
      break;
    }

    break;
  }

  const daysLeft = Math.max(daysUntil(event.endDate, today), 0);

  return {
    totalDays,
    completedDays,
    missedDays,
    remainingDays,
    progress,
    streak,
    daysLeft,
  };
}

export function calculateEventStats(event: EventItem, dayStatuses: DayStatus[]): EventStats {
  return calculateStats(event, dayStatuses);
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      events: [],
      dayStatuses: [],
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addEvent: (title, endDate) => {
        const cleanedTitle = title.trim();
        const today = getTodayKey();

        if (!cleanedTitle || endDate < today) {
          return null;
        }

        const event: EventItem = {
          id: makeId(),
          title: cleanedTitle,
          startDate: today,
          endDate,
          createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        };

        set((state) => ({ events: [event, ...state.events] }));
        return event;
      },
      deleteEvent: (eventId) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
          dayStatuses: state.dayStatuses.filter((status) => status.eventId !== eventId),
        }));
      },
      setDayStatus: (eventId, date, status) => {
        const today = getTodayKey();

        if (date < today) {
          return;
        }

        set((state) => {
          const current = getStoredDayStatus(state.dayStatuses, eventId, date);

          if (status === "pending") {
            if (!current) {
              return state;
            }

            return {
              dayStatuses: state.dayStatuses.map((item) =>
                item.eventId === eventId && item.date === date
                  ? { ...item, status: "pending", updatedAt: new Date().toISOString() }
                  : item,
              ),
            };
          }

          if (current) {
            return {
              dayStatuses: state.dayStatuses.map((item) =>
                item.eventId === eventId && item.date === date
                  ? { ...item, status, updatedAt: new Date().toISOString() }
                  : item,
              ),
            };
          }

          return {
            dayStatuses: [
              ...state.dayStatuses,
              {
                eventId,
                date,
                status,
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },
      updateDayStatus: (eventId, date) => {
        const today = getTodayKey();

        if (date < today) {
          return;
        }

        const current = getStoredDayStatus(get().dayStatuses, eventId, date);
        const nextStatus = current?.status === "completed" ? "pending" : "completed";
        get().setDayStatus(eventId, date, nextStatus);
      },
      getEventById: (eventId) => get().events.find((event) => event.id === eventId),
      getDayStatus: (eventId, date) => {
        const event = get().events.find((item) => item.id === eventId);

        if (!event) {
          return isPastDate(date) ? "missed" : "pending";
        }

        return resolveDayStatus(get().dayStatuses, event, date);
      },
      getEventStats: (eventId) => {
        const event = get().events.find((item) => item.id === eventId);

        if (!event) {
          return EMPTY_EVENT_STATS;
        }

        return calculateEventStats(event, get().dayStatuses);
      },
    }),
    {
      name: "countdown-study-calendar",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        events: state.events,
        dayStatuses: state.dayStatuses,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          state.setHasHydrated(true);
        } else {
          useStore.setState({ hasHydrated: true });
        }

        if (error) {
          console.error("Failed to rehydrate countdown-study-calendar store", error);
        }
      },
    },
  ),
);

export function useEventById(eventId: string): EventItem | undefined {
  return useStore((state) => state.events.find((event) => event.id === eventId));
}

export function getEventDates(event: EventItem): string[] {
  return getDatesInRange(event.startDate, event.endDate);
}
