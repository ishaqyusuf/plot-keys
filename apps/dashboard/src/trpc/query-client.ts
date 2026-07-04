import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

function isUnauthorizedError(error: Error): boolean {
  if ("data" in error && typeof (error as any).data?.code === "string") {
    return (error as any).data.code === "UNAUTHORIZED";
  }

  return false;
}

export function makeQueryClient() {
  return new QueryClient({
    queryCache: isServer
      ? undefined
      : new QueryCache({
          onError: (error) => {
            if (isUnauthorizedError(error)) {
              window.location.href = "/sign-in";
            }
          },
        }),
    defaultOptions: {
      queries: {
        gcTime: 10 * 60 * 1000,
        retry: isServer
          ? false
          : (failureCount, error) => {
              if (isUnauthorizedError(error)) return false;
              return failureCount < 2;
            },
        staleTime: 2 * 60 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
