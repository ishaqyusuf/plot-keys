import Link from "next/link";

import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalDashboardPage() {
  return (
    <PortalPage
      description="This shared dashboard is the central home for future customer activity, saved inventory, payments, and account management."
      eyebrow="Portal home"
      title="Customer dashboard"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <PortalCard title="Quick actions">
          <div className="space-y-3 text-sm">
            {[
              { href: "/portal/saved", label: "Review saved listings" },
              { href: "/portal/offers", label: "Track active offers" },
              { href: "/portal/payments", label: "Check payment status" },
            ].map((link) => (
              <Link
                key={link.href}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] px-4 py-3 text-[color:var(--pk-foreground,#0f172a)] transition hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
                href={link.href}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </PortalCard>

        <PortalCard title="Coming online next">
          <ul className="space-y-3 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <li>Saved listings connected to public template overview pages</li>
            <li>Offer status tracking and customer activity history</li>
            <li>Customer-scoped payments, receipts, and account settings</li>
          </ul>
        </PortalCard>

        <PortalCard title="Foundation note">
          <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            The portal now has a shared branded shell under{" "}
            <code>/portal/*</code>. The next phases add customer auth, route
            guards, and tenant-scoped customer data models on top of this
            foundation.
          </p>
        </PortalCard>
      </div>
    </PortalPage>
  );
}
