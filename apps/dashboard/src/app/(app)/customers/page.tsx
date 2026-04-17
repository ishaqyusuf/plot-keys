import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { UsersIcon } from "lucide-react";
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
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardTableToolbar,
  DashboardTableToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../lib/session";
import {
  createCustomerAction,
  deleteCustomerAction,
  exportCustomersCsvAction,
  updateCustomerStatusAction,
} from "../../actions";

type CustomersPageProps = {
  searchParams?: Promise<{
    error?: string;
    created?: string;
    filter?: string;
    q?: string;
  }>;
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "outline",
  vip: "secondary",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const session = await requireOnboardedSession();
  const sp = (await searchParams) ?? {};
  const query = sp.q?.trim() ?? "";
  const statusFilter = sp.filter && sp.filter !== "all" ? sp.filter : undefined;

  const prisma = createPrismaClient().db;
  const companyId = session.activeMembership.companyId;

  const [customers, stats] = await Promise.all([
    prisma
      ? prisma.customer.findMany({
          where: {
            companyId,
            deletedAt: null,
            ...(statusFilter
              ? { status: statusFilter as "active" | "inactive" | "vip" }
              : {}),
            ...(query
              ? {
                  OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        })
      : [],
    prisma
      ? prisma.customer.groupBy({
          by: ["status"],
          where: { companyId, deletedAt: null },
          _count: { id: true },
        })
      : [],
  ]);

  const statMap: Record<string, number> = { active: 0, inactive: 0, vip: 0 };
  for (const s of stats) {
    statMap[s.status] = s._count.id;
  }
  const total = Object.values(statMap).reduce((a, b) => a + b, 0);

  function buildFilterHref(filter: string) {
    const next = new URLSearchParams();

    if (query) {
      next.set("q", query);
    }

    if (filter !== "all") {
      next.set("filter", filter);
    }

    const qs = next.toString();
    return qs ? `/customers?${qs}` : "/customers";
  }

  const canManage =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin" ||
    session.activeMembership.role === "agent";

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      {sp.created ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>Customer added successfully.</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Customers</DashboardPageEyebrow>
            <DashboardPageTitle>Customers</DashboardPageTitle>
            <DashboardPageDescription>
              All customer records in one place. Filter, scan, and update
              relationship status from a single table.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <ExportCsvButton
              exportAction={exportCustomersCsvAction}
              filename="customers.csv"
            />
            {canManage ? (
              <details className="group relative">
                <summary className="list-none">
                  <Button size="sm" type="button">
                    Add customer
                  </Button>
                </summary>
                <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-[1.25rem] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                  <p className="mb-3 text-sm font-medium text-foreground">
                    New customer
                  </p>
                  <form action={createCustomerAction} className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input name="name" required placeholder="Full name" />
                      </Field>
                    </FieldGroup>
                    <FieldGroup className="sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          name="email"
                          type="email"
                          placeholder="name@company.com"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Phone</FieldLabel>
                        <Input name="phone" placeholder="+234..." />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Status</FieldLabel>
                        <NativeSelect name="status" defaultValue="active">
                          <NativeSelectOption value="active">
                            Active
                          </NativeSelectOption>
                          <NativeSelectOption value="vip">
                            VIP
                          </NativeSelectOption>
                          <NativeSelectOption value="inactive">
                            Inactive
                          </NativeSelectOption>
                        </NativeSelect>
                      </Field>
                    </FieldGroup>
                    <div className="flex justify-end">
                      <Button size="sm" type="submit" className="min-w-32">
                        Save customer
                      </Button>
                    </div>
                  </form>
                </div>
              </details>
            ) : null}
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      {customers.length === 0 ? (
        <DashboardEmptyState
          description={
            statusFilter
              ? `No ${statusFilter} customers yet.`
              : "Add customers directly or convert qualified leads to start building the pipeline."
          }
          icon={<UsersIcon className="size-5" />}
          title="No customers here yet"
        />
      ) : (
        <DashboardTablePage>
          <DashboardTablePageHeader>
            <div className="space-y-1">
              <DashboardTablePageTitle>All customers</DashboardTablePageTitle>
              <DashboardTablePageDescription>
                {total} customer{total !== 1 ? "s" : ""}
                {query ? ` matching “${query}”` : ""}.
              </DashboardTablePageDescription>
            </div>
            <DashboardTableToolbar>
              <form action="/customers" className="w-full max-w-sm">
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue={query}
                    name="q"
                    placeholder="Search name, email, or phone"
                  />
                  {statusFilter ? (
                    <input name="filter" type="hidden" value={statusFilter} />
                  ) : null}
                  <Button size="sm" type="submit" variant="outline">
                    Search
                  </Button>
                </div>
              </form>
              <DashboardTableToolbarGroup>
                <DashboardFilterTabs className="bg-background/70">
                  {["all", "active", "vip", "inactive"].map((f) => {
                    const isActive =
                      (f === "all" && !statusFilter) || f === statusFilter;
                    return (
                      <DashboardFilterTab
                        key={f}
                        active={isActive}
                        href={buildFilterHref(f)}
                      >
                        {f === "all" ? "All" : f}
                        {f === "all" ? ` (${total})` : ` (${statMap[f] ?? 0})`}
                      </DashboardFilterTab>
                    );
                  })}
                </DashboardFilterTabs>
              </DashboardTableToolbarGroup>
            </DashboardTableToolbar>
          </DashboardTablePageHeader>
          <DashboardTablePageBody>
            <Table>
              <TableHeader className="[&_tr]:border-border/55">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-5 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Added
                  </TableHead>
                  <TableHead className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Notes
                  </TableHead>
                  <TableHead className="px-5 text-right text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-border/50 hover:bg-background/40"
                  >
                    <TableCell className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium text-foreground">
                            {c.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-top">
                      <p className="text-sm text-muted-foreground">
                        {[c.email, c.phone].filter(Boolean).join(" · ") ||
                          "No contact info"}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 align-top">
                      <Badge
                        variant={statusVariant[c.status] ?? "outline"}
                        className="capitalize"
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 align-top text-sm text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 align-top">
                      <p className="max-w-sm text-sm text-muted-foreground">
                        {c.notes || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 align-top">
                      {canManage ? (
                        <div className="flex justify-end gap-2">
                          <form
                            action={updateCustomerStatusAction}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="hidden"
                              name="customerId"
                              value={c.id}
                            />
                            <NativeSelect
                              name="status"
                              defaultValue={c.status}
                              className="h-8 min-w-28 text-xs"
                            >
                              <NativeSelectOption value="active">
                                Active
                              </NativeSelectOption>
                              <NativeSelectOption value="vip">
                                VIP
                              </NativeSelectOption>
                              <NativeSelectOption value="inactive">
                                Inactive
                              </NativeSelectOption>
                            </NativeSelect>
                            <Button size="sm" type="submit" variant="outline">
                              Save
                            </Button>
                          </form>
                          <form action={deleteCustomerAction}>
                            <input
                              type="hidden"
                              name="customerId"
                              value={c.id}
                            />
                            <Button
                              size="sm"
                              type="submit"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </form>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardTablePageBody>
        </DashboardTablePage>
      )}
    </DashboardPage>
  );
}
