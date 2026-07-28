import { createTRPCContext } from "@plotkeys/api/context";
import { type AppRouter, appRouter } from "@plotkeys/api/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (request: Request) =>
  fetchRequestHandler<AppRouter>({
    createContext: createTRPCContext,
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
  });

export { handler as GET, handler as POST };
