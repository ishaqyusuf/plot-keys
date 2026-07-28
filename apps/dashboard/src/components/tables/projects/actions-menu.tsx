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
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useProjectCacheInvalidation } from "@/hooks/use-project-cache-invalidation";
import { useTRPC } from "@/trpc/client";
import type { ProjectTableRow } from "./columns";

type Props = {
  row: ProjectTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const invalidateProjectCache = useProjectCacheInvalidation(row.id);
  const updateMutation = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: invalidateProjectCache,
    }),
  );
  const deleteMutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: invalidateProjectCache,
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
            <Link href={`/projects/${row.id}`}>View project</Link>
          </DropdownMenuItem>

          {row.status === "draft" ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={updateMutation.isPending}
                onClick={() => {
                  updateMutation.mutate({
                    projectId: row.id,
                    status: "active",
                  });
                }}
              >
                Activate project
              </DropdownMenuItem>
            </>
          ) : null}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate({ projectId: row.id });
            }}
          >
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
