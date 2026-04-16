export type CompanyPlanTier = "starter" | "plus" | "pro";

export type IconName = string;

export type AppNavItem = {
  href: string;
  icon: IconName;
  label: string;
};

export type AppNavGroup = {
  items: AppNavItem[];
  label: string;
};

export type AppCategory =
  | "Sales"
  | "Operations"
  | "Marketing"
  | "Insights"
  | "AI";

export type AppDefinition = {
  category: AppCategory;
  description: string;
  homeRoute: string;
  icon: IconName;
  id: string;
  label: string;
  navGroups: AppNavGroup[];
  planGate: CompanyPlanTier;
};

export type GlobalNavSection = {
  items: AppNavItem[];
  label: string;
};
