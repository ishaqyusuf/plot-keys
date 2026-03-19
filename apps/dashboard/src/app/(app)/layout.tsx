import { createPrismaClient, findCompanyById } from "@plotkeys/db";
import type { ReactNode } from "react";
import { DashboardShell } from "../../components/nav/dashboard-shell";
import { requireOnboardedSession } from "../../lib/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireOnboardedSession();
  const { companyName, companySlug } = session.activeMembership;

  const prisma = createPrismaClient().db;
  const company = prisma
    ? await findCompanyById(prisma, session.activeMembership.companyId)
    : null;

  const planTier = company?.planTier ?? "starter";

  return (
    <DashboardShell
      companyName={companyName}
      companySlug={companySlug}
      planTier={planTier}
    >
      {children}
    </DashboardShell>
  );
}
