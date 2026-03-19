import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import { updateLeadStatusAction } from "../../actions";

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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="ghost">
                <Link href="/">← Dashboard</Link>
              </Button>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Leads
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} lead{stats.total !== 1 ? "s" : ""} captured
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus ? "default" : "outline"}
          >
            <Link href="/leads">All ({stats.total})</Link>
          </Button>
          {(["new", "contacted", "qualified", "closed"] as const).map((s) => (
            <Button
              key={s}
              asChild
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
            >
              <Link href={`/leads?status=${s}`}>
                {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
              </Link>
            </Button>
          ))}
        </div>

        {leads.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${filterStatus} leads yet.`
                  : "No leads yet. Leads from your website contact form will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => {
              const flow = statusFlow[lead.status];
              return (
                <Card key={lead.id} className="bg-card">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
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
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {lead.email}
                        {lead.phone ? ` · ${lead.phone}` : ""}
                        {" · "}
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
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
                    </div>
                  </CardHeader>
                  {lead.message ? (
                    <CardContent className="px-6 pb-5 text-sm text-muted-foreground">
                      {lead.message}
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
