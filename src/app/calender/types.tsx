export type Calender = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  highlightedRange: [string, string] | null;
  selectedDays: string[];
};

export type Nullable<T> = T | null;
