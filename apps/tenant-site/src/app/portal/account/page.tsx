import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalAccountPage() {
  return (
    <PortalPage
      description="Account settings stay in the shared portal so identity, contact details, and communication preferences use one consistent customer experience."
      eyebrow="Customer workspace"
      title="Account"
    >
      <PortalCard title="Profile & preferences">
        <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
          Customer profile details, contact preferences, and future document or
          verification settings will live on this shared account page.
        </p>
      </PortalCard>
    </PortalPage>
  );
}
