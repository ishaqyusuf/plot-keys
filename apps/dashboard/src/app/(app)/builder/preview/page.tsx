import type { Metadata } from "next";

import { BuilderTemplatePreview } from "@/components/builder/builder-template-preview";

export const metadata: Metadata = {
  title: "Builder Preview | Plot Keys",
};

export default function BuilderPreviewPage() {
  return <BuilderTemplatePreview />;
}
