export type Timesheet = {
  userId: string;
  week: number;
  hours: TimesheetHours[];
};

export type TimesheetHours = {
  day: number;
  start: number;
  end?: number;
};
