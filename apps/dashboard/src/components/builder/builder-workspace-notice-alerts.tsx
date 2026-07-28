import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

type ErrorNoticeInput = {
  message: string;
};

type LockedTemplateNoticeInput = {
  activeTemplateLabel: string;
  lockedTemplateMessage: string;
};

type StatusNoticeInput = {
  message: string;
};

export function BuilderWorkspaceErrorNotice({ message }: ErrorNoticeInput) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function BuilderWorkspaceLockedTemplateNotice({
  activeTemplateLabel,
  lockedTemplateMessage,
}: LockedTemplateNoticeInput) {
  return (
    <Alert className="border-warning/30 bg-warning/10 text-foreground">
      <AlertDescription className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span>
          <strong className="font-medium text-foreground">
            {activeTemplateLabel} is locked on your current plan.
          </strong>{" "}
          {lockedTemplateMessage}
        </span>
        <Button size="sm" asChild>
          <Link href="/billing">Upgrade plan</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function BuilderWorkspaceStatusNotice({ message }: StatusNoticeInput) {
  return (
    <Alert>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
