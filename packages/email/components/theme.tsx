import { Head, Html } from "@react-email/components";
import type { ReactNode } from "react";

export function getEmailThemeClasses() {
  return {
    body: "bg-[#f5f7fb] text-slate-950",
    container: "bg-white border border-slate-200 rounded-[24px]",
    heading: "text-slate-950",
    link: "text-teal-700",
    mutedText: "text-slate-500",
    text: "text-slate-700",
  };
}

export function getEmailInlineStyles() {
  return {
    body: {
      backgroundColor: "#f5f7fb",
      color: "#0f172a",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      margin: "0 auto",
    },
    container: {
      backgroundColor: "#ffffff",
      borderColor: "#e2e8f0",
      borderRadius: "24px",
    },
    mutedText: {
      color: "#64748b",
    },
    text: {
      color: "#334155",
    },
  };
}

export function EmailThemeProvider({
  children,
  preview,
}: {
  children: ReactNode;
  preview?: ReactNode;
}) {
  return (
    <Html>
      <Head />
      {preview}
      {children}
    </Html>
  );
}
