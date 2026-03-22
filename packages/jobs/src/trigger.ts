/**
 * Job dispatch utility — routes to Trigger.dev when configured,
 * otherwise falls back to in-memory `runInBackground()`.
 *
 * This allows local dev and environments without `TRIGGER_SECRET_KEY`
 * to still execute jobs synchronously while production uses the
 * persistent Trigger.dev queue.
 */

import type { AnyTask } from "@trigger.dev/sdk/v3";

import type { JobHandler, RetryOptions } from "./queue";
import { runInBackground } from "./queue";

/**
 * Returns true when the Trigger.dev SDK is configured and available.
 */
export function isTriggerConfigured(): boolean {
  return Boolean(process.env.TRIGGER_SECRET_KEY);
}

/**
 * Dispatch a job — uses Trigger.dev when configured, falls back to
 * in-memory `runInBackground()` with exponential retries otherwise.
 *
 * @param task   The Trigger.dev task definition (used only when Trigger.dev is active)
 * @param handler The local handler function (used as fallback)
 * @param payload The job payload
 * @param options Retry options for the fallback path
 */
export async function triggerJob<TPayload>(
  task: AnyTask,
  handler: JobHandler<TPayload>,
  payload: TPayload,
  options: RetryOptions = {},
): Promise<void> {
  if (isTriggerConfigured()) {
    // Dynamic import to avoid bundling Trigger.dev client when not needed
    const { tasks } = await import("@trigger.dev/sdk/v3");
    await tasks.trigger(task.id, payload);
    return;
  }

  // Fallback: execute in-memory with retries
  await runInBackground(handler, payload, options);
}
