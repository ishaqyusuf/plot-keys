import { Icon } from "@plotkeys/ui/icons";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";

export function SearchFooter() {
  return (
    <div className="search-footer flex px-3 h-[40px] w-full border border-border border-t-[0px] items-center bg-background backdrop-filter backdrop-blur-lg dark:bg-background/[0.99]">
      <div className="scale-50 dark:opacity-50 -ml-1">
        <PlotKeysLogo markClassName="h-6" showWordmark={false} />
      </div>

      <div className="ml-auto flex space-x-2">
        <div className="size-6 select-none items-center border bg-accent flex justify-center">
          <Icon.ArrowUpward className="size-3 text-foreground" />
        </div>

        <div className="size-6 select-none items-center border bg-accent flex justify-center">
          <Icon.ArrowDownward className="size-3 text-foreground" />
        </div>

        <div className="size-6 select-none items-center border bg-accent flex justify-center">
          <Icon.SubdirectoryArrowLeft className="size-3 text-foreground" />
        </div>
      </div>
    </div>
  );
}
