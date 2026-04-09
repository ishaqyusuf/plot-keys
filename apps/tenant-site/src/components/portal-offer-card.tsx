import type { CustomerOfferOverview } from "@plotkeys/db";
import Link from "next/link";

import { withdrawOfferAction } from "../app/portal/actions";

const STATUS_LABEL: Record<CustomerOfferOverview["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_CLASS: Record<CustomerOfferOverview["status"], string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700",
  accepted:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected:
    "border-red-200 bg-red-50 text-red-700",
  withdrawn:
    "border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-surface,#f8fafc)] text-[color:var(--pk-muted-foreground,#64748b)]",
};

type PortalOfferCardProps = {
  offer: CustomerOfferOverview;
  redirectTo: string;
};

export function PortalOfferCard({ offer, redirectTo }: PortalOfferCardProps) {
  const { property } = offer;

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
          {offer.offerAmount ? (
            <p className="text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
              <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Your offer:
              </span>{" "}
              {offer.offerAmount}
            </p>
          ) : null}
          {offer.message ? (
            <p className="line-clamp-2 text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]">
              {offer.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CLASS[offer.status]}`}
          >
            {STATUS_LABEL[offer.status]}
          </span>
          {offer.status === "pending" ? (
            <form action={withdrawOfferAction}>
              <input name="offerId" type="hidden" value={offer.id} />
              <input name="redirectTo" type="hidden" value={redirectTo} />
              <button
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] px-4 py-2 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition hover:border-red-200 hover:text-red-600"
                type="submit"
              >
                Withdraw
              </button>
            </form>
          ) : (
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--pk-muted-foreground,#64748b)]">
              {offer.submittedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
