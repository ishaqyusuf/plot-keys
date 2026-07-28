import { Button } from "@plotkeys/ui/button";
import { cn } from "@plotkeys/ui/cn";
import Link from "next/link";

type PreviewPageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type Props = {
  activePageKey: string;
  availablePages?: PreviewPageNavItem[];
  companySlug: string;
  hasTemplatePage: boolean;
  pageKey: string;
  pageLabel: string;
  pageSlug: string;
  sectionCount: number;
  onPageNav: (page: PreviewPageNavItem) => void;
};

type ReadOnlyNoticeInput = {
  readOnlyMessage?: string;
};

export function BuilderPreviewFrameHeader({
  activePageKey,
  availablePages,
  companySlug,
  hasTemplatePage,
  pageKey,
  pageLabel,
  pageSlug,
  sectionCount,
  onPageNav,
}: Props) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-foreground/18" />
        <span className="size-2.5 rounded-full bg-foreground/18" />
        <span className="size-2.5 rounded-full bg-foreground/18" />
      </div>
      {availablePages && availablePages.length > 1 ? (
        <div className="min-w-0 flex-1 text-center">
          <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
            {availablePages.map((page) => (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-auto shrink-0 border px-3 py-1 text-xs",
                  activePageKey === page.pageKey
                    ? "border-border bg-muted font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
                )}
                key={page.pageKey}
                onClick={() => onPageNav(page)}
                type="button"
              >
                {page.label}
              </Button>
            ))}
          </nav>
          <p className="mt-1 truncate text-[11px] text-muted-foreground/80">
            {companySlug}.plotkeys.app{pageSlug === "/" ? "" : pageSlug}
          </p>
        </div>
      ) : (
        <div className="min-w-0 text-center">
          <p className="truncate text-xs text-muted-foreground">
            {companySlug}.plotkeys.app{pageSlug === "/" ? "" : pageSlug}
          </p>
          <p className="truncate text-[11px] text-muted-foreground/80">
            {pageLabel} · {pageKey}
          </p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {hasTemplatePage ? "Page component" : `${sectionCount} sections`}
      </p>
    </div>
  );
}

export function BuilderPreviewReadOnlyNotice({
  readOnlyMessage,
}: ReadOnlyNoticeInput) {
  return (
    <div className="flex flex-col gap-3 border-b border-warning/20 bg-warning/10 px-4 py-3 text-sm text-foreground md:flex-row md:items-center md:justify-between">
      <p>{readOnlyMessage ?? "Upgrade your plan to edit this template."}</p>
      <Button variant="outline" size="sm" asChild>
        <Link href="/billing">Upgrade plan</Link>
      </Button>
    </div>
  );
}
