"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useProjectParams } from "@/hooks/use-project-params";

type Props = {
  className?: string;
};

export function OpenProjectSheet({ className }: Props) {
  const { setParams } = useProjectParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className={className}
        onClick={() => setParams({ createProject: true })}
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
