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
  AlertDialogTrigger,
} from "@plotkeys/ui/alert-dialog";
import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { Sheet, SheetContent, SheetHeader } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { Spinner } from "@plotkeys/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CustomerFormContext,
  type CustomerFormValues,
} from "@/components/customer/form-context";
import type { CustomerTableRow } from "@/components/customer/types";
import { CustomerForm } from "@/components/forms/customer-form";
import { useCustomerParams } from "@/hooks/use-customer-params";
import { useTRPC } from "@/trpc/client";

type EditableCustomer = Pick<
  CustomerTableRow,
  "email" | "name" | "notes" | "phone" | "status"
>;

type CustomerListPage = {
  data?: CustomerTableRow[];
};

type CustomerListCache = {
  pages?: CustomerListPage[];
};

function toCustomerFormValues(customer: EditableCustomer): CustomerFormValues {
  return {
    email: customer.email ?? "",
    name: customer.name,
    notes: customer.notes ?? "",
    phone: customer.phone ?? "",
    status:
      customer.status === "active" ||
      customer.status === "vip" ||
      customer.status === "inactive"
        ? customer.status
        : "active",
  };
}

export function CustomerEditSheet() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { customerId, details, setParams } = useCustomerParams();
  const isOpen = Boolean(customerId && !details);
  const customerPages = queryClient
    .getQueriesData<CustomerListCache>({
      queryKey: trpc.customers.get.infiniteQueryKey(),
    })
    .flatMap(([, data]) => data?.pages ?? []);
  const cachedCustomer = customerPages
    .flatMap((page) => page.data ?? [])
    .find((row) => row.id === customerId);

  const { data: customer, isLoading } = useQuery(
    trpc.customers.getById.queryOptions(
      { customerId: customerId! },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );
  const formCustomer = isLoading ? cachedCustomer : customer;

  const deleteCustomerMutation = useMutation(
    trpc.customers.delete.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.customers.get.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.getById.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.stats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.filters.customers.queryKey(),
          }),
        ]);
        setParams(null);
      },
    }),
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <SheetHeader className="mb-6 flex justify-between items-center flex-row">
          <h2 className="text-xl">Edit Customer</h2>

          {customerId ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" type="button">
                  <Icon.MoreVertical className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={10} align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={(event) => event.preventDefault()}
                    >
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete customer?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will remove the
                        customer from your CRM records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={deleteCustomerMutation.isPending}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="relative"
                        disabled={deleteCustomerMutation.isPending}
                        onClick={() => {
                          deleteCustomerMutation.mutate({ customerId });
                        }}
                      >
                        <span
                          className={
                            deleteCustomerMutation.isPending
                              ? "invisible"
                              : undefined
                          }
                        >
                          Delete
                        </span>
                        {deleteCustomerMutation.isPending ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Spinner className="h-4 w-4" />
                          </span>
                        ) : null}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </SheetHeader>

        {isLoading && !cachedCustomer ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : formCustomer ? (
          <CustomerFormContext
            defaultValues={toCustomerFormValues(formCustomer)}
            key={`${formCustomer.id}:${isLoading ? "cached" : "detail"}`}
          >
            <CustomerForm
              customerId={formCustomer.id}
              onCancel={() => setParams(null)}
              onSuccess={() => setParams(null)}
            />
          </CustomerFormContext>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
