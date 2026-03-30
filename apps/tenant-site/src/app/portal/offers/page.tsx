import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalOffersPage() {
  return (
    <PortalPage
      description="Offer tracking belongs to the central portal so every tenant uses the same customer workflow regardless of template family."
      eyebrow="Customer workspace"
      title="Offers"
    >
      <PortalCard title="Offer tracking">
        <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
          Submitted offers, counter-offers, and status history will be wired
          into this shared page in the next customer portal phases.
        </p>
      </PortalCard>
    </PortalPage>
  );
}
