"use client";

import {
  buildTenantHref,
  type TenantUrlConfig,
  type TenantUrlContext,
} from "@plotkeys/utils/tenant-url";
import { createContext, type ReactNode, useCallback, useContext } from "react";

type TenantUrlProviderValue = {
  config: TenantUrlConfig;
  context: TenantUrlContext;
};

const TenantUrlContextValue = createContext<TenantUrlProviderValue | null>(
  null,
);

export function TenantUrlProvider({
  children,
  config,
  context,
}: TenantUrlProviderValue & { children: ReactNode }) {
  return (
    <TenantUrlContextValue.Provider value={{ config, context }}>
      {children}
    </TenantUrlContextValue.Provider>
  );
}

export function useTenantUrl() {
  return useContext(TenantUrlContextValue);
}

export function useTenantHref() {
  const value = useTenantUrl();

  return useCallback(
    (href: string) => {
      if (!value) return href;
      return buildTenantHref(value.context, href, value.config);
    },
    [value],
  );
}
