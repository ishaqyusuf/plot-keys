"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
};

export function Portal({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
}
