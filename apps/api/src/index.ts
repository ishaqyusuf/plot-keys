import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";

import { buildRequestContext, createTRPCContext } from "./context";
import { appRouter } from "./routers/_app";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "PlotKeys API",
    status: "ok",
  });
});

app.get("/health", async (c) => {
  const context = buildRequestContext(c.req.raw.headers);

  return c.json({
    api: "ok",
    auth: context.auth.session ? "session-present" : "anonymous",
    companyId: context.auth.activeMembership?.companyId ?? null,
    database: context.db.status,
    timestamp: new Date().toISOString(),
  });
});

app.all("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: createTRPCContext,
  });
});

const port = Number(process.env.PORT ?? 3902);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`API listening on http://localhost:${port}`);
  },
);
