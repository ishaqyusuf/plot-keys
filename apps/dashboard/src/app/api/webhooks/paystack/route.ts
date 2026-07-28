import { buildRequestContext } from "@plotkeys/api/context";
import { handlePaystackWebhook } from "@plotkeys/api/paystack-webhook";

export async function POST(request: Request) {
  const context = await buildRequestContext(request.headers);

  if (!context.db.db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  return handlePaystackWebhook(request, context.db.db);
}
