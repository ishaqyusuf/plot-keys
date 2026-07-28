import { cn } from "../utils";

const PLOTKEYS_MARK_SRC = "/logo.svg";
const PLOTKEYS_HORIZONTAL_SRC = "/logo-horizontal.svg";

type PlotKeysLogoProps = {
  alt?: string;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function PlotKeysLogo({
  alt = "PlotKeys logo",
  className,
  markClassName,
  showWordmark = true,
  wordmarkClassName,
}: PlotKeysLogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        alt={alt}
        className={cn(
          "h-8 w-auto shrink-0 object-contain",
          showWordmark ? wordmarkClassName : undefined,
          markClassName,
        )}
        src={showWordmark ? PLOTKEYS_HORIZONTAL_SRC : PLOTKEYS_MARK_SRC}
      />
    </span>
  );
}
