export type HourRange = {
  startMinutes: number;
  endMinutes: number;
};

export type OccupancyBlockFormState = {
  title: string;
  date: string;
  courtIds: number[];
  range: HourRange | null;
};

/** Prefill for the modal when opened from the calendar (or elsewhere). */
export type OccupancyBlockDraft = {
  title?: string;
  date: string;
  courtIds: number[];
  range: HourRange;
};

export type OccupancyBlockFormErrors = {
  title?: string;
  date?: string;
  courtIds?: string;
  range?: string;
  form?: string;
};
