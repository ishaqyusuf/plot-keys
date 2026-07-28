export function canEditWorkspaceSettings(role: string) {
  return role === "owner" || role === "admin";
}

export function canManageCustomerRecords(role: string) {
  return role === "owner" || role === "admin" || role === "agent";
}
