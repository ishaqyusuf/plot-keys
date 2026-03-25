"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevLoginFab must not be imported in production.");
}

/**
 * Dev-only FAB for the login page.
 *
 * Reads persisted accounts from the dev-tools Zustand store and renders
 * a clickable list. Clicking any row calls `onFill({ email, password })`
 * so the parent can reset the react-hook-form instance.
 */

import { extractDashboardTenantSlug } from "@plotkeys/utils";
import { useMemo } from "react";

import { useDevToolsStore } from "../../stores/dev-tools";
import { DevFabShell } from "./dev-fab-shell";

type Props = {
  /** Called with email + password when the user picks an account. */
  onFill: (values: { email: string; password: string }) => void;
};

export function DevLoginFab({ onFill }: Props) {
  const accounts = useDevToolsStore((s) => s.accounts);
  const currentTenantSlug =
    typeof window === "undefined"
      ? null
      : extractDashboardTenantSlug(window.location.host);
  const visibleAccounts = useMemo(() => {
    if (!currentTenantSlug) {
      return accounts;
    }

    return accounts.filter(
      (account) => account.subdomain === currentTenantSlug,
    );
  }, [accounts, currentTenantSlug]);

  return (
    <DevFabShell label="Accounts">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {visibleAccounts.length === 0 && (
          <p className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
            {currentTenantSlug
              ? `No saved accounts for ${currentTenantSlug}.`
              : "No saved accounts."}
          </p>
        )}
        {visibleAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() =>
              onFill({ email: account.email, password: account.password })
            }
            className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {account.name}
            </p>
            <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {account.email}
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              {account.company} · {account.subdomain}
            </p>
          </button>
        ))}
      </div>
    </DevFabShell>
  );
}
