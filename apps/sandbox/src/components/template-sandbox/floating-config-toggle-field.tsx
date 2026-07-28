"use client";

import { cn } from "@plotkeys/ui/cn";
import { Field } from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import { Switch } from "@plotkeys/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import {
  floatingConfigExpandedErrorClassName,
  floatingConfigFieldBaseClassName,
  floatingConfigIconFrameClassName,
  floatingConfigRowClassName,
  floatingConfigTextStackClassName,
} from "./floating-config-rail-row-classes";

type FloatingConfigToggleFieldInput = {
  checked: boolean;
  label: string;
  name: string;
  onDraftValueChange?: (name: string, value: string) => void;
  profileId: string;
};

export function FloatingConfigToggleField({
  checked,
  label,
  name,
  onDraftValueChange,
  profileId,
}: FloatingConfigToggleFieldInput) {
  const trpc = useTRPC();
  const router = useRouter();
  const latestSubmittedValueRef = useRef<boolean | null>(null);
  const rollbackValueRef = useRef(checked);
  const [optimisticChecked, setOptimisticChecked] = useState(checked);
  const mutation = useMutation(
    trpc.templateSandbox.updateThemeField.mutationOptions({
      onError: (_error, variables) => {
        const submittedValue = variables.value === "true";
        if (submittedValue === latestSubmittedValueRef.current) {
          const rollbackValue = rollbackValueRef.current;
          setOptimisticChecked(rollbackValue);
          onDraftValueChange?.(name, String(rollbackValue));
        }
      },
      onSuccess: (_result, variables) => {
        const submittedValue = variables.value === "true";
        if (submittedValue === latestSubmittedValueRef.current) {
          router.refresh();
        }
      },
    }),
  );
  const mutationError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.error
        ? "Unable to save this setting."
        : "";
  const statusLabel = optimisticChecked ? "Shown" : "Hidden";

  useEffect(() => {
    setOptimisticChecked(checked);
    latestSubmittedValueRef.current = null;
    rollbackValueRef.current = checked;
    mutation.reset();
  }, [checked, name, profileId]);

  function handleCheckedChange(nextChecked: boolean) {
    if (nextChecked === optimisticChecked && nextChecked === checked) return;

    latestSubmittedValueRef.current = nextChecked;
    rollbackValueRef.current = checked;
    setOptimisticChecked(nextChecked);
    onDraftValueChange?.(name, String(nextChecked));
    mutation.mutate({
      profileId,
      themeKey: name,
      value: String(nextChecked),
    });
  }

  return (
    <Field
      className={cn(
        floatingConfigFieldBaseClassName,
        mutationError && "border-destructive/50 bg-destructive/10",
        mutation.isPending && "opacity-70",
      )}
    >
      <div className={floatingConfigRowClassName}>
        <div className={floatingConfigTextStackClassName}>
          <span className="truncate text-[11px] font-normal text-muted-foreground">
            {label}
          </span>
          <span className="truncate text-xs font-semibold text-foreground">
            {statusLabel}
          </span>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <span className={floatingConfigIconFrameClassName}>
            {optimisticChecked ? (
              <Icon.Eye className="size-4" />
            ) : (
              <Icon.EyeOff className="size-4 text-muted-foreground" />
            )}
          </span>
          <Switch
            aria-label={`${label}: ${statusLabel}`}
            checked={optimisticChecked}
            className="absolute inset-y-0 right-0 h-7 w-7 cursor-pointer opacity-0 group-data-[state=expanded]/config:static group-data-[state=expanded]/config:h-3.5 group-data-[state=expanded]/config:w-6 group-data-[state=expanded]/config:opacity-100"
            disabled={mutation.isPending}
            title={
              mutationError
                ? `${label}: ${statusLabel}. ${mutationError}`
                : `${label}: ${statusLabel}`
            }
            onClick={(event) => event.stopPropagation()}
            onCheckedChange={handleCheckedChange}
          />
        </div>
      </div>
      {mutationError ? (
        <p className={floatingConfigExpandedErrorClassName}>{mutationError}</p>
      ) : null}
    </Field>
  );
}
