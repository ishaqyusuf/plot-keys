import "@plotkeys/ui/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PlotKeys | Real-Estate Operating System",
  description:
    "Run your real-estate company, publish branded property websites, and automate lead capture from one modern platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
