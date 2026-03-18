/**
 * @plotkeys/platform-integrations
 *
 * Provider-agnostic platform integration helpers.
 *
 * Exports:
 *   - `./storage` — shared storage abstraction and bucket constants
 *   - `./supabase` — Supabase-specific client factory and storage helpers
 *
 * Consumers should import from the specific sub-path when possible so
 * tree-shaking can eliminate unused providers.
 */

export * from "./storage";
export * from "./supabase";
