export const jobIds = {
  qaPurge: "platform.qa.purge",
  domainConnectionSync: "domains.connection.sync",
  emailSmokeTest: "email-smoke-test",
  notification: "notification",
  notificationDispatch: "notifications.dispatch",
  planSync: "plans.sync",
  siteContentGeneration: "website.content.generate",
};

export { runInBackground, runWithRetry } from "./queue";
export type { JobHandler, JobRecord, JobStatus, RetryOptions } from "./queue";
export { isTriggerConfigured, triggerJob } from "./trigger";
export { domainSyncHandler } from "./handlers/domain-sync";
export type { DomainSyncPayload } from "./handlers/domain-sync";
export {
  emailSmokeTestHandler,
  emailSmokeTestPayloadSchema,
} from "./handlers/email-smoke-test";
export type {
  EmailSmokeTestPayload,
  EmailSmokeTestResult,
} from "./handlers/email-smoke-test";
export {
  contactFormPayloadSchema,
  newsletterSignupPayloadSchema,
  notificationDispatchPayloadSchema,
  notificationDispatchHandler,
  notificationHandler,
  propertyInquiryPayloadSchema,
} from "./handlers/notification-dispatch";
export type {
  ContactFormPayload,
  NewsletterSignupPayload,
  NotificationDispatchPayload,
  NotificationDispatchResult,
  PropertyInquiryPayload,
} from "./handlers/notification-dispatch";
export type { NotificationTaskPayload } from "@plotkeys/notifications";
export { planSyncHandler } from "./handlers/plan-sync";
export type { PlanSyncPayload } from "./handlers/plan-sync";
export { siteContentGenerationHandler } from "./handlers/site-content-generation";
export { qaPurgeHandler } from "./handlers/qa-purge";
export type { SiteContentGenerationPayload } from "./handlers/site-content-generation";
