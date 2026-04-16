import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function AiCreditsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("ai-assistant");
  return children;
}
