const PLOTKEYS_MARK_SRC = "/logo.png";
const PLOTKEYS_HORIZONTAL_SRC = "/logo-horizontal.png";

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

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
    <span className={cx("inline-flex items-center", className)}>
      <img
        alt={alt}
        className={cx(
          "h-8 w-auto shrink-0 object-contain",
          showWordmark ? wordmarkClassName : undefined,
          markClassName,
        )}
        src={showWordmark ? PLOTKEYS_HORIZONTAL_SRC : PLOTKEYS_MARK_SRC}
      />
    </span>
  );
}
