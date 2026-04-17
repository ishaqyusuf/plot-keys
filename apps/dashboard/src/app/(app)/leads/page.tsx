import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Target } from "lucide-react";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../lib/session";
import {
  convertLeadToCustomerAction,
  exportLeadsCsvAction,
  updateLeadStatusAction,
} from "../../actions";

type LeadsPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "outline" | "secondary" }
> = {
  closed: { label: "Closed", variant: "outline" },
  contacted: { label: "Contacted", variant: "secondary" },
  new: { label: "New", variant: "default" },
  qualified: { label: "Qualified", variant: "secondary" },
};

const statusFlow: Record<string, { label: string; next: string }> = {
  contacted: { label: "Mark qualified", next: "qualified" },
  new: { label: "Mark contacted", next: "contacted" },
  qualified: { label: "Mark closed", next: "closed" },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;

  const prisma = createPrismaClient().db;

  const leads = prisma
    ? await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        where: {
          companyId: session.activeMembership.companyId,
          ...(filterStatus ? { status: filterStatus as never } : {}),
        },
      })
    : [];

  const counts = prisma
    ? await prisma.lead.groupBy({
        by: ["status"],
        _count: true,
        where: { companyId: session.activeMembership.companyId },
      })
    : [];

  const stats: Record<string, number> = {
    closed: counts.find((c) => c.status === "closed")?._count ?? 0,
    contacted: counts.find((c) => c.status === "contacted")?._count ?? 0,
    new: counts.find((c) => c.status === "new")?._count ?? 0,
    qualified: counts.find((c) => c.status === "qualified")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Acquisition workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Leads</DashboardPageTitle>
            <DashboardPageDescription>
              Review inbound demand, move lead status forward, and convert
              qualified prospects into customers.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <ExportCsvButton
              exportAction={exportLeadsCsvAction}
              filename="leads.csv"
            />
          </DashboardPageActions>
        </DashboardPageHeaderRow>

        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {stats.total} lead{stats.total !== 1 ? "s" : ""} captured
          </DashboardToolbarGroup>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              <DashboardFilterTab active={!filterStatus} href="/leads">
                All ({stats.total})
              </DashboardFilterTab>
              {(["new", "contacted", "qualified", "closed"] as const).map(
                (s) => (
                  <DashboardFilterTab
                    key={s}
                    active={filterStatus === s}
                    href={`/leads?status=${s}`}
                  >
                    {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                  </DashboardFilterTab>
                ),
              )}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Lead queue</DashboardSectionTitle>
            <DashboardSectionDescription>
              Work from newest demand first and move each record through a
              consistent follow-up flow.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        {leads.length === 0 ? (
          <DashboardEmptyState
            description={
              filterStatus
                ? `No ${filterStatus} leads yet.`
                : "Leads from your website contact form will appear here once demand starts coming in."
            }
            icon={<Target className="size-5" />}
            title="No leads yet"
          />
        ) : (
          <div className="grid gap-2.5">
            {leads.map((lead) => {
              const flow = statusFlow[lead.status];
              return (
                <Card key={lead.id} className="border-border/65 bg-card/78">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {lead.name}
                        </CardTitle>
                        <Badge
                          variant={
                            statusConfig[lead.status]?.variant ?? "outline"
                          }
                        >
                          {statusConfig[lead.status]?.label ?? lead.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lead.email}
                        {lead.phone ? ` · ${lead.phone}` : ""}
                        {" · "}
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-center">
                      {flow ? (
                        <form action={updateLeadStatusAction}>
                          <input name="leadId" type="hidden" value={lead.id} />
                          <input
                            name="status"
                            type="hidden"
                            value={flow.next}
                          />
                          <Button size="sm" type="submit" variant="outline">
                            {flow.label}
                          </Button>
                        </form>
                      ) : null}
                      {/* Convert qualified lead to customer */}
                      {lead.status === "qualified" ? (
                        <form action={convertLeadToCustomerAction}>
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="name" value={lead.name} />
                          <input
                            type="hidden"
                            name="email"
                            value={lead.email ?? ""}
                          />
                          <input
                            type="hidden"
                            name="phone"
                            value={lead.phone ?? ""}
                          />
                          <Button size="sm" type="submit" variant="default">
                            → Customer
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </CardHeader>
                  {lead.message ? (
                    <CardContent className="px-5 pb-4 pt-0 text-sm text-muted-foreground">
                      {lead.message}
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
