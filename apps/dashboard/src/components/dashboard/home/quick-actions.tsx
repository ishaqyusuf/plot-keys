import { Icon, type IconComponent } from "@plotkeys/ui/icons";
import Link from "next/link";

import { DashboardHomeSection } from "@/components/dashboard/home/section";

type QuickAction = {
  href: string;
  icon: IconComponent;
  label: string;
};

const quickActions: QuickAction[] = [
  { href: "/builder", icon: Icon.Builder, label: "Open builder" },
  { href: "/properties", icon: Icon.Building, label: "Properties" },
  { href: "/leads", icon: Icon.Target, label: "Leads" },
  { href: "/appointments", icon: Icon.Calendar, label: "Appointments" },
  { href: "/analytics", icon: Icon.Analytics, label: "Analytics" },
];

const actionClassName =
  "flex items-center gap-1.5 border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-all duration-300 cursor-pointer group";

const iconClassName =
  "text-muted-foreground/40 group-hover:text-foreground transition-colors duration-300";

export function DashboardHomeQuickActions() {
  return (
    <DashboardHomeSection
      description="The highest-value next actions for your workspace."
      title="Quick actions"
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-2">
        {quickActions.map(({ href, icon: ActionIcon, label }) => (
          <Link className={actionClassName} href={href} key={href}>
            <ActionIcon className={iconClassName} height={13} width={13} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </DashboardHomeSection>
  );
}
