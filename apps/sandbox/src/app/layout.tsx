import "@plotkeys/ui/globals.css";

import { Toaster } from "@plotkeys/ui/sonner";
import { ThemeProvider } from "@plotkeys/ui/theme-provider";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { TRPCReactProvider } from "@/trpc/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  description: "Dedicated PlotKeys template testing environment",
  title: "PlotKeys Sandbox",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <TRPCReactProvider>
              {children}
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
