import { optionFilter, searchFilter, type PageFilterData } from "./common";

export type CustomersPageFilterKey = "filter" | "q";

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
  ] satisfies PageFilterData<CustomersPageFilterKey>[];
}
