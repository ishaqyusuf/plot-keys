import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOnboardedSession } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Listing details | Plot Keys",
};

export default async function PropertyDetailPage({ params }: Props) {
  await requireOnboardedSession();
  const { id } = await params;

  const redirectParams = new URLSearchParams({
    details: "true",
    propertyId: id,
  });

  redirect(`/properties?${redirectParams.toString()}`);
}
