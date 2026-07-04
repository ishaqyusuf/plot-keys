"use client";

import { createContext, useContext } from "react";

export function createContextFactory<TValue>(name: string) {
  const Context = createContext<TValue | null>(null);

  function useFactoryContext() {
    const context = useContext(Context);

    if (!context) {
      throw new Error(`${name} must be used inside ${name}.Provider`);
    }

    return context;
  }

  return [Context.Provider, useFactoryContext] as const;
}
