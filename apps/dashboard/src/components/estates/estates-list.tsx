"use client";

import {
  type Estate,
  EstateLaunchCard,
} from "@/components/estates/estate-launch-card";
import { EstateSection } from "@/components/estates/estate-section";
import { EstatesEmptyState } from "@/components/estates/estates-empty-states";

export function EstatesList({ estates }: { estates: Estate[] }) {
  return (
    <EstateSection
      description="Estate presales sit inside Listings as grouped land inventory. The launch workspace keeps flyer copy, uploads, offers, and purchase requests together."
      title="Launches"
    >
      {estates.length === 0 ? (
        <EstatesEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {estates.map((estate) => (
            <EstateLaunchCard key={estate.id} estate={estate} />
          ))}
        </div>
      )}
    </EstateSection>
  );
}
