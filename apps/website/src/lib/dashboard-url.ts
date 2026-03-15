export function getDashboardUrl() {
  return (
    process.env.DASHBOARD_APP_URL ??
    process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ??
    "https://app.plotkeys.com"
  );
}
