import { cn } from "@plotkeys/ui/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isEmbedded: boolean;
  notices: ReactNode;
  sidebar: ReactNode;
};

export function BuilderWorkspaceLayout({
  children,
  isEmbedded,
  notices,
  sidebar,
}: Props) {
  return (
    <div className={isEmbedded ? "space-y-3.5" : "grid gap-2.5"}>
      {notices}

      <div
        className={cn(
          "grid gap-3",
          isEmbedded
            ? "xl:grid-cols-[15rem_minmax(0,1fr)]"
            : "max-w-464 xl:grid-cols-[14rem_minmax(0,1fr)]",
        )}
      >
        {sidebar}

        <section className="flex flex-col gap-2.5">{children}</section>
      </div>
    </div>
  );
}
