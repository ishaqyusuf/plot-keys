import { EarlyAccessPage } from "../components/marketing/early-access-page";
import { PremiumLandingPage } from "../components/marketing/premium-landing-page";
import { getPublicSiteMode } from "../lib/public-site-mode";

export default function MarketingHomePage() {
  return getPublicSiteMode() === "early-access" ? (
    <EarlyAccessPage />
  ) : (
    <PremiumLandingPage />
  );
}
