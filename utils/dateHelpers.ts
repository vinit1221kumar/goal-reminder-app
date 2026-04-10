import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function getTodayKey(referenceDate = new Date()): string {
  return format(referenceDate, DATE_KEY_FORMAT);
}

export function parseDateKey(dateKey: string): Date {
  return parseISO(`${dateKey}T00:00:00`);
}

export function formatReadableDate(dateKey: string): string {
  return format(parseDateKey(dateKey), "dd/MM/yyyy");
}

export function formatMonthLabel(dateKey: string): string {
  return format(parseDateKey(dateKey), "MMMM yyyy");
}

export function getDatesInRange(startDate: string, endDate: string): string[] {
  if (endDate < startDate) {
    return [];
  }

  return eachDayOfInterval({
    start: parseDateKey(startDate),
    end: parseDateKey(endDate),
  }).map((date) => format(date, DATE_KEY_FORMAT));
}

export function getTotalDays(startDate: string, endDate: string): number {
  if (endDate < startDate) {
    return 0;
  }

  return differenceInCalendarDays(parseDateKey(endDate), parseDateKey(startDate)) + 1;
}

export function isPastDate(dateKey: string, referenceDate = getTodayKey()): boolean {
  return dateKey < referenceDate;
}

export function isToday(dateKey: string, referenceDate = getTodayKey()): boolean {
  return dateKey === referenceDate;
}

export function isTodayOrFuture(
  dateKey: string,
  referenceDate = getTodayKey(),
): boolean {
  return dateKey >= referenceDate;
}

export function daysUntil(dateKey: string, referenceDate = getTodayKey()): number {
  return differenceInCalendarDays(parseDateKey(dateKey), parseDateKey(referenceDate));
}