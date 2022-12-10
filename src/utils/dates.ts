import { DailySummary, TimesheetHours } from "@datatypes/Timesheet";
import {
  differenceInMinutes,
  endOfISOWeek,
  format,
  setISOWeek,
  startOfISOWeek,
} from "date-fns";

export const formatDate = (date: Date) => format(date, "E MM/dd");
export const formatDateMMDD = (date: Date) => format(date, "MM/dd");
export const formatDateHHMMAMPM = (date: Date) => format(date, "h:mm aaa");

export const getStartAndEndFromSort = (sort: string) => {
  const [year, isoWeek] = sort.split("-").map((s) => parseInt(s, 10));
  const date = new Date(year, 0, 1);
  const startDate = startOfISOWeek(setISOWeek(date, isoWeek));
  const endDate = endOfISOWeek(setISOWeek(date, isoWeek));
  return {
    start: formatDateMMDD(startDate),
    end: formatDateMMDD(endDate),
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
  return hours.reduce((acc, curr) => {
    if (!curr.end) return acc;
    const diff = differenceInMinutes(curr.end, curr.start);
    return acc + diff;
  }, 0);
};

export const sumHoursByDay = (hours: TimesheetHours[]) => {
  return hours.reduce((acc: Map<number, DailySummary>, curr) => {
    const diff = curr.end ? differenceInMinutes(curr.end, curr.start) : 0;
    const day = new Date(curr.start).getDay();
    const current: DailySummary = acc.get(day) || { sum: 0, hours: [] };
    acc.set(day, {
      sum: current.sum + diff,
      hours: [...current.hours, curr],
    });
    return acc;
  }, new Map());
};
