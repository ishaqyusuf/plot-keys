import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "plotkeys",
  dirs: ["packages/jobs/src/tasks"],
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
