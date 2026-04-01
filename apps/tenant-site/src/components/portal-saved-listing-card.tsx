import type { SavedListingOverview } from "@plotkeys/db";
import Link from "next/link";

import { toggleSavedListingAction } from "../app/portal/actions";

type PortalSavedListingCardProps = {
  actionLabel?: string;
  listing: SavedListingOverview;
  redirectTo: string;
};

export function PortalSavedListingCard({
  actionLabel = "Remove",
  listing,
  redirectTo,
}: PortalSavedListingCardProps) {
  const { property } = listing;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      {property.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={property.title}
          className="h-44 w-full object-cover"
          src={property.imageUrl}
        />
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-blue-100 via-amber-100 to-teal-100" />
      )}

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-muted-foreground,#64748b)]">
            {property.location}
          </p>
          <div className="space-y-1">
            <Link
              className="block text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)] transition hover:text-[color:var(--pk-primary,#0f766e)]"
              href={`/property/${property.id}`}
            >
              {property.title}
            </Link>
            {property.price ? (
              <p className="text-base font-medium text-[color:var(--pk-foreground,#0f172a)]">
                {property.price}
              </p>
            ) : null}
          </div>
          {property.specs ? (
            <p className="text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]">
              {property.specs}
            </p>
          ) : null}
          {(property.bedrooms != null || property.bathrooms != null) ? (
            <div className="flex flex-wrap gap-4 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
              {property.bedrooms != null ? (
                <span>
                  {property.bedrooms} bedroom{property.bedrooms === 1 ? "" : "s"}
                </span>
              ) : null}
              {property.bathrooms != null ? (
                <span>
                  {property.bathrooms} bathroom{property.bathrooms === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--pk-muted-foreground,#64748b)]">
            Saved {listing.savedAt.toLocaleDateString()}
          </p>
          <form action={toggleSavedListingAction}>
            <input name="mode" type="hidden" value="remove" />
            <input name="propertyId" type="hidden" value={property.id} />
            <input name="redirectTo" type="hidden" value={redirectTo} />
            <button
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] px-4 py-2 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
              type="submit"
            >
              {actionLabel}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
