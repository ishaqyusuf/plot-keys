import { getCompanyAppsContext } from "@/lib/company-apps";
import { AppStoreView } from "./app-store-view";

type Props = {
  q?: string;
  tab?: string;
};

export async function AppStoreContent({ q, tab }: Props) {
  const context = await getCompanyAppsContext();

  return <AppStoreView context={context} q={q} tab={tab} />;
}
