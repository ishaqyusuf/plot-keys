import { PremiumLandingPage } from "./premium-landing-page";

export function EarlyAccessPage({
  showLandingPreviewLink: _showLandingPreviewLink = false,
}: {
  showLandingPreviewLink?: boolean;
}) {
  return <PremiumLandingPage />;
}
