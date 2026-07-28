import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type DashboardOverview = RouterOutputs["overview"]["summary"];
export type DashboardDomainStatus = DashboardOverview["domainStatuses"][number];
