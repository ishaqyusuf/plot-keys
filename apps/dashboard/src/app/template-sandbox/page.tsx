import { getServerTrpcClient } from "@/trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Template Sandbox | Plot Keys",
};

export default async function TemplateSandboxPage() {
  const trpc = await getServerTrpcClient();
  const profile = await trpc.templateSandbox.getOrCreateDefault.query();

  redirect(`/template-sandbox/${profile.id}`);
}
