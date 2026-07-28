"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { usePropertyParams } from "@/hooks/use-property-params";

type Props = {
  defaults?: {
    estateId?: string;
    location?: string | null;
    returnTo?: string;
    type?: string;
  };
};

export function OpenPropertySheet({ defaults }: Props) {
  const { setParams } = usePropertyParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          setParams({
            createProperty: true,
            estateId: defaults?.estateId ?? null,
            propertyLocation: defaults?.location ?? null,
            propertyType: defaults?.type ?? null,
            returnTo: defaults?.returnTo ?? null,
          })
        }
      >
        <Icon.Add />
      </Button>
    </div>
  );
}
