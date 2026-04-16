import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function LeadsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("listings");
  return children;
}
