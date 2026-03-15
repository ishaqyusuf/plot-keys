import "@plotkeys/ui/globals.css";

import { NotificationsProvider } from "@plotkeys/notifications-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tenant Websites",
  description: "Structured tenant website renderer for PlotKeys",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
