import type { ReactNode } from "react";

import { assertAppEnabledById } from "../../../lib/assert-app-enabled";

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await assertAppEnabledById("projects");
  return children;
}
