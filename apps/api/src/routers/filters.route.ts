import {
  customersPageFilter,
  propertiesPageFilter,
} from "../db/queries/filters";
import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const filtersRouter = createTRPCRouter({
  customers: membershipProcedure.query(async () => customersPageFilter()),
  properties: membershipProcedure.query(async () => propertiesPageFilter()),
});
