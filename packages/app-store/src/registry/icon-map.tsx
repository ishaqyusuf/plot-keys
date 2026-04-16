"use client";

import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CalendarOff,
  CreditCard,
  FileText,
  Globe,
  HardHat,
  Home,
  type LucideIcon,
  Mail,
  Network,
  Paintbrush,
  Plug,
  Receipt,
  Settings,
  Sparkles,
  Store,
  UserRoundCog,
  Users,
  UsersRound,
} from "lucide-react";

import type { IconName } from "./types";

/**
 * Maps the string icon names stored in the (server-safe) registry to their
 * lucide-react components. New entries here must match names used in
 * `apps.ts` and `global-nav.ts`.
 */
export const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CalendarOff,
  CreditCard,
  FileText,
  Globe,
  HardHat,
  Home,
  Mail,
  Network,
  Paintbrush,
  Plug,
  Receipt,
  Settings,
  Sparkles,
  Store,
  UserRoundCog,
  Users,
  UsersRound,
};

export function RegistryIcon({
  className,
  name,
}: {
  className?: string;
  name: IconName;
}) {
  const Icon = ICONS[name] ?? Building2;
  return <Icon className={className} />;
}
