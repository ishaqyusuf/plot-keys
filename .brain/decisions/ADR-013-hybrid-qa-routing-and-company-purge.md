# ADR-013: Hybrid QA routing and company purge

## Status

Accepted

## Decision

Separate ordinary email mode from per-recipient QA-domain routing. Persist QA
classification on `Company`, require platform-admin adoption for legacy
candidates, and authorize deletion only from that marker. Run file-first,
provider-aware cleanup in Trigger after a signed preview and exact typed
confirmation. Retain only aggregate purge receipts.

## Consequences

QA can run in production alongside ordinary delivery without identity
rewrites. Live commercial resources block cleanup, while missing files are
idempotent and partial runs are retryable.
