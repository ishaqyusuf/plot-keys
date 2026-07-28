import "server-only";

import type { SandboxAppRouter } from "@plotkeys/api/sandbox-router";
import { buildSandboxUrl } from "@plotkeys/utils/app-urls";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

function createServerLink(url: string) {
  return [
    loggerLink({
      enabled: (options) =>
        process.env.NODE_ENV === "development" ||
        (options.direction === "down" && options.result instanceof Error),
    }),
    httpBatchLink({
      headers: async () => {
        const requestHeaders = await headers();
        return { cookie: requestHeaders.get("cookie") ?? "" };
      },
      transformer: superjson,
      url,
    }),
  ];
}

export const trpc = createTRPCOptionsProxy<SandboxAppRouter>({
  client: createTRPCClient<SandboxAppRouter>({
    links: createServerLink(buildSandboxUrl({ path: "/api/trpc" })),
  }),
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  void getQueryClient()
    .prefetchQuery(queryOptions)
    .catch(() => {
      // The page-level error boundary owns failed server prefetches.
    });
}

export function batchPrefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptionsArray: T[],
) {
  for (const queryOptions of queryOptionsArray) prefetch(queryOptions);
}
