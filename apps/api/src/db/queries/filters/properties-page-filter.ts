import { optionFilter, searchFilter, type PageFilterData } from "./common";

export type PropertiesPageFilterKey = "q" | "type";

export const propertyTypeFilterOptions = [
  { label: "Home", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Land", value: "land" },
  { label: "Industrial", value: "industrial" },
  { label: "Mixed use", value: "mixed_use" },
];

export async function propertiesPageFilter() {
  return [
    searchFilter,
    optionFilter<PropertiesPageFilterKey>(
      "type",
      "Listing type",
      propertyTypeFilterOptions,
    ),
  ] satisfies PageFilterData<PropertiesPageFilterKey>[];
}
