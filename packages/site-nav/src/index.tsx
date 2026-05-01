export { Header } from "./components/header";
export { MobileSidebar } from "./components/mobile-sidebar";
export { NavChildItem } from "./components/nav-child-item";
export { NavItem } from "./components/nav-item";
export { NavLink } from "./components/nav-link";
export { NavsList } from "./components/navs-list";
export { Sidebar } from "./components/sidebar";
export { SidebarShell } from "./components/sidebar-shell";
export {
  createSiteNavContext,
  SiteNavContext,
  type SiteNavContextValue,
  useCreateSiteNavContext,
  useSiteNav,
} from "./components/use-site-nav";
export {
  createNavLink,
  createNavModule,
  createNavSection,
  createNavSubLink,
} from "./lib/types";
export * from "./lib/utils";

import { Header } from "./components/header";
import { MobileSidebar } from "./components/mobile-sidebar";
import { NavsList } from "./components/navs-list";
import { Sidebar } from "./components/sidebar";
import { SidebarShell } from "./components/sidebar-shell";
import { SiteNavContext } from "./components/use-site-nav";

export const SiteNav = {
  Header,
  MobileSidebar,
  NavsList,
  Provider: SiteNavContext.Provider,
  Shell: SidebarShell,
  Sidebar,
};
