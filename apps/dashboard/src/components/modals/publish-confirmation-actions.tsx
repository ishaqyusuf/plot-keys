import { Button } from "@plotkeys/ui/button";
import { DialogFooter } from "@plotkeys/ui/dialog";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import type { UseFormReturn } from "react-hook-form";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";

type PublishConfirmationFormValues = {
  nextName: string;
};

type Props = {
  form: UseFormReturn<PublishConfirmationFormValues>;
  onCancel: () => void;
  pending: boolean;
};

export function PublishConfirmationActions({ form, onCancel, pending }: Props) {
  return (
    <DialogFooter className="mt-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <QuickFill
        args={{ form: createQuickFillAdapter(form) }}
        name="publish-configuration"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <SubmitButton isSubmitting={pending}>Publish now</SubmitButton>
      </div>
    </DialogFooter>
  );
}
