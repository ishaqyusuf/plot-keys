import {
  dateRangeFilter,
  optionFilter,
  type PageFilterData,
  searchFilter,
} from "./common";

export type CustomersPageFilterKey = "end" | "filter" | "q" | "start";

export const customerStatusFilterOptions = [
  { label: "Active", value: "active" },
  { label: "VIP", value: "vip" },
  { label: "Inactive", value: "inactive" },
];

export async function customersPageFilter() {
  return [
    searchFilter,
    optionFilter<CustomersPageFilterKey>(
      "filter",
      "Customer status",
      customerStatusFilterOptions,
    ),
    dateRangeFilter<CustomersPageFilterKey>("start", "Added"),
  ] satisfies PageFilterData<CustomersPageFilterKey>[];
}
