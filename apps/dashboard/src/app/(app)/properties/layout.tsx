import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function PropertiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("listings");
  return children;
}
