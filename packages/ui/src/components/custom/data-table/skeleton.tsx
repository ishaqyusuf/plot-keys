"use client";

import { Skeleton } from "../../skeleton";

export function DataTableSkeleton() {
  const rows = [
    "row-one",
    "row-two",
    "row-three",
    "row-four",
    "row-five",
    "row-six",
    "row-seven",
    "row-eight",
  ];

  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full" />
      {rows.map((row) => (
        <Skeleton className="h-12 w-full" key={row} />
      ))}
    </div>
  );
}
