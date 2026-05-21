export type PageFilterOption = {
  label: string;
  value: string;
};

export type PageFilterData = {
  label: string;
  options?: PageFilterOption[];
  type: "input" | "checkbox" | "select" | "date" | "date-range" | "boolean";
  value: string;
};

export type FilterValue = boolean | string | string[] | null | undefined;

export type FilterState = Record<string, FilterValue>;

export type SetFilters = (next: Record<string, FilterValue> | null) => void;
