import type { DatabaseClient } from "@plotkeys/db";
import { createDatabaseClient } from "@plotkeys/db";

export type TRPCContext = {
  db: DatabaseClient;
};

export async function createTRPCContext(): Promise<TRPCContext> {
  return {
    db: createDatabaseClient(),
  };
}
