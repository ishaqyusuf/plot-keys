"use client";

import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
  companyName: string;
  companySlug: string;
  planTier: string;
};

// Legacy compatibility wrapper. The authenticated dashboard shell now lives in
// `src/app/(app)/layout.tsx`, but this component remains export-safe for any
// stale imports while we complete the migration.
export function DashboardShell({ children }: DashboardShellProps) {
  return <>{children}</>;
}
