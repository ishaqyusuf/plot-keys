import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

type Props = {
  disabledReason?: string;
};

export function PublishConfirmationDisabled({ disabledReason }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>Publish current configuration</Button>
      <Button variant="outline" asChild>
        <Link href="/billing">Upgrade plan</Link>
      </Button>
      {disabledReason ? (
        <p className="basis-full text-xs text-muted-foreground">
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}
