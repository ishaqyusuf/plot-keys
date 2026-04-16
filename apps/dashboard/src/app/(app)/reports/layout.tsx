import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function ReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("analytics");
  return children;
}
