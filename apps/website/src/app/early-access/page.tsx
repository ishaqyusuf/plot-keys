import { notFound } from "next/navigation";

import { EarlyAccessPage } from "../../components/marketing/early-access-page";
import { canPreviewPublicSiteModes } from "../../lib/public-site-mode";

export default function EarlyAccessPreviewPage() {
  if (!canPreviewPublicSiteModes()) {
    notFound();
  }

  return <EarlyAccessPage showLandingPreviewLink />;
}
