"use client";

import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { type Estate, EstateLaunchCard } from "./columns";
import { EstatesEmptyState } from "./empty-states";

export function EstatesList({ estates }: { estates: Estate[] }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Launches</DashboardSectionTitle>
          <DashboardSectionDescription>
            Estate presales sit inside Listings as grouped land inventory. The
            launch workspace keeps flyer copy, uploads, offers, and purchase
            requests together.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>

      {estates.length === 0 ? (
        <EstatesEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {estates.map((estate) => (
            <EstateLaunchCard key={estate.id} estate={estate} />
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
