import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function HrLayout({ children }: { children: ReactNode }) {
  await assertAppEnabledById("hrm");
  return children;
}
