export type DatabaseClient = {
  status: "connected";
};

export function createDatabaseClient(): DatabaseClient {
  return {
    status: "connected",
  };
}
