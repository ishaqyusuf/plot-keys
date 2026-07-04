"use client";

import { Button } from "@plotkeys/ui/button";
import { UsersIcon } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { useCustomerParams } from "@/hooks/use-customer-params";

type CustomersEmptyStateProps = {
  canManage: boolean;
  statusFilter?: string;
};

export function CustomersEmptyState({
  canManage,
  statusFilter,
}: CustomersEmptyStateProps) {
  const { setParams } = useCustomerParams();

  return (
    <DashboardEmptyState
      description={
        statusFilter
          ? `No ${statusFilter} customers yet.`
          : "Add customers directly or convert qualified leads to start building the pipeline."
      }
      icon={<UsersIcon className="size-5" />}
      title="No customers here yet"
      actions={
        canManage ? (
          <Button
            onClick={() => setParams({ createCustomer: true })}
            size="sm"
            type="button"
            variant="outline"
          >
            Add customer
          </Button>
        ) : null
      }
    />
  );
}

export function CustomersNoResults({ onClear }: { onClear: () => void }) {
  return (
    <DashboardEmptyState
      actions={
        <Button onClick={onClear} size="sm" type="button" variant="outline">
          Clear filters
        </Button>
      }
      description="Try another search term or remove the active filters."
      icon={<UsersIcon className="size-5" />}
      title="No matching customers"
    />
  );
}
