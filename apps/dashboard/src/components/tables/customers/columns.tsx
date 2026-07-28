"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@plotkeys/ui/alert-dialog";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { Spinner } from "@plotkeys/ui/spinner";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useState } from "react";
import type {
  CustomerStatus,
  CustomerTableRow,
} from "@/components/customer/types";
import { createSelectColumn } from "@/components/tables/core";
import { useCustomerParams } from "@/hooks/use-customer-params";

export type CustomersTableMeta = {
  deleteCustomer?: (customerId: string) => void;
  isDeletingCustomer?: boolean;
  isUpdatingCustomer?: boolean;
  updateCustomerStatus?: (customerId: string, status: CustomerStatus) => void;
};

export const customerStatusVariant: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "outline",
  vip: "secondary",
};

const customerStatusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  vip: "VIP",
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

const ActionsCell = memo(
  ({
    isDeleting,
    isUpdating,
    onDelete,
    onStatusChange,
    row,
  }: {
    isDeleting?: boolean;
    isUpdating?: boolean;
    onDelete?: (customerId: string) => void;
    onStatusChange?: (customerId: string, status: CustomerStatus) => void;
    row: CustomerTableRow;
  }) => {
    const { setParams } = useCustomerParams();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleEdit = useCallback(() => {
      setParams({ customerId: row.id, details: null });
    }, [row.id, setParams]);

    const handleViewDetails = useCallback(() => {
      setParams({ customerId: row.id, details: true });
    }, [row.id, setParams]);

    const handleDelete = useCallback(() => {
      onDelete?.(row.id);
      setDeleteOpen(false);
    }, [onDelete, row.id]);

    const handleStatusChange = useCallback(
      (status: string) => {
        onStatusChange?.(row.id, status as CustomerStatus);
      },
      [onStatusChange, row.id],
    );

    return (
      <div className="flex items-center justify-center w-full">
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="relative">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(event) => event.stopPropagation()}
              >
                <Icon.MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleEdit}>
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewDetails}>
                View details
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    onValueChange={handleStatusChange}
                    value={row.status}
                  >
                    {Object.entries(customerStatusLabels).map(
                      ([value, label]) => (
                        <DropdownMenuRadioItem
                          disabled={isUpdating}
                          key={value}
                          value={value}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ),
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent onClick={(event) => event.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete customer?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes {row.name} from your customer records. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="relative"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                <span className={isDeleting ? "invisible" : undefined}>
                  Delete
                </span>
                {isDeleting ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="h-4 w-4" />
                  </span>
                ) : null}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  },
);

ActionsCell.displayName = "ActionsCell";

export const columns = (canManage: boolean): ColumnDef<CustomerTableRow>[] => [
  createSelectColumn<CustomerTableRow>(),
  {
    accessorKey: "name",
    cell: ({ row }) => <CustomerCell customer={row.original} />,
    enableResizing: true,
    header: "Name",
    id: "name",
    maxSize: 500,
    meta: {
      className:
        "w-[320px] min-w-[240px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Name",
      skeleton: { type: "avatar-text", width: "w-40" },
      sticky: true,
    },
    minSize: 240,
    size: 320,
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
    meta: {
      headerLabel: "Contact",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 260,
  },
  {
    cell: ({ row }) => (
      <Badge
        variant={customerStatusVariant[row.original.status] ?? "outline"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
    header: "Status",
    id: "status",
    meta: {
      headerLabel: "Status",
      skeleton: { type: "badge", width: "w-16" },
    },
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
    id: "createdAt",
    meta: {
      headerLabel: "Added",
      skeleton: { type: "text", width: "w-20" },
    },
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
    meta: {
      headerLabel: "Notes",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 320,
  },
  {
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomersTableMeta | undefined;

      return canManage ? (
        <ActionsCell
          isDeleting={meta?.isDeletingCustomer}
          isUpdating={meta?.isUpdatingCustomer}
          onDelete={meta?.deleteCustomer}
          onStatusChange={meta?.updateCustomerStatus}
          row={row.original}
        />
      ) : null;
    },
    header: "Actions",
    id: "actions",
    meta: {
      className:
        "w-[80px] min-w-[80px] md:sticky md:right-0 bg-background group-hover:bg-muted z-30 justify-center !border-l !border-border",
      headerLabel: "Actions",
      skeleton: { type: "icon" },
      sticky: true,
    },
    size: 80,
  },
];
