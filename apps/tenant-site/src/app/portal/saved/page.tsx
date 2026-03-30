import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalSavedPage() {
  return (
    <PortalPage
      description="Saved listings move into the shared portal so customer account experiences are central, even when public browsing stays template-based."
      eyebrow="Customer workspace"
      title="Saved listings"
    >
      <PortalCard title="Saved inventory">
        <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
          Saved listing records will appear here once customer authentication
          and listing-aware save actions are connected to the portal.
        </p>
      </PortalCard>
    </PortalPage>
  );
}
