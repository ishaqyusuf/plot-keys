"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CustomerTableRow =
  RouterOutputs["customers"]["get"]["data"][number];
type CustomerStatus = "active" | "inactive" | "vip";

export const customerStatusVariant: Record<
  string,
  "default" | "secondary" | "outline"
> = {
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

function CustomerCell({ customer }: { customer: CustomerTableRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {customer.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {customer.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {customer.email || customer.phone || "No contact info"}
        </p>
      </div>
    </div>
  );
}

export const columns = (canManage: boolean): ColumnDef<CustomerTableRow>[] => [
  {
    cell: ({ row }) => <CustomerCell customer={row.original} />,
    header: "Customer",
    id: "customer",
    meta: {
      className: "min-w-[240px] md:sticky md:left-0 md:z-20 md:bg-background",
      sticky: true,
    },
    size: 260,
  },
  {
    cell: ({ row }) => (
      <div className="space-y-0.5 text-sm">
        <p className="text-foreground">{row.original.email || "-"}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.phone || "No phone"}
        </p>
      </div>
    ),
    header: "Contact",
    id: "contact",
    size: 260,
  },
  {
    cell: ({ row }) => (
      <Badge
        className="capitalize"
        variant={customerStatusVariant[row.original.status] ?? "outline"}
      >
        {row.original.status}
      </Badge>
    ),
    header: "Status",
    id: "status",
    size: 120,
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    header: "Added",
    size: 140,
  },
  {
    cell: ({ row }) => (
      <p className="max-w-[320px] truncate text-sm text-muted-foreground">
        {row.original.notes || "-"}
      </p>
    ),
    header: "Notes",
    id: "notes",
    size: 320,
  },
  {
    cell: ({ row }) =>
      canManage ? <CustomerActionsCell customer={row.original} /> : null,
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[250px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      sticky: true,
    },
    size: 260,
  },
];

function CustomerActionsCell({ customer }: { customer: CustomerTableRow }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(customer.status as CustomerStatus);
  const invalidateCustomers = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.customers.get.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.customers.stats.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.filters.customers.queryKey(),
      }),
    ]);
  };
  const updateCustomerMutation = useMutation(
    trpc.customers.update.mutationOptions({
      onSuccess: invalidateCustomers,
    }),
  );
  const deleteCustomerMutation = useMutation(
    trpc.customers.delete.mutationOptions({
      onSuccess: invalidateCustomers,
    }),
  );

  return (
    <div
      className="flex justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <NativeSelect
        className="h-8 min-w-28 text-xs"
        onChange={(event) => setStatus(event.target.value as CustomerStatus)}
        value={status}
      >
        <NativeSelectOption value="active">Active</NativeSelectOption>
        <NativeSelectOption value="vip">VIP</NativeSelectOption>
        <NativeSelectOption value="inactive">Inactive</NativeSelectOption>
      </NativeSelect>
      <Button
        disabled={updateCustomerMutation.isPending}
        onClick={() =>
          updateCustomerMutation.mutate({
            customerId: customer.id,
            status,
          })
        }
        size="sm"
        type="button"
        variant="outline"
      >
        {updateCustomerMutation.isPending ? "Saving..." : "Save"}
      </Button>
      <Button
        className="text-destructive hover:text-destructive"
        disabled={deleteCustomerMutation.isPending}
        onClick={() =>
          deleteCustomerMutation.mutate({ customerId: customer.id })
        }
        size="sm"
        type="button"
        variant="ghost"
      >
        {deleteCustomerMutation.isPending ? "Removing..." : "Remove"}
      </Button>
    </div>
  );
}
