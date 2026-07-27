import { createHmac, timingSafeEqual } from "node:crypto";
import {
  adoptQaCompanyCandidates,
  createQaPurgeRun,
  discoverQaCompanyCandidates,
  getQaPurgeRun,
  previewQaPurge,
} from "@plotkeys/db";
import { qaPurgeHandler, triggerJob } from "@plotkeys/jobs";
import { qaPurgeTask } from "@plotkeys/jobs/tasks";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, platformAdminProcedure } from "../lib.trpc";

const confirmation = "PURGE ALL QA DATA";

function getSecret() {
  const value =
    process.env.QA_MAINTENANCE_SECRET?.trim() ??
    process.env.BETTER_AUTH_SECRET?.trim() ??
    process.env.AUTH_SECRET?.trim();
  if (!value) throw new Error("QA maintenance secret is not configured.");
  return value;
}

function sign(fingerprint: string, expiresAt: number) {
  const payload = `${expiresAt}.${fingerprint}`;
  return `${payload}.${createHmac("sha256", getSecret()).update(payload).digest("hex")}`;
}

function verify(token: string, fingerprint: string) {
  const [rawExpiry, signedFingerprint, signature] = token.split(".");
  const expiry = Number(rawExpiry);
  if (
    !signature ||
    signedFingerprint !== fingerprint ||
    !Number.isFinite(expiry) ||
    expiry <= Date.now()
  ) {
    return false;
  }
  const expected = sign(fingerprint, expiry).split(".").at(-1) ?? "";
  return (
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}

function requireDb<T>(db: T | null): T {
  if (!db) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Database is unavailable.",
    });
  }
  return db;
}

export const qaMaintenanceRouter = createTRPCRouter({
  candidates: platformAdminProcedure.query(({ ctx }) =>
    discoverQaCompanyCandidates(requireDb(ctx.db.db)),
  ),
  adopt: platformAdminProcedure
    .input(z.object({ companyIds: z.array(z.string().uuid()).min(1) }))
    .mutation(({ ctx, input }) =>
      adoptQaCompanyCandidates(requireDb(ctx.db.db), input.companyIds),
    ),
  preview: platformAdminProcedure.query(async ({ ctx }) => {
    const preview = await previewQaPurge(requireDb(ctx.db.db));
    const expiresAt = Date.now() + 10 * 60 * 1_000;
    const { assets: _assets, ...safePreview } = preview;
    return {
      ...safePreview,
      previewExpiresAt: new Date(expiresAt).toISOString(),
      previewToken: sign(preview.fingerprint, expiresAt),
    };
  }),
  start: platformAdminProcedure
    .input(
      z.object({
        confirmation: z.literal(confirmation),
        previewToken: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb(ctx.db.db);
      const preview = await previewQaPurge(db);
      if (!verify(input.previewToken, preview.fingerprint)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "The QA purge preview expired or changed.",
        });
      }
      if (!preview.companies.length || preview.blockers.length) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "QA purge is empty or blocked by live resources.",
        });
      }
      const run = await createQaPurgeRun(db, ctx.auth.session.user.id);
      await triggerJob(qaPurgeTask, qaPurgeHandler, { runId: run.id });
      return { id: run.id, status: run.status };
    }),
  run: platformAdminProcedure
    .input(z.object({ runId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      getQaPurgeRun(requireDb(ctx.db.db), input.runId),
    ),
});
