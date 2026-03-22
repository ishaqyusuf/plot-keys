import { task } from "@trigger.dev/sdk/v3";

import {
  siteContentGenerationHandler,
  type SiteContentGenerationPayload,
} from "../handlers/site-content-generation";

export const siteContentGenerationTask = task({
  id: "website.content.generate",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 3000,
    maxTimeoutInMs: 60000,
  },
  run: async (payload: SiteContentGenerationPayload) => {
    await siteContentGenerationHandler(payload, 1);
  },
});
