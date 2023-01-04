import {
  add,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import { DailySummary, TimesheetHours } from "../types/Timesheet";

export const formatSort = (date: Date) => format(date, "yyyy-MM-dd");
export const formatDate = (date: Date) => format(date, "E, M/d");
export const formatDateMMDD = (date: Date) => format(date, "M/d");
export const formatDateEMMDDYYYY = (date: Date) =>
  format(date, "EEE, MMM d, yyyy");
export const formatDateHHMMAMPM = (date: Date) => format(date, "h:mm aaa");

export const getStartAndEndFromSort = (sort: string) => {
  const [year, month, day] = sort.split("-").map((s) => parseInt(s, 10));
  const date = new Date(year, month - 1, day);
  const endDate = add(date, { days: 6 });
  return {
    start: date,
    end: endDate,
  };
};

export const formattedDifference = (start: number, end: number) => {
  const diff = differenceInMinutes(end, start);
  return formatDifferenceInMinutes(diff);
};

export const formatDifferenceShort = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? `0${mins}` : mins}`;
};

export const formatDifferenceInMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} ${mins === 1 ? "minute" : "minutes"}`;
  return `${hours}:${mins < 10 ? `0${mins}` : mins}`;
};

export const sumHours = (hours: TimesheetHours[]) => {
  return Math.round(
    hours.reduce((acc, curr) => {
      if (!curr.end) return acc;
      const diff = differenceInSeconds(curr.end, curr.start);
      return acc + diff;
    }, 0) / 60
  );
};

export const sumHoursByDay = (hours: TimesheetHours[]) => {
  const map = hours.reduce((acc: Map<number, DailySummary>, curr) => {
    const diff = curr.end ? differenceInSeconds(curr.end, curr.start) : 0;
    const day = (new Date(curr.start).getDay() + 1) % 7;
    const current: DailySummary = acc.get(day) || { sum: 0, hours: [] };
    acc.set(day, {
      sum: current.sum + diff,
      hours: [...current.hours, curr],
    });
    return acc;
  }, new Map());
  for (const key of map.keys())
  map.set(key, { ...map.get(key), sum: Math.round(map.get(key).sum / 60) });
  return map;
};
