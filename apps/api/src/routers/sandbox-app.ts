import { createTRPCRouter } from "../lib.trpc";
import { signInProcedure } from "./auth.route";
import { templateSandboxRouter } from "./template-sandbox.route";

/**
 * Same-origin API mounted by the standalone Sandbox app.
 * Production dashboard, tenant, billing, and workspace contracts stay absent.
 */
export const sandboxAppRouter = createTRPCRouter({
  auth: createTRPCRouter({
    signIn: signInProcedure,
  }),
  templateSandbox: templateSandboxRouter,
});

export type SandboxAppRouter = typeof sandboxAppRouter;
