import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import Link from "next/link";
import { PublishConfirmationDialog } from "@/components/modals/publish-confirmation-dialog";

type Props = {
  changedFieldCount?: number;
  configId: string;
  currentName: string;
  currentPageLiveSiteUrl: string;
  disabled?: boolean;
  disabledReason?: string;
  isEmbedded: boolean;
  isOnboardingStep?: boolean;
  liveSiteUrl: string;
  templateLabel: string;
};

export function BuilderWorkspaceToolbarActions({
  changedFieldCount,
  configId,
  currentName,
  currentPageLiveSiteUrl,
  disabled,
  disabledReason,
  isEmbedded,
  isOnboardingStep,
  liveSiteUrl,
  templateLabel,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ThemeToggle />
      <PublishConfirmationDialog
        changedFieldCount={changedFieldCount}
        configId={configId}
        currentName={currentName}
        disabled={disabled}
        disabledReason={disabledReason}
        templateLabel={templateLabel}
      />
      {isOnboardingStep ? (
        <Badge variant="secondary">Final onboarding step</Badge>
      ) : null}
      {isEmbedded ? (
        <Button variant="secondary" asChild>
          <Link href="/builder">Open full builder</Link>
        </Button>
      ) : (
        <Button variant="secondary" asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      )}
      <Button asChild>
        <Link
          href={currentPageLiveSiteUrl || liveSiteUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open live site
        </Link>
      </Button>
    </div>
  );
}
