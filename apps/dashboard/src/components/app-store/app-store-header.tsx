import { APP_REGISTRY } from "@plotkeys/app-store/registry";

import { SearchField } from "@/components/search-field";
import { AppStoreTabs } from "./app-store-tabs";

export function AppStoreHeader() {
  return (
    <div className="flex space-x-4">
      <AppStoreTabs />
      <SearchField placeholder={`Search ${APP_REGISTRY.length} apps`} shallow />
    </div>
  );
}
