export const jobIds = {
  domainConnectionSync: "domains.connection.sync",
  notificationDispatch: "notifications.dispatch",
  planSync: "plans.sync",
  siteContentGeneration: "website.content.generate",
};

export { runInBackground, runWithRetry } from "./queue";
export type { JobHandler, JobRecord, JobStatus, RetryOptions } from "./queue";
export { isTriggerConfigured, triggerJob } from "./trigger";
export { domainSyncHandler } from "./handlers/domain-sync";
export type { DomainSyncPayload } from "./handlers/domain-sync";
export { notificationDispatchHandler } from "./handlers/notification-dispatch";
export type {
  ContactFormPayload,
  NewsletterSignupPayload,
  NotificationDispatchPayload,
  PropertyInquiryPayload,
} from "./handlers/notification-dispatch";
export { planSyncHandler } from "./handlers/plan-sync";
export type { PlanSyncPayload } from "./handlers/plan-sync";
export { siteContentGenerationHandler } from "./handlers/site-content-generation";
export type { SiteContentGenerationPayload } from "./handlers/site-content-generation";
