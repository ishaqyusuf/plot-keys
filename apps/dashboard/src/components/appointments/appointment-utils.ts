export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export const appointmentStatuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
};

export function isAppointmentStatus(
  value: string | undefined,
): value is AppointmentStatus {
  return appointmentStatuses.includes(value as AppointmentStatus);
}
