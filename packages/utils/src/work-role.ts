export const WORK_ROLE_VALUES = [
  "operations",
  "sales_agent",
  "sales_manager",
  "hr",
  "finance",
  "marketing",
  "project_manager",
  "executive",
] as const;

export type WorkRole = (typeof WORK_ROLE_VALUES)[number];

export const EMPLOYEE_WORK_ROLE_VALUES = WORK_ROLE_VALUES.filter(
  (role) => role !== "sales_agent",
);

export const WORK_ROLE_LABELS: Record<WorkRole, string> = {
  executive: "Executive",
  finance: "Finance",
  hr: "HR",
  marketing: "Marketing",
  operations: "Operations",
  project_manager: "Project Manager",
  sales_agent: "Sales Agent",
  sales_manager: "Sales Manager",
};

export const WORK_ROLE_DEFAULT_ROUTES: Record<WorkRole, string> = {
  executive: "/analytics",
  finance: "/hr/payroll",
  hr: "/hr/employees",
  marketing: "/builder",
  operations: "/",
  project_manager: "/projects",
  sales_agent: "/leads",
  sales_manager: "/customers",
};

export function isWorkRole(value: string): value is WorkRole {
  return WORK_ROLE_VALUES.includes(value as WorkRole);
}

export function resolveDefaultWorkRoleForMembershipRole(
  role: string,
): WorkRole {
  if (role === "agent") {
    return "sales_agent";
  }

  if (role === "owner" || role === "platform_admin") {
    return "executive";
  }

  return "operations";
}

export function resolveDashboardLandingRoute(
  workRole: string | null | undefined,
) {
  if (workRole && isWorkRole(workRole)) {
    return WORK_ROLE_DEFAULT_ROUTES[workRole];
  }

  return "/";
}
