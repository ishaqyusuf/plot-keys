"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { useTenantHref } from "./tenant-url-provider";

const isDevelopment = process.env.NODE_ENV !== "production";

export type TenantLinkProps = ComponentPropsWithoutRef<typeof Link>;

export const LocalTenantLink = forwardRef<HTMLAnchorElement, TenantLinkProps>(
  function LocalTenantLink({ href, ...props }, ref) {
    const buildHref = useTenantHref();
    const nextHref = typeof href === "string" ? buildHref(href) : href;

    return <Link ref={ref} href={nextHref} {...props} />;
  },
);

export const TenantLink = isDevelopment ? LocalTenantLink : Link;

function useLocalTenantRouter() {
  const router = useRouter();
  const buildHref = useTenantHref();

  return {
    ...router,
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) =>
      router.prefetch(buildHref(href), options),
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(buildHref(href), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(buildHref(href), options),
  };
}

export const useTenantRouter = isDevelopment ? useLocalTenantRouter : useRouter;
