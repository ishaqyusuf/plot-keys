"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { EstatesSummary } from "./summary";
import { EstatesList } from "./table";
import { EstatesPageHeader } from "./table-header";

export function EstatesTable() {
  const trpc = useTRPC();
  const { data: estates } = useSuspenseQuery(
    trpc.workspace.listEstates.queryOptions(),
  );
  const totalListings = estates.reduce(
    (sum, estate) => sum + estate._count.properties,
    0,
  );
  const totalReservations = estates.reduce(
    (sum, estate) => sum + estate._count.reservations,
    0,
  );
  const publishedCount = estates.filter(
    (estate) => estate.publishState === "published",
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <EstatesPageHeader />
      <EstatesSummary
        estateCount={estates.length}
        publishedCount={publishedCount}
        totalListings={totalListings}
        totalReservations={totalReservations}
      />
      <EstatesList estates={estates} />
    </div>
  );
}
