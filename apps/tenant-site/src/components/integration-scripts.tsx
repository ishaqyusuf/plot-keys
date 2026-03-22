"use client";

import Script from "next/script";

type IntegrationScriptsProps = {
  googleAnalyticsId?: string | null;
  facebookPixelId?: string | null;
};

/**
 * Injects third-party tracking scripts (GA4, Facebook Pixel) into
 * the tenant site based on the company's configured integrations.
 *
 * Rendered in the root layout so scripts load on every page.
 */
export function IntegrationScripts({
  googleAnalyticsId,
  facebookPixelId,
}: IntegrationScriptsProps) {
  if (!googleAnalyticsId && !facebookPixelId) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAnalyticsId.replace(/'/g, "")}');`}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${facebookPixelId.replace(/'/g, "")}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
