import { createTRPCContext } from "@plotkeys/api/context";
import {
  type SandboxAppRouter,
  sandboxAppRouter,
} from "@plotkeys/api/sandbox-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (request: Request) =>
  fetchRequestHandler<SandboxAppRouter>({
    createContext: createTRPCContext,
    endpoint: "/api/trpc",
    req: request,
    router: sandboxAppRouter,
  });

export { handler as GET, handler as POST };
