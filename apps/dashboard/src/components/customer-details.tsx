"use client";

import { Badge } from "@plotkeys/ui/badge";
import { SheetHeader } from "@plotkeys/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { useCustomerParams } from "@/hooks/use-customer-params";
import { useTRPC } from "@/trpc/client";
import { CustomerDetailsSkeleton } from "./customer-details.loading";

const customerStatusVariant: Record<
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="grid gap-1 border-b border-border py-4 last:border-b-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "-"}</dd>
    </div>
  );
}

export function CustomerDetails() {
  const trpc = useTRPC();
  const { customerId } = useCustomerParams();
  const isOpen = Boolean(customerId);

  const { data: customer, isLoading } = useQuery(
    trpc.customers.getById.queryOptions(
      { customerId: customerId! },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );

  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  if (!customer) {
    return (
      <div className="h-full flex flex-col min-h-0 -mx-6">
        <SheetHeader className="flex flex-col px-6 mb-4">
          <h2 className="text-lg font-serif">Customer not found</h2>
          <p className="text-[13px] text-muted-foreground">
            This customer may have been removed or is no longer available.
          </p>
        </SheetHeader>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 -mx-6">
      <SheetHeader className="flex justify-between items-center flex-row px-6 mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-serif">{customer.name}</h2>
          <p className="text-[13px] text-muted-foreground">
            Customer profile and contact details
          </p>
        </div>
        <Badge
          variant={customerStatusVariant[customer.status] ?? "outline"}
          className="shrink-0 capitalize"
        >
          {customer.status}
        </Badge>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <dl>
          <DetailRow label="Email" value={customer.email} />
          <DetailRow label="Phone" value={customer.phone} />
          <DetailRow label="Notes" value={customer.notes} />
          <DetailRow label="Added" value={formatDate(customer.createdAt)} />
        </dl>
      </div>
    </div>
  );
}
