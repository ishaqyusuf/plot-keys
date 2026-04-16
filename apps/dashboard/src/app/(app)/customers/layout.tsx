import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function CustomersLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("crm");
  return children;
}
