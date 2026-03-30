import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalPaymentsPage() {
  return (
    <PortalPage
      description="Payments and receipts are planned as central customer workflows, not template-defined pages, so provider integrations and schedules stay consistent."
      eyebrow="Customer workspace"
      title="Payments"
    >
      <PortalCard title="Payment activity">
        <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
          Payment history, due dates, receipts, and provider integrations will
          connect here after the foundational portal routes are in place.
        </p>
      </PortalCard>
    </PortalPage>
  );
}
