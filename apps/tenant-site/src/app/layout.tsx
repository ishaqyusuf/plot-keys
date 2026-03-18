import "@plotkeys/ui/globals.css";

import { NotificationsProvider } from "@plotkeys/notifications-react";
import { ThemeProvider } from "@plotkeys/ui/theme-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PlotKeys Tenant Site",
  description: "Structured tenant website renderer for PlotKeys",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <NotificationsProvider>{children}</NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
