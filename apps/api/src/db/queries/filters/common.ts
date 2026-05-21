export type PageFilterOption = {
  label: string;
  value: string;
};

export type PageFilterData<T extends string = string> = {
  label: string;
  options?: PageFilterOption[];
  type: "input" | "checkbox" | "select" | "date" | "date-range" | "boolean";
  value: T;
};

export const searchFilter = {
  label: "Search",
  type: "input",
  value: "q",
} satisfies PageFilterData<"q">;

export function optionFilter<T extends string>(
  value: T,
  label: string,
  options: Array<PageFilterOption | string>,
) {
  return {
    label,
    options: options.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option,
    ),
    type: "checkbox",
    value,
  } satisfies PageFilterData<T>;
}

export function selectFilter<T extends string>(
  value: T,
  label: string,
  options: Array<PageFilterOption | string>,
) {
  return {
    ...optionFilter(value, label, options),
    type: "select",
  } satisfies PageFilterData<T>;
}

export function dateFilter<T extends string>(value: T, label: string) {
  return {
    label,
    type: "date",
    value,
  } satisfies PageFilterData<T>;
}

export function dateRangeFilter<T extends string>(value: T, label: string) {
  return {
    label,
    type: "date-range",
    value,
  } satisfies PageFilterData<T>;
}

export function booleanFilter<T extends string>(value: T, label: string) {
  return {
    label,
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
    type: "boolean",
    value,
  } satisfies PageFilterData<T>;
}
