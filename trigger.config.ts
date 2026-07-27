import { syncEnvVars } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk/v3";

const runtimeEnvKeys = [
  "BLOB_READ_WRITE_TOKEN",
  "DATABASE_URL",
  "EMAIL_DELIVERY_MODE",
  "EMAIL_FROM_ADDRESS",
  "EMAIL_QA_DOMAIN_ROUTES",
  "QA_MAINTENANCE_SECRET",
  "RESEND_API_KEY",
  "VERCEL_API_TOKEN",
  "VERCEL_DASHBOARD_PROJECT_ID",
  "VERCEL_SITEFRONT_PROJECT_ID",
  "VERCEL_TEAM_ID",
  "VERCEL_TEAM_SLUG",
] as const;

export default defineConfig({
  project: "plotkeys",
  dirs: ["packages/jobs/src/tasks"],
  build: {
    extensions: [
      syncEnvVars(
        () =>
          Object.fromEntries(
            runtimeEnvKeys.flatMap((key) => {
              const value = process.env[key]?.trim();
              return value ? [[key, value]] : [];
            }),
          ),
        { override: true },
      ),
    ],
  },
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 4,
      factor: 2,
      minTimeoutInMs: 2000,
      maxTimeoutInMs: 60000,
    },
  },
});
