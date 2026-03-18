import "@plotkeys/ui/globals.css";

import { NotificationsProvider } from "@plotkeys/notifications-react";
import { ThemeProvider } from "@plotkeys/ui/theme-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TRPCReactProvider } from "../trpc/client";

export const metadata: Metadata = {
  title: "PlotKeys Dashboard",
  description: "Internal dashboard for real-estate companies",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <TRPCReactProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
