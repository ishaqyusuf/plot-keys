import type { Metadata } from "next";
import type { SearchParams } from "nuqs";

import { OnboardingPage } from "@/components/onboarding/onboarding-page";

export const metadata: Metadata = {
  title: "Onboarding | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default function Page({ searchParams }: Props) {
  return <OnboardingPage searchParams={searchParams} />;
}
