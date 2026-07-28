"use client";

import { Button } from "@plotkeys/ui/button";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useCustomerFilterParams } from "@/hooks/use-customer-filter-params";
import { useCustomerParams } from "@/hooks/use-customer-params";

type Props = {
  canManage: boolean;
};

export function EmptyState({ canManage }: Props) {
  const { setParams } = useCustomerParams();

  return (
    <CoreEmptyState
      action={
        canManage ? (
          <Button
            variant="outline"
            onClick={() => setParams({ createCustomer: true })}
          >
            Create customer
          </Button>
        ) : null
      }
      description={
        <>
          You haven't created any customers yet. <br />
          Go ahead and create your first one.
        </>
      }
      title="No customers"
    />
  );
}

export function NoResults() {
  const { setFilter } = useCustomerFilterParams();
  const { setParams } = useCustomerParams();

  return (
    <CoreNoResults
      onClear={() => {
        setParams(null);
        void setFilter({
          end: null,
          filter: null,
          q: null,
          sort: null,
          start: null,
        });
      }}
    />
  );
}
