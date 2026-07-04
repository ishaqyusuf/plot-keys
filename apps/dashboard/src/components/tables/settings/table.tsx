"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";

import { updateCompanyProfileAction } from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { LogoUploadForm } from "@/components/settings/logo-upload-form";
import {
  type CompanySettings,
  SettingsDangerAction,
  SettingsPlanCell,
  SettingsReadOnlyField,
  SettingsShortcutCard,
} from "./columns";

export function SettingsProfileCard({
  canEdit,
  company,
  companyName,
}: {
  canEdit: boolean;
  company: CompanySettings;
  companyName: string;
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Company profile</DashboardSectionTitle>
          <DashboardSectionDescription>
            Update company identity and market information used across the
            workspace and public-facing site.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/70 bg-card/82">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle>Company profile</CardTitle>
          <CardDescription>
            Update your company name and primary market.
            {!canEdit ? " Only owners and admins can edit this." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {canEdit ? (
            <form action={updateCompanyProfileAction} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="company-name">Company name</FieldLabel>
                  <Input
                    id="company-name"
                    name="name"
                    defaultValue={company.name}
                    required
                    placeholder="e.g. Greenfield Realty"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="company-market">
                    Primary market
                  </FieldLabel>
                  <Input
                    id="company-market"
                    name="market"
                    defaultValue={company.market ?? ""}
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
                  />
                </Field>
              </FieldGroup>
              <SubmitButton size="sm" loadingLabel="Saving...">
                Save profile
              </SubmitButton>
            </form>
          ) : (
            <div className="grid gap-4">
              <SettingsReadOnlyField label="Company name">
                {companyName}
              </SettingsReadOnlyField>
              <SettingsReadOnlyField label="Primary market">
                {company.market ?? "-"}
              </SettingsReadOnlyField>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function SettingsWorkspaceCard({
  company,
  companySlug,
}: {
  company: CompanySettings;
  companySlug: string;
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Workspace</DashboardSectionTitle>
          <DashboardSectionDescription>
            Review subdomain, plan level, and current billing status.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/70 bg-card/82">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Read-only information about your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6">
          <SettingsReadOnlyField label="Subdomain">
            {companySlug}
            <span className="font-normal text-muted-foreground">
              .plotkeys.com
            </span>
          </SettingsReadOnlyField>
          <SettingsPlanCell company={company} />
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function SettingsBrandingCard({ logoUrl }: { logoUrl: string | null }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Branding</DashboardSectionTitle>
          <DashboardSectionDescription>
            Keep your logo and workspace presentation aligned across all
            dashboard and site surfaces.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/70 bg-card/82">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle>Company logo</CardTitle>
          <CardDescription>
            Upload your company logo. It will appear in your website header and
            footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <LogoUploadForm currentLogoUrl={logoUrl} />
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function SettingsWorkspaceControls() {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Workspace controls</DashboardSectionTitle>
          <DashboardSectionDescription>
            Jump into connected settings modules for notifications and
            integrations.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <SettingsShortcutCard
        actionLabel="Manage notification preferences"
        description="Choose which events trigger in-app and email notifications."
        href="/settings/notifications"
        title="Notification preferences"
      />
      <SettingsShortcutCard
        actionLabel="Manage integrations"
        description="Connect Google Analytics, Facebook Pixel, WhatsApp, and more."
        href="/settings/integrations"
        title="Integrations"
      />
    </DashboardSection>
  );
}

export function SettingsDangerZone() {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Danger zone</DashboardSectionTitle>
          <DashboardSectionDescription>
            Restricted actions that should stay visually isolated from normal
            workflow controls.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-destructive/30 bg-card/82">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Actions here can have irreversible consequences. Proceed with
            caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <SettingsDangerAction />
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
