"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CustomerAccess = {
  id: string;
  level: string;
  enabledAt: Date | string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
  };
};

type Customer = {
  id: string;
  name: string;
  email: string | null;
};

// ---------------------------------------------------------------------------
// Access level labels
// ---------------------------------------------------------------------------

const accessLevelLabels: Record<string, string> = {
  detailed: "Detailed",
  overview: "Overview",
};

// ---------------------------------------------------------------------------
// Customer Access list
// ---------------------------------------------------------------------------

export function CustomerAccessList({
  accessList,
  projectId,
}: {
  accessList: CustomerAccess[];
  projectId: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const revokeMutation = useMutation(
    trpc.projects.revokeCustomerAccess.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {accessList.map((access) => (
        <div
          key={access.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {access.customer.name}
              </span>
              <Badge variant="outline">
                {accessLevelLabels[access.level] ?? access.level}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {access.customer.email ?? "No email"}
              {access.customer.phone ? ` · ${access.customer.phone}` : ""}
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            disabled={revokeMutation.isPending}
            onClick={() =>
              revokeMutation.mutate({
                projectId,
                customerId: access.customer.id,
              })
            }
          >
            {revokeMutation.isPending ? "…" : "Revoke"}
          </Button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grant Customer Access form
// ---------------------------------------------------------------------------

export function GrantCustomerAccessForm({
  projectId,
  customers,
  grantedCustomerIds,
}: {
  projectId: string;
  customers: Customer[];
  grantedCustomerIds: Set<string>;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const grantMutation = useMutation(
    trpc.projects.grantCustomerAccess.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const availableCustomers = customers.filter(
    (c) => !grantedCustomerIds.has(c.id),
  );

  if (availableCustomers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {customers.length === 0
          ? "No customers exist yet. Add customers first."
          : "All customers already have access to this project."}
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customerId = String(fd.get("customerId") ?? "").trim();
    if (!customerId) return;

    await grantMutation.mutateAsync({
      projectId,
      customerId,
      level:
        (String(fd.get("level") ?? "") as "overview" | "detailed") ||
        "overview",
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      <div>
        <Label htmlFor="accessCustomer">Customer</Label>
        <select
          id="accessCustomer"
          name="customerId"
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="">Select customer…</option>
          {availableCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.email ? ` (${c.email})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="accessLevel">Access Level</Label>
        <select
          id="accessLevel"
          name="level"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="overview">Overview</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>
      <div className="flex items-end">
        <Button disabled={grantMutation.isPending} type="submit">
          {grantMutation.isPending ? "Granting…" : "Grant Access"}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Send Customer Notice form
// ---------------------------------------------------------------------------

export function SendNoticeForm({
  projectId,
  accessList,
}: {
  projectId: string;
  accessList: CustomerAccess[];
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.projects.createCustomerNotice.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  if (accessList.length === 0) {
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customerId = String(fd.get("customerId") ?? "").trim();
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();
    if (!customerId || !title || !body) return;

    await createMutation.mutateAsync({
      projectId,
      customerId,
      title,
      body,
    });

    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="noticeCustomer">Send Notice To</Label>
        <select
          id="noticeCustomer"
          name="customerId"
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="">Select customer…</option>
          {accessList.map((a) => (
            <option key={a.customer.id} value={a.customer.id}>
              {a.customer.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="noticeTitle">Title *</Label>
        <Input
          id="noticeTitle"
          name="title"
          required
          placeholder="Notice title"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="noticeBody">Message *</Label>
        <Input
          id="noticeBody"
          name="body"
          required
          placeholder="Notice content"
        />
      </div>
      <div className="sm:col-span-2">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Sending…" : "Send Notice"}
        </Button>
      </div>
    </form>
  );
}
