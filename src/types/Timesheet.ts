export type Timesheet = {
  userId: string;
  sort: string;
  hours: TimesheetHours[];
};

export type TimesheetHours = {
  start: number;
  end?: number;
  edited?: boolean;
};

export type DailySummary = {
  sum: number;
  hours: TimesheetHours[];
}
