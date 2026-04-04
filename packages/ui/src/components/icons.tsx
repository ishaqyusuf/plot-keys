/**
 * Centralized icon namespace for PlotKeys.
 *
 * All icon imports across the project must go through this file.
 * Usage: import { Icon } from "@plotkeys/ui/icons"
 *        <Icon.Home className="size-4" />
 *
 * Library: @hugeicons/react (v0.6)
 */

import {
  AiNetworkIcon,
  Alert01Icon,
  AlertCircleIcon,
  Analytics01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Award01Icon,
  Briefcase01Icon,
  Building02Icon,
  BubbleChatIcon,
  Calendar01Icon,
  CalendarRemove01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  CheckmarkCircle01Icon,
  ChefHatIcon,
  CreditCardAcceptIcon,
  DashboardCircleIcon,
  Delete01Icon,
  Download01Icon,
  EyeIcon,
  FavouriteIcon,
  File01Icon,
  Globe02Icon,
  HandGripIcon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  Invoice01Icon,
  LinkSquare01Icon,
  Loading01Icon,
  Mail01Icon,
  MinusSignIcon,
  Moon01Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  PaintBrush01Icon,
  PlusSignCircleIcon,
  PlusSignIcon,
  RoboticIcon,
  Search01Icon,
  Settings01Icon,
  Settings02Icon,
  SidebarLeft01Icon,
  SparklesIcon,
  Store01Icon,
  Sun01Icon,
  Target01Icon,
  Tick01Icon,
  Triangle01Icon,
  UserGroupIcon,
  UserMultiple02Icon,
  UserSettings01Icon,
  ViewOffIcon,
} from "@hugeicons/react";
import type { SVGProps } from "react";

// ---------------------------------------------------------------------------
// Tiny inline SVG for radio/select dot indicator (no hugeicons equivalent)
// ---------------------------------------------------------------------------
function CircleDot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Icon namespace — one place to add, rename, or swap icons project-wide
// ---------------------------------------------------------------------------
export const Icon = {
  // Navigation / UI chrome
  ChevronDown: ArrowDown01Icon,
  ChevronUp: ArrowUp01Icon,
  ChevronLeft: ArrowLeft01Icon,
  ChevronRight: ArrowRight01Icon,
  ArrowLeft: ArrowLeft01Icon,
  ArrowRight: ArrowRight01Icon,
  PanelLeft: SidebarLeft01Icon,
  MoreHorizontal: MoreHorizontalIcon,
  GripVertical: HandGripIcon,
  ExternalLink: LinkSquare01Icon,

  // Actions
  Check: Tick01Icon,
  Close: Cancel01Icon,
  Search: Search01Icon,
  Download: Download01Icon,
  Plus: PlusSignIcon,
  PlusCircle: PlusSignCircleIcon,
  Minus: MinusSignIcon,
  Delete: Delete01Icon,

  // Status / feedback
  CheckCircle: CheckmarkBadge01Icon,
  CheckmarkCircle: CheckmarkCircle01Icon,
  Circle: CircleDot,
  Star: FavouriteIcon,
  Info: InformationCircleIcon,
  AlertCircle: AlertCircleIcon,
  Warning: Alert01Icon,
  TriangleAlert: Triangle01Icon,

  // Theme
  Sun: Sun01Icon,
  Moon: Moon01Icon,
  Loader: Loading01Icon,

  // View
  Eye: EyeIcon,
  EyeOff: ViewOffIcon,
  Image: Image01Icon,

  // Messaging
  MessageCircle: BubbleChatIcon,

  // Dashboard / navigation labels
  Home: Home01Icon,
  Builder: PaintBrush01Icon,
  Globe: Globe02Icon,
  Building: Building02Icon,
  Users: UserMultiple02Icon,
  UsersGroup: UserGroupIcon,
  Mail: Mail01Icon,
  Calendar: Calendar01Icon,
  CalendarOff: CalendarRemove01Icon,
  Analytics: Analytics01Icon,
  Bell: Notification01Icon,
  Bot: RoboticIcon,
  Briefcase: Briefcase01Icon,
  CreditCard: CreditCardAcceptIcon,
  File: File01Icon,
  HardHat: ChefHatIcon,
  Dashboard: DashboardCircleIcon,
  Network: AiNetworkIcon,
  Receipt: Invoice01Icon,
  Settings: Settings01Icon,
  Settings2: Settings02Icon,
  Sparkles: SparklesIcon,
  Store: Store01Icon,
  UserSettings: UserSettings01Icon,
  Target: Target01Icon,
  Award: Award01Icon,
} as const;

export type IconName = keyof typeof Icon;
export type IconComponent = (typeof Icon)[IconName];
