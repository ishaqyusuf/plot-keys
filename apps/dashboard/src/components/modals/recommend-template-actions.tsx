import { Button } from "@plotkeys/ui/button";
import { DialogFooter } from "@plotkeys/ui/dialog";
import { SubmitButton } from "@plotkeys/ui/submit-button";

type Props = {
  isPending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function RecommendTemplateActions({
  isPending,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <DialogFooter className="gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </Button>
      <SubmitButton isSubmitting={isPending} onClick={onSubmit}>
        Update & re-recommend
      </SubmitButton>
    </DialogFooter>
  );
}
