"use client";

import { cn } from "@plotkeys/utils/cn";

type AnimatedOrbsProps = {
  variant?: "hero" | "subtle";
  className?: string;
};

const orbConfigs = {
  hero: [
    {
      className:
        "left-[-10%] top-[-5%] h-[500px] w-[500px] bg-[var(--primary)] opacity-[0.08] animate-float",
    },
    {
      className:
        "right-[-8%] top-[20%] h-[400px] w-[400px] bg-[var(--accent)] opacity-[0.06] animate-float-slow",
      style: { animationDelay: "2s" },
    },
    {
      className:
        "left-[30%] bottom-[-10%] h-[350px] w-[350px] bg-[var(--primary)] opacity-[0.05] animate-float-slower",
      style: { animationDelay: "4s" },
    },
    {
      className:
        "right-[20%] bottom-[5%] h-[280px] w-[280px] bg-[var(--accent)] opacity-[0.04] animate-float",
      style: { animationDelay: "6s" },
    },
  ],
  subtle: [
    {
      className:
        "left-[-5%] top-[10%] h-[300px] w-[300px] bg-[var(--primary)] opacity-[0.05] animate-float-slow",
    },
    {
      className:
        "right-[-5%] bottom-[10%] h-[250px] w-[250px] bg-[var(--accent)] opacity-[0.04] animate-float-slower",
      style: { animationDelay: "3s" },
    },
  ],
};

export function AnimatedOrbs({
  variant = "hero",
  className,
}: AnimatedOrbsProps) {
  const orbs = orbConfigs[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn("absolute rounded-full blur-[120px]", orb.className)}
          style={orb.style}
        />
      ))}
    </div>
  );
}
