import { task } from "@trigger.dev/sdk/v3";

import { planSyncHandler, type PlanSyncPayload } from "../handlers/plan-sync";

export const planSyncTask = task({
  id: "plans.sync",
  retry: {
    maxAttempts: 4,
    factor: 2,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: PlanSyncPayload) => {
    await planSyncHandler(payload, 1);
  },
});
