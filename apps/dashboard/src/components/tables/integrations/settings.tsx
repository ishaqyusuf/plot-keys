"use client";

import { Button } from "@plotkeys/ui/button";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { updateIntegrationsAction } from "@/app/actions";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";
import { integrationSettings } from "./catalog";

export function IntegrationSettingsTable() {
  const trpc = useTRPC();
  const { data: integration } = useSuspenseQuery(
    trpc.workspace.getCompanyIntegration.queryOptions(),
  );

  return (
    <>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Settings module</DashboardPageEyebrow>
            <DashboardPageTitle>Integrations</DashboardPageTitle>
            <DashboardPageDescription>
              Connect analytics, messaging, and scheduling services through one
              consistent settings surface instead of scattered ad hoc forms.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href="/settings">Back to settings</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Connected services</DashboardSectionTitle>
            <DashboardSectionDescription>
              Keep operational tools wired into your site and dashboard from
              one quieter Midday-style control panel.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <form action={updateIntegrationsAction} className="grid gap-2.5">
          {integrationSettings.map((item) => (
            <Card key={item.field} className="border-border/65 bg-card/78">
              <CardHeader className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-border/60 bg-background/70 p-2.5">
                    <item.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={item.field}>{item.name}</FieldLabel>
                    <Input
                      id={item.field}
                      name={item.field}
                      defaultValue={integration?.[item.field] ?? ""}
                      placeholder={item.placeholder}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <SubmitButton loadingLabel="Saving...">
              Save integrations
            </SubmitButton>
          </div>
        </form>
      </DashboardSection>
    </>
  );
}
