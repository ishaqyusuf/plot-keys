"use client";

import { Field } from "@plotkeys/ui/field";
import { Switch } from "@plotkeys/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "../../trpc/client";
import {
  floatingConfigExpandedErrorClassName,
  floatingConfigFieldBaseClassName,
  floatingConfigIconFrameClassName,
  floatingConfigRowClassName,
  floatingConfigTextStackClassName,
} from "./floating-config-rail-row-classes";

type FloatingConfigToggleFieldProps = {
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
}: FloatingConfigToggleFieldProps) {
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
  }, [checked]);

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
      className={[
        floatingConfigFieldBaseClassName,
        mutationError ? "border-red-400/45 bg-red-500/[0.08]" : "",
        mutation.isPending ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={floatingConfigRowClassName}>
        <div className={floatingConfigTextStackClassName}>
          <span className="truncate text-[11px] font-normal text-zinc-400">
            {label}
          </span>
          <span className="truncate text-xs font-semibold text-zinc-50">
            {statusLabel}
          </span>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <span className={floatingConfigIconFrameClassName}>
            {optimisticChecked ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4 text-zinc-500" />
            )}
          </span>
          <Switch
            aria-label={`${label}: ${statusLabel}`}
            checked={optimisticChecked}
            className="absolute inset-y-0 right-0 h-7 w-7 cursor-pointer border-white/15 opacity-0 data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20 group-data-[state=expanded]/config:static group-data-[state=expanded]/config:h-3.5 group-data-[state=expanded]/config:w-6 group-data-[state=expanded]/config:opacity-100"
            disabled={mutation.isPending}
            size="sm"
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
        <p className={floatingConfigExpandedErrorClassName}>
          {mutationError}
        </p>
      ) : null}
    </Field>
  );
}
