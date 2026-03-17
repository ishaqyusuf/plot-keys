"use client"

import { useTenantFeaturedListings } from "@/packages/website-builder/hooks/use-tenant-listings"
import { useWebsiteMode } from "@/packages/website-builder/hooks/use-website-mode"

type ListingFeaturedGridConfig = {
  title: string
  subtitle?: string
  limit: number
  showPrice: boolean
  showLocation: boolean
  showAgent: boolean
  ctaText: string
  ctaHref: string
  hideWhenEmpty: boolean
}

type Props = {
  config: ListingFeaturedGridConfig
  isVisible?: boolean
}

export function ListingFeaturedGrid({ config, isVisible = true }: Props) {
  const mode = useWebsiteMode()
  const { data: listings = [], isLoading } = useTenantFeaturedListings({
    limit: config.limit,
  })

  if (!isVisible) return null

  if (
    mode === "live" &&
    config.hideWhenEmpty &&
    !isLoading &&
    listings.length === 0
  ) {
    return null
  }

  return <section>{config.title}</section>
}
