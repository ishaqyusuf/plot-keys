export type JobStatus = "pending" | "running" | "completed" | "failed";

export type JobRecord<TPayload = unknown> = {
  attempts: number;
  createdAt: Date;
  id: string;
  lastError?: string;
  maxAttempts: number;
  payload: TPayload;
  status: JobStatus;
  updatedAt: Date;
};

export type JobHandler<TPayload = unknown> = (
  payload: TPayload,
  attempt: number,
) => Promise<void>;

export type RetryOptions = {
  baseDelayMs?: number;
  maxAttempts?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function exponentialBackoff(attempt: number, baseDelayMs = 2000) {
  return baseDelayMs * 2 ** (attempt - 1);
}

export async function runWithRetry<TPayload>(
  handler: JobHandler<TPayload>,
  payload: TPayload,
  options: RetryOptions = {},
): Promise<{ attempts: number; error?: string; success: boolean }> {
  const maxAttempts = options.maxAttempts ?? 4;
  const baseDelayMs = options.baseDelayMs ?? 2000;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await handler(payload, attempt);

      return { attempts: attempt, success: true };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delay = exponentialBackoff(attempt, baseDelayMs);
        await sleep(delay);
      }
    }
  }

  return {
    attempts: maxAttempts,
    error: lastError?.message ?? "Unknown error",
    success: false,
  };
}

export async function runInBackground<TPayload>(
  handler: JobHandler<TPayload>,
  payload: TPayload,
  options: RetryOptions & { onComplete?: (result: { attempts: number; error?: string; success: boolean }) => void } = {},
): Promise<void> {
  // Schedule the job to run asynchronously without blocking
  setImmediate(async () => {
    const result = await runWithRetry(handler, payload, options);

    if (options.onComplete) {
      options.onComplete(result);
    }
  });
}
