import { task } from "@trigger.dev/sdk/v3";

import { domainSyncHandler, type DomainSyncPayload } from "../handlers/domain-sync";

export const domainSyncTask = task({
  id: "domains.connection.sync",
  retry: {
    maxAttempts: 4,
    factor: 2,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 30000,
  },
  run: async (payload: DomainSyncPayload) => {
    await domainSyncHandler(payload);
  },
});
