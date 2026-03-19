import {
  createPrismaClient,
  getAiCreditBalance,
  getAiUsageStats,
} from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { requireOnboardedSession } from "../../lib/session";
import { purchaseAiCreditsAction } from "../actions";

export default async function AiCreditsPage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;

  const [balance, usage] = await Promise.all([
    getAiCreditBalance(prisma, companyId),
    getAiUsageStats(prisma, companyId),
  ]);

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">AI Credits</h1>
        <p className="text-muted-foreground text-sm">
          Manage your AI credit balance and track usage
        </p>
      </div>

      {/* Balance + Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Credit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{balance}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              credits available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Used (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{usage.totalCreditsUsed}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              across {usage.byFeature.reduce((s: number, f: { count: number }) => s + f.count, 0)} AI calls
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Up */}
      <Card>
        <CardHeader>
          <CardTitle>Top Up Credits</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm flex-1">
            Purchase a block of 100 credits to continue using AI features like
            Smart Fill. Credits never expire.
          </p>
          <form action={purchaseAiCreditsAction}>
            <Button type="submit">Buy 100 Credits</Button>
          </form>
        </CardContent>
      </Card>

      {/* Usage by Feature */}
      {usage.byFeature.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage by Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usage.byFeature.map(
                (f: { feature: string; count: number; creditsUsed: number }) => (
                  <div
                    key={f.feature}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{f.feature}</span>
                    <span className="text-muted-foreground text-sm">
                      {f.creditsUsed} credits / {f.count} calls
                    </span>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
