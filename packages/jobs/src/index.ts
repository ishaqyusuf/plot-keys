export const jobIds = {
  domainConnectionSync: "domains.connection.sync",
  websiteContentGeneration: "website.content.generate",
};

export { runInBackground, runWithRetry } from "./queue";
export type { JobHandler, JobRecord, JobStatus, RetryOptions } from "./queue";
export { domainSyncHandler } from "./handlers/domain-sync";
export type { DomainSyncPayload } from "./handlers/domain-sync";
