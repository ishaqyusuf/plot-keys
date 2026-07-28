import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CustomerTableRow =
  RouterOutputs["customers"]["get"]["data"][number];
export type CustomerStatus = "active" | "inactive" | "vip";
