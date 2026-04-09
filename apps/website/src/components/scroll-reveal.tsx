"use client";

import { cn } from "@plotkeys/utils/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-none",
        isVisible ? "animate-fade-in-up" : "opacity-0",
        className,
      )}
      style={isVisible && delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
