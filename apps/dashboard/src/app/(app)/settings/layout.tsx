import type { ReactNode } from "react";

import { ScrollableContent } from "@/components/scrollable-content";
import { SecondaryMenu } from "@/components/secondary-menu";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <ScrollableContent>
      <div className="max-w-[800px]">
        <SecondaryMenu
          items={[
            { path: "/settings", label: "General" },
            { path: "/settings/notifications", label: "Notifications" },
            { path: "/settings/integrations", label: "Integrations" },
          ]}
        />

        <main className="mt-8">{children}</main>
      </div>
    </ScrollableContent>
  );
}
