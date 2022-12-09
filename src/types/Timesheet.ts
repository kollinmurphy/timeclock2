export type Timesheet = {
  userId: string;
  week: number;
  sort: string;
  hours: TimesheetHours[];
};

export type TimesheetHours = {
  day: number;
  start: number;
  end?: number;
};
