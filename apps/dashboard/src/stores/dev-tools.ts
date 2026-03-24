"use client";

/**
 * DevTools store — development-only persistent state for quick testing.
 *
 * Persisted to localStorage under "plotkeys-dev-tools".
 * Pre-seeded with the known test accounts and empty tenant list.
 *
 * Never import this in production code — it is guarded by NODE_ENV checks
 * at the call sites.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DevAccount = {
  /** Company name */
  company: string;
  /** Login email */
  email: string;
  /** Full name */
  name: string;
  /** Plaintext password used at signup */
  password: string;
  /** Company subdomain */
  subdomain: string;
};

export type DevTenant = {
  /** Company display name */
  name: string;
  /** Subdomain slug, e.g. "aster-grove" */
  subdomain: string;
};

type DevToolsState = {
  accounts: DevAccount[];
  tenants: DevTenant[];
  // Actions
  addAccount: (account: DevAccount) => void;
  addTenant: (tenant: DevTenant) => void;
  removeAccount: (email: string) => void;
  removeTenant: (subdomain: string) => void;
  clearAccounts: () => void;
};

const BUILT_IN_ACCOUNTS: DevAccount[] = [
  {
    company: "Aster Grove Realty",
    email: "amara@astergrove.com",
    name: "Amara Okafor",
    password: "lorem-ipsum",
    subdomain: "aster-grove",
  },
  {
    company: "Sunrise Properties",
    email: "james@sunrise.com",
    name: "James Adeyemi",
    password: "lorem-ipsum",
    subdomain: "sunrise-props",
  },
];

export const useDevToolsStore = create<DevToolsState>()(
  persist(
    (set, get) => ({
      accounts: BUILT_IN_ACCOUNTS,
      tenants: [],

      addAccount: (account) => {
        const existing = get().accounts.find((a) => a.email === account.email);
        if (existing) return; // already saved
        set((state) => ({ accounts: [...state.accounts, account] }));
      },

      addTenant: (tenant) => {
        const existing = get().tenants.find(
          (t) => t.subdomain === tenant.subdomain,
        );
        if (existing) return;
        set((state) => ({ tenants: [...state.tenants, tenant] }));
      },

      removeAccount: (email) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.email !== email),
        })),

      removeTenant: (subdomain) =>
        set((state) => ({
          tenants: state.tenants.filter((t) => t.subdomain !== subdomain),
        })),

      clearAccounts: () => set({ accounts: [] }),
    }),
    {
      name: "plotkeys-dev-tools",
      // Merge persisted state with built-in accounts so new presets are
      // always included, even if the user has a stale store in localStorage.
      merge: (persisted, current) => {
        const p = persisted as Partial<DevToolsState>;
        const mergedAccounts = [...BUILT_IN_ACCOUNTS];
        for (const saved of p.accounts ?? []) {
          if (!mergedAccounts.some((a) => a.email === saved.email)) {
            mergedAccounts.push(saved);
          }
        }
        return {
          ...current,
          ...p,
          accounts: mergedAccounts,
        };
      },
    },
  ),
);
