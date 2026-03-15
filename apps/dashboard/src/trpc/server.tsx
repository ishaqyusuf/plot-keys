import "server-only";

import type { AppRouter } from "@plotkeys/api/router";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
} from "@trpc/client";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import superjson from "superjson";

import { getBaseUrl } from "../lib/get-base-url";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

function createServerLink(url: string) {
  return [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      transformer: superjson,
      url,
    }),
  ];
}

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient<AppRouter>({
    links: createServerLink(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3901"}/api/trpc`,
    ),
  }),
  queryClient: getQueryClient,
});

export async function getServerTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: createServerLink(`${await getBaseUrl()}/api/trpc`),
  });
}

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();

  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
