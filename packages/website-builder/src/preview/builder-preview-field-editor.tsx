"use client";

import type { EditableFieldDefinition } from "@plotkeys/section-registry";
import { Field, FieldDescription, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Textarea } from "@plotkeys/ui/textarea";
import { useState, useTransition } from "react";

type Props = {
  configId: string;
  content: Record<string, string>;
  field: EditableFieldDefinition;
  readOnly?: boolean;
  onSmartFill: (formData: FormData) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
};

export function BuilderPreviewFieldEditor({
  configId,
  content,
  field,
  readOnly = false,
  onSmartFill,
  onUpdate,
}: Props) {
  const [value, setValue] = useState(content[field.contentKey] ?? "");
  const [isPending, startTransition] = useTransition();
  const [isFilling, startFilling] = useTransition();

  function handleSave() {
    if (readOnly) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", field.contentKey);
      fd.set("value", value);
      await onUpdate(fd);
    });
  }

  function handleSmartFill() {
    if (readOnly) return;
    startFilling(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("contentKey", field.contentKey);
      fd.set("shortDetail", field.shortDetail);
      await onSmartFill(fd);
    });
  }

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{field.label}</FieldLabel>
        {field.aiEnabled && (
          <SubmitButton
            isSubmitting={isFilling}
            variant="ghost"
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            disabled={readOnly}
            onClick={handleSmartFill}
            size="sm"
            type="button"
          >
            AI fill
          </SubmitButton>
        )}
      </div>
      <FieldDescription>{field.shortDetail}</FieldDescription>
      {field.fieldType === "textarea" ? (
        <Textarea
          className="min-h-[5rem] resize-none text-sm"
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      ) : (
        <Input
          className="text-sm"
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      )}
      <SubmitButton
        isSubmitting={isPending}
        variant="secondary"
        className="mt-1.5 w-full"
        disabled={readOnly}
        onClick={handleSave}
        size="sm"
        type="button"
      >
        Save
      </SubmitButton>
    </Field>
  );
}
