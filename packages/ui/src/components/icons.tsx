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
// Tiny inline SVG fallbacks for icons without a hugeicons equivalent
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

function EditPencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="11" rx="2" width="18" x="3" y="11" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LogOutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function RefreshCcwIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 2v6h6" />
      <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
      <path d="M21 22v-6h-6" />
      <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function ChevronsUpDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function ShuffleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7L14 7.7A4.2 4.2 0 0 1 17.3 6H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.4c1.3 0 2.5.6 3.3 1.7l1.1 1.4" />
      <path d="M14.2 14.9 16 17.3a4.2 4.2 0 0 0 3.3 1.7H22" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  );
}

function TemplateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function RowsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="4" rx="1" width="18" x="3" y="5" />
      <rect height="4" rx="1" width="18" x="3" y="15" />
    </svg>
  );
}

function HexagonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 16V8l-9-5-9 5v8l9 5Z" />
    </svg>
  );
}

function SlidersHorizontalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 4h-7" />
      <path d="M10 4H3" />
      <path d="M21 12h-9" />
      <path d="M8 12H3" />
      <path d="M21 20h-5" />
      <path d="M12 20H3" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="14" cy="20" r="2" />
    </svg>
  );
}

function WrenchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.7 6.3a4 4 0 0 0 5 5L10 21l-5-5Z" />
      <path d="m16 8 2-2" />
    </svg>
  );
}

function SubdirectoryArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 10 4 15l5 5" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
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
  ArrowBack: ArrowLeft01Icon,
  ArrowForward: ArrowRight01Icon,
  ArrowDown: ArrowDown01Icon,
  ArrowDownward: ArrowDown01Icon,
  ArrowLeft: ArrowLeft01Icon,
  ArrowRight: ArrowRight01Icon,
  ArrowUp: ArrowUp01Icon,
  ArrowUpward: ArrowUp01Icon,
  PanelLeft: SidebarLeft01Icon,
  Menu: MenuIcon,
  LogOut: LogOutIcon,
  ChevronsUpDown: ChevronsUpDownIcon,
  MoreHorizontal: MoreHorizontalIcon,
  MoreVertical: MoreVerticalIcon,
  GripVertical: HandGripIcon,
  ExternalLink: LinkSquare01Icon,

  // Actions
  Check: Tick01Icon,
  Clear: Cancel01Icon,
  Close: Cancel01Icon,
  Search: Search01Icon,
  Download: Download01Icon,
  Filter: Settings02Icon,
  Tune: Settings02Icon,
  Add: PlusSignIcon,
  Plus: PlusSignIcon,
  PlusCircle: PlusSignCircleIcon,
  Minus: MinusSignIcon,
  Delete: Delete01Icon,
  Edit: EditPencil,
  RefreshCcw: RefreshCcwIcon,
  Code: CodeIcon,
  Shuffle: ShuffleIcon,
  Template: TemplateIcon,
  Rows: RowsIcon,
  Hexagon: HexagonIcon,
  SlidersHorizontal: SlidersHorizontalIcon,
  Wrench: WrenchIcon,
  SubdirectoryArrowLeft: SubdirectoryArrowLeftIcon,

  // Status / feedback
  Lock: LockIcon,
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
