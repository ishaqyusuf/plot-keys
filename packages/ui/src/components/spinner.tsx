import { Icon } from "./icons";

import { cn } from "../lib/utils";

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Icon.Loader>) {
  return (
    <Icon.Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
