import { redirect } from "next/navigation";

import { getDashboardUrl } from "../../lib/dashboard-url";

export default function WebsiteLoginPage() {
  redirect(`${getDashboardUrl()}/sign-in`);
}
