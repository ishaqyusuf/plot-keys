export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "closed",
];

export const leadStatusConfig: Record<
  LeadStatus,
  { label: string; variant: "default" | "outline" | "secondary" }
> = {
  closed: { label: "Closed", variant: "outline" },
  contacted: { label: "Contacted", variant: "secondary" },
  new: { label: "New", variant: "default" },
  qualified: { label: "Qualified", variant: "secondary" },
};

export function isLeadStatus(value: string | undefined): value is LeadStatus {
  return leadStatuses.includes(value as LeadStatus);
}
