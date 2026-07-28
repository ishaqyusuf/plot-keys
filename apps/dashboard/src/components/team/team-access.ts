import { buildDashboardUrl } from "@plotkeys/utils";

export function canManageWorkspaceMembers(role: string) {
  return role === "owner" || role === "admin" || role === "platform_admin";
}

export function canShowInviteDevelopmentPreview() {
  return process.env.NODE_ENV === "development";
}

export function getWorkspaceInviteContext() {
  return {
    appBaseUrl: buildDashboardUrl(),
    isDevMode: canShowInviteDevelopmentPreview(),
  };
}
