export type EmployeeStatus =
  | "active"
  | "on_leave"
  | "suspended"
  | "terminated";

export type EmploymentType = "contract" | "full_time" | "intern" | "part_time";

export const employeeStatuses: EmployeeStatus[] = [
  "active",
  "on_leave",
  "suspended",
  "terminated",
];

export const employeeStatusConfig: Record<
  EmployeeStatus,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  on_leave: { label: "On leave", variant: "secondary" },
  suspended: { label: "Suspended", variant: "outline" },
  terminated: { label: "Terminated", variant: "destructive" },
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  contract: "Contract",
  full_time: "Full-time",
  intern: "Intern",
  part_time: "Part-time",
};

export function isEmployeeStatus(
  value: string | undefined,
): value is EmployeeStatus {
  return employeeStatuses.includes(value as EmployeeStatus);
}

export function formatEmployeeDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
