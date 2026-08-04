import "@plotkeys/ui/globals.css";

import { NotificationsProvider } from "@plotkeys/notifications-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  createMarketingSocialMetadata,
  marketingSiteUrl,
} from "@/lib/social-metadata";

const title = "PlotKeys | Real-Estate Operating System";
const description =
  "Run your real-estate company, publish branded property websites, and automate lead capture from one modern platform.";

export const metadata: Metadata = {
  ...createMarketingSocialMetadata({ description, title }),
  metadataBase: new URL(marketingSiteUrl),
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
