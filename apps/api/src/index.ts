import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { buildRequestContext, createTRPCContext } from "./context";
import { appRouter } from "./routers/_app";

const app = new Hono();
const dashboardOrigin =
  process.env.DASHBOARD_APP_URL ?? "http://localhost:3901";

app.use(
  "/trpc/*",
  cors({
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    origin: dashboardOrigin,
  }),
);

app.get("/", (c) => {
  return c.json({
    message: "PlotKeys API",
    status: "ok",
  });
});

app.get("/health", async (c) => {
  const context = await buildRequestContext(c.req.raw.headers);

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
