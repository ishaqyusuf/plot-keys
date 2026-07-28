import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";

type Props = {
  onOpen: () => void;
};

export function BuilderSidebarDrawerTrigger({ onOpen }: Props) {
  return (
    <Button
      aria-label="Open builder settings"
      variant="outline"
      className="xl:hidden"
      onClick={onOpen}
      size="sm"
      type="button"
    >
      <Icon.Settings className="size-4" />
    </Button>
  );
}
