import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader } from "@plotkeys/ui/card";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import {
  createCustomerAction,
  deleteCustomerAction,
  updateCustomerStatusAction,
} from "../../actions";
import { requireOnboardedSession } from "../../../lib/session";

type CustomersPageProps = {
  searchParams?: Promise<{ error?: string; created?: string; filter?: string }>;
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

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const session = await requireOnboardedSession();
  const sp = (await searchParams) ?? {};
  const statusFilter = sp.filter && sp.filter !== "all" ? sp.filter : undefined;

  const prisma = createPrismaClient().db;
  const companyId = session.activeMembership.companyId;

  const [customers, stats] = await Promise.all([
    prisma
      ? prisma.customer.findMany({
          where: {
            companyId,
            deletedAt: null,
            ...(statusFilter ? { status: statusFilter as "active" | "inactive" | "vip" } : {}),
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

  const canManage =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin" ||
    session.activeMembership.role === "agent";

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {sp.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{sp.error}</AlertDescription>
          </Alert>
        ) : null}

        {sp.created ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Customer added successfully.</AlertDescription>
          </Alert>
        ) : null}

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/">← Dashboard</Link>
            </Button>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Customers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} customer{total !== 1 ? "s" : ""} total
            </p>
          </div>

          {/* Add customer form */}
          {canManage ? (
            <details className="group relative">
              <summary className="cursor-pointer list-none">
                <Button size="sm" type="button">
                  Add customer
                </Button>
              </summary>
              <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-lg">
                <p className="mb-3 text-sm font-medium text-foreground">New customer</p>
                <form action={createCustomerAction} className="space-y-3">
                  <input
                    name="name"
                    required
                    placeholder="Full name *"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <select
                    name="status"
                    defaultValue="active"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="vip">VIP</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button size="sm" type="submit" className="w-full">
                    Save customer
                  </Button>
                </form>
              </div>
            </details>
          ) : null}
        </div>

        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {(["active", "vip", "inactive"] as const).map((s) => (
            <Card key={s} className="bg-card">
              <CardContent className="flex items-center justify-between px-4 py-3">
                <p className="text-xs capitalize text-muted-foreground">{s}</p>
                <p className="text-lg font-semibold text-foreground">{statMap[s] ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {["all", "active", "vip", "inactive"].map((f) => {
            const isActive = (f === "all" && !statusFilter) || f === statusFilter;
            return (
              <Link
                key={f}
                href={f === "all" ? "/customers" : `/customers?filter=${f}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f}
              </Link>
            );
          })}
        </div>

        {/* Customer list */}
        {customers.length === 0 ? (
          <Card className="py-20 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UsersIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {statusFilter ? `No ${statusFilter} customers.` : "No customers yet."}
              </p>
              <p className="text-xs text-muted-foreground">
                Add customers directly or convert qualified leads.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {customers.map((c) => (
              <Card key={c.id} className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate">{c.name}</p>
                        <Badge variant={statusVariant[c.status] ?? "outline"} className="capitalize">
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {[c.email, c.phone].filter(Boolean).join(" · ") || "No contact info"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {formatDate(c.createdAt)}
                      </p>
                    </div>
                  </div>

                  {canManage ? (
                    <div className="flex shrink-0 items-center gap-2">
                      {/* Status selector */}
                      <form action={updateCustomerStatusAction} className="flex items-center gap-2">
                        <input type="hidden" name="customerId" value={c.id} />
                        <select
                          name="status"
                          defaultValue={c.status}
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                        >
                          <option value="active">Active</option>
                          <option value="vip">VIP</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <Button size="sm" type="submit" variant="outline">
                          Save
                        </Button>
                      </form>

                      {/* Delete */}
                      <form action={deleteCustomerAction}>
                        <input type="hidden" name="customerId" value={c.id} />
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
                </CardHeader>
                {c.notes ? (
                  <CardContent className="px-5 pb-4 pt-0">
                    <p className="text-xs text-muted-foreground">{c.notes}</p>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
