export const projectStatuses = [
  "draft",
  "active",
  "paused",
  "delayed",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusConfig: Record<
  ProjectStatus,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
  completed: { label: "Completed", variant: "secondary" },
  delayed: { label: "Delayed", variant: "destructive" },
  draft: { label: "Draft", variant: "outline" },
  paused: { label: "Paused", variant: "secondary" },
};

export const projectTypeLabels: Record<string, string> = {
  building: "Building",
  estate: "Estate",
  fit_out: "Fit-out",
  infrastructure: "Infrastructure",
  renovation: "Renovation",
};

export function isProjectStatus(value?: string): value is ProjectStatus {
  return projectStatuses.includes(value as ProjectStatus);
}

export function formatProjectDate(date?: Date | null) {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
