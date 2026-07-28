import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";

type Props = {
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  idleLabel: string;
  isError?: boolean;
  isPending?: boolean;
  onRun: () => void;
  resultMessage?: string;
};

export function BuilderAiToolControl({
  description,
  disabled,
  errorMessage,
  idleLabel,
  isError,
  isPending,
  onRun,
  resultMessage,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <SubmitButton
        isSubmitting={isPending ?? false}
        disabled={disabled}
        onClick={onRun}
        className="w-full gap-2"
        variant="outline"
        size="sm"
        type="button"
      >
        <Icon.Sparkles className="size-4" />
        {idleLabel}
      </SubmitButton>

      {description ? (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      ) : null}

      {isError ? (
        <p className="text-xs text-destructive">
          {errorMessage ?? "AI generation failed."}
        </p>
      ) : null}

      {resultMessage ? (
        <p className="text-xs text-muted-foreground">{resultMessage}</p>
      ) : null}
    </div>
  );
}
