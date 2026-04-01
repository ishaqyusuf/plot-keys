import { PortalCard, PortalPage } from "../../../components/portal-page";
import { getPortalCustomerSession } from "../../../lib/customer-session";

export default async function PortalAccountPage() {
  const session = await getPortalCustomerSession();

  return (
    <PortalPage
      description="Account settings stay in the shared portal so identity, contact details, and communication preferences use one consistent customer experience."
      eyebrow="Customer workspace"
      title="Account"
    >
      <PortalCard title="Profile & preferences">
        <div className="space-y-3 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
          <p>
            <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
              Full name:
            </span>{" "}
            {session?.customer.name ?? "—"}
          </p>
          <p>
            <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
              Email:
            </span>{" "}
            {session?.user.email ?? "—"}
          </p>
          <p>
            <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
              Phone:
            </span>{" "}
            {session?.customer.phone ?? session?.user.phoneNumber ?? "Not set"}
          </p>
          <p>
            Contact preferences, verification settings, and stronger account
            security will expand here in the next phases.
          </p>
        </div>
      </PortalCard>
    </PortalPage>
  );
}
