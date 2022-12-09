import { TimesheetHours } from "@datatypes/Timesheet";
import {
  differenceInMinutes,
  endOfISOWeek,
  format,
  setISOWeek,
  startOfISOWeek,
} from "date-fns";

export const formatDateMMDD = (date: Date) => format(date, "MM/dd");
export const formatDateHHMMAMPM = (date: Date) => format(date, "h:mm aaa");

export const getStartAndEndFromISOWeek = (isoWeek: number) => {
  const startDate = startOfISOWeek(setISOWeek(new Date(), isoWeek));
  const endDate = endOfISOWeek(setISOWeek(new Date(), isoWeek));
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
  return hours.reduce((acc: Map<number, number>, curr) => {
    if (!curr.end) return acc;
    const diff = differenceInMinutes(curr.end, curr.start);
    const day = new Date(curr.start).getDay();
    const current = acc.get(day) || 0;
    acc.set(day, current + diff);
    return acc;
  }, new Map());
};
