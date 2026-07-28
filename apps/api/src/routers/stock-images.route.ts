import {
  createBillingLineItem,
  grantStockImageLicense,
  hasStockImageLicense,
  listStockImageLicensesForCompany,
} from "@plotkeys/db/queries";
import { getStockImageById } from "@plotkeys/section-registry";
import { stockImagePrice } from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import { purchaseStockImageInputSchema } from "../schemas/stock-images.schema";

export const stockImagesRouter = createTRPCRouter({
  licenses: membershipProcedure.query(async ({ ctx }) => {
    return listStockImageLicensesForCompany(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  purchase: membershipProcedure
    .input(purchaseStockImageInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;
      const image = getStockImageById(input.imageId);

      if (!image) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Image not found." });
      }

      if (image.licenseTier === "free") {
        await grantStockImageLicense(db, {
          companyId,
          imageId: input.imageId,
        });
        return { granted: true, imageId: input.imageId };
      }

      const alreadyLicensed = await hasStockImageLicense(
        db,
        companyId,
        input.imageId,
      );
      if (alreadyLicensed) {
        return { granted: true, imageId: input.imageId };
      }

      await createBillingLineItem(db, {
        amountMinorUnits: stockImagePrice.minorUnits,
        companyId,
        currency: "NGN",
        kind: "stock_image",
        meta: { imageId: input.imageId, imageTitle: image.label },
        paidAt: new Date(),
        status: "active",
      });

      await grantStockImageLicense(db, {
        companyId,
        imageId: input.imageId,
      });

      return { granted: true, imageId: input.imageId };
    }),
});
