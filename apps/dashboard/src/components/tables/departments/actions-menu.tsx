"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import type { DepartmentTableRow } from "./columns";

type Props = {
  row: DepartmentTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const invalidateDepartments = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.departments.list.infiniteQueryKey(),
    });
  };
  const deleteMutation = useMutation(
    trpc.departments.delete.mutationOptions({
      onSuccess: invalidateDepartments,
    }),
  );

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/hr/employees?department=${row.id}`}>
              View employees
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate({ departmentId: row.id });
            }}
          >
            Delete department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
