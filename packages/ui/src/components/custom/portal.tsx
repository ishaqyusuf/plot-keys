"use client";

import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  className?: string;
  id: string;
};

export function Portal({ children, className, id }: PortalProps) {
  if (typeof document === "undefined") {
    return null;
  }

  const target = document.getElementById(id);

  if (!target) {
    return null;
  }

  if (className) {
    target.className = className;
  }

  return createPortal(children, target);
}
