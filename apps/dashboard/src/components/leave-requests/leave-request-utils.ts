export type LeaveRequestStatus =
  | "approved"
  | "cancelled"
  | "pending"
  | "rejected";

export type LeaveType =
  | "annual"
  | "compassionate"
  | "maternity"
  | "paternity"
  | "sick"
  | "unpaid";

export const leaveRequestStatuses: LeaveRequestStatus[] = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
];

export const leaveRequestStatusConfig: Record<
  LeaveRequestStatus,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  approved: { label: "Approved", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
  pending: { label: "Pending", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: "Annual",
  compassionate: "Compassionate",
  maternity: "Maternity",
  paternity: "Paternity",
  sick: "Sick",
  unpaid: "Unpaid",
};

export function isLeaveRequestStatus(
  value: string | undefined,
): value is LeaveRequestStatus {
  return leaveRequestStatuses.includes(value as LeaveRequestStatus);
}

export function formatLeaveDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
