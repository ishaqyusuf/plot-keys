"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { EstatesHeader } from "@/components/estates/estates-header";
import { EstatesList } from "@/components/estates/estates-list";
import { EstatesSummary } from "@/components/estates/estates-summary";
import { useTRPC } from "@/trpc/client";

export function EstatesContent() {
  const trpc = useTRPC();
  const { data: estates } = useSuspenseQuery(trpc.estates.list.queryOptions());
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
      <EstatesHeader />
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
