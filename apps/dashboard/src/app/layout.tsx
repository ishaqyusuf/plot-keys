import "@plotkeys/ui/globals.css";

import { NotificationsProvider } from "@plotkeys/notifications-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PlotKeys Dashboard",
  description: "Internal dashboard for real-estate companies",
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
