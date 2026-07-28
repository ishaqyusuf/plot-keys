"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "@/trpc/client";

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

const emptyCustomerValue = "none";

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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const revokeMutation = useMutation(
    trpc.projects.revokeCustomerAccess.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );

  return (
    <div className="mb-4 space-y-2">
      {accessList.map((access) => (
        <div
          key={access.id}
          className="flex items-center justify-between border p-3"
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
          <SubmitButton
            variant="destructive"
            size="sm"
            isSubmitting={revokeMutation.isPending}
            onClick={() =>
              revokeMutation.mutate({
                projectId,
                customerId: access.customer.id,
              })
            }
            type="button"
          >
            Revoke
          </SubmitButton>
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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const grantMutation = useMutation(
    trpc.projects.grantCustomerAccess.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const [customerId, setCustomerId] = useState(emptyCustomerValue);

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
    const selectedCustomerId =
      customerId === emptyCustomerValue ? "" : customerId;
    if (!selectedCustomerId) return;

    await grantMutation.mutateAsync({
      projectId,
      customerId: selectedCustomerId,
      level:
        (String(fd.get("level") ?? "") as "overview" | "detailed") ||
        "overview",
    });

    setCustomerId(emptyCustomerValue);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <Label htmlFor="accessCustomer">Customer</Label>
        <Select
          name="customerId"
          onValueChange={setCustomerId}
          value={customerId}
        >
          <SelectTrigger id="accessCustomer" className="w-full">
            <SelectValue placeholder="Select customer…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={emptyCustomerValue}>Select customer…</SelectItem>
            {availableCustomers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
                {c.email ? ` (${c.email})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="accessLevel">Access Level</Label>
        <Select defaultValue="overview" name="level">
          <SelectTrigger id="accessLevel" className="w-full">
            <SelectValue placeholder="Select access level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <SubmitButton
          isSubmitting={grantMutation.isPending}
          disabled={customerId === emptyCustomerValue}
        >
          Grant Access
        </SubmitButton>
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
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(projectId);

  const createMutation = useMutation(
    trpc.projects.createCustomerNotice.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const [customerId, setCustomerId] = useState(emptyCustomerValue);

  if (accessList.length === 0) {
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const selectedCustomerId =
      customerId === emptyCustomerValue ? "" : customerId;
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();
    if (!selectedCustomerId || !title || !body) return;

    await createMutation.mutateAsync({
      projectId,
      customerId: selectedCustomerId,
      title,
      body,
    });

    setCustomerId(emptyCustomerValue);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="noticeCustomer">Send Notice To</Label>
        <Select
          name="customerId"
          onValueChange={setCustomerId}
          value={customerId}
        >
          <SelectTrigger id="noticeCustomer" className="w-full">
            <SelectValue placeholder="Select customer…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={emptyCustomerValue}>Select customer…</SelectItem>
            {accessList.map((a) => (
              <SelectItem key={a.customer.id} value={a.customer.id}>
                {a.customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <SubmitButton
          isSubmitting={createMutation.isPending}
          disabled={customerId === emptyCustomerValue}
        >
          Send Notice
        </SubmitButton>
      </div>
    </form>
  );
}
