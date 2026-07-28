import {
  createCustomDomainPair,
  findCompanyById,
  findTenantDomainByHostname,
  listCustomDomainsWithVerification,
  listSyncableTenantDomains,
  listTenantDomainsForCompany,
  removeCustomDomain,
} from "@plotkeys/db/queries";
import { domainSyncHandler, triggerJob } from "@plotkeys/jobs";
import { domainSyncTask } from "@plotkeys/jobs/tasks";
import {
  buildDnsInstructions,
  extractApexDomain,
  isValidDomainName,
  isVercelDomainProvisioningConfigured,
  plotkeysRootDomain,
  searchDomainAvailability,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  connectDomainInputSchema,
  removeDomainInputSchema,
  searchDomainsInputSchema,
} from "../schemas/domains.schema";

export const domainsRouter = createTRPCRouter({
  connect: membershipProcedure
    .input(connectDomainInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;
      const hostname = input.hostname
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/:\d+$/, "");

      if (!isValidDomainName(hostname)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid domain name. Enter a valid domain like example.com or example.com.ng.",
        });
      }

      if (hostname.endsWith(`.${plotkeysRootDomain}`)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "PlotKeys subdomains are created automatically during onboarding.",
        });
      }

      const existingSitefront = await findTenantDomainByHostname(db, hostname);
      if (existingSitefront) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            existingSitefront.companyId === companyId
              ? "This domain is already connected to your workspace."
              : "This domain is already in use by another workspace.",
        });
      }

      const dashboardHostname = `dashboard.${hostname}`;
      const existingDashboard = await findTenantDomainByHostname(
        db,
        dashboardHostname,
      );
      if (existingDashboard) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This domain is already in use.",
        });
      }

      let domain: Awaited<ReturnType<typeof createCustomDomainPair>>;
      try {
        domain = await createCustomDomainPair(db, {
          apexDomain: extractApexDomain(hostname),
          companyId,
          hostname,
        });
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This domain was just claimed by another request. Please try again.",
          });
        }
        throw error;
      }

      if (isVercelDomainProvisioningConfigured()) {
        await triggerJob(
          domainSyncTask,
          domainSyncHandler,
          { companyId },
          { baseDelayMs: 2000, maxAttempts: 4 },
        );
      }

      return {
        dnsInstructions: buildDnsInstructions(hostname),
        domain: {
          hostname: domain.hostname,
          id: domain.id,
          status: domain.status,
        },
      };
    }),

  dnsInstructions: membershipProcedure.query(async ({ ctx }) => {
    const customDomains = await listCustomDomainsWithVerification(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );

    return customDomains
      .filter((domain) => domain.kind === "sitefront_custom_domain")
      .map((domain) => {
        const verificationChallenges = Array.isArray(domain.verificationJson)
          ? (domain.verificationJson as Array<{
              domain: string;
              type: string;
              value: string;
            }>)
          : undefined;

        return {
          hostname: domain.hostname,
          id: domain.id,
          instructions: buildDnsInstructions(
            domain.hostname,
            verificationChallenges,
          ),
          lastError: domain.lastError,
          provisionedAt: domain.provisionedAt,
          status: domain.status,
        };
      });
  }),

  remove: membershipProcedure
    .input(removeDomainInputSchema)
    .mutation(async ({ ctx, input }) => {
      const removed = await removeCustomDomain(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        domainId: input.domainId,
      });

      if (!removed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Custom domain not found or already removed.",
        });
      }

      return { hostname: removed.hostname, removed: true };
    }),

  search: membershipProcedure
    .input(searchDomainsInputSchema)
    .query(async ({ input }) => {
      return searchDomainAvailability(input.label, input.tlds);
    }),

  status: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;
    const domains = await listTenantDomainsForCompany(db, companyId);
    const company = await findCompanyById(db, companyId);

    return {
      allProvisioned:
        domains.length > 0 &&
        domains.every((domain) => domain.status === "active"),
      companyName: company?.name ?? "your workspace",
      domainProvisioningConfigured: isVercelDomainProvisioningConfigured(),
      domains: domains.map((domain) => ({
        hostname: domain.hostname,
        id: domain.id,
        kind: domain.kind,
        lastError: domain.lastError,
        provisionedAt: domain.provisionedAt,
        status: domain.status,
      })),
      hasFailure: domains.some((domain) => domain.status === "failed"),
    };
  }),

  sync: membershipProcedure.mutation(async ({ ctx }) => {
    if (!isVercelDomainProvisioningConfigured()) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Vercel domain provisioning env vars are not configured.",
      });
    }

    const companyId = ctx.auth.activeMembership.companyId;
    const domains = await listSyncableTenantDomains(ctx.db.db, companyId);

    if (domains.length === 0) {
      return { queued: false, queuedCount: 0 };
    }

    await triggerJob(
      domainSyncTask,
      domainSyncHandler,
      { companyId },
      {
        baseDelayMs: 2000,
        maxAttempts: 4,
      },
    );

    return { queued: true, queuedCount: domains.length };
  }),
});
