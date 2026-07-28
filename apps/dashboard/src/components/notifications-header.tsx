import { NotificationsActions } from "@/components/notifications-actions";
import { NotificationsFilterTabs } from "@/components/notifications-filter-tabs";
import { SearchField } from "@/components/search-field";

export function NotificationsHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SearchField placeholder="Search notifications..." />
        <NotificationsActions />
      </div>
      <NotificationsFilterTabs />
    </div>
  );
}
