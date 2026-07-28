"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { useEstateParams } from "@/hooks/use-estate-params";

type Props = {
  estateSlug: string;
};

export function OpenEstateLaunchDetailsSheet({ estateSlug }: Props) {
  const { setParams } = useEstateParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ editEstateLaunch: true, estateSlug })}
      >
        <Icon.Settings className="size-4" />
      </Button>
    </div>
  );
}
