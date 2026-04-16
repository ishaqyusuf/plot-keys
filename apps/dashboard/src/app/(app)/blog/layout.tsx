import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function BlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("blog");
  return children;
}
