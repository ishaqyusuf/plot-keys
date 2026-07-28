"use client";

import { cn } from "@plotkeys/ui/cn";
import { Field } from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@plotkeys/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import {
  floatingConfigExpandedErrorClassName,
  floatingConfigFieldBaseClassName,
  floatingConfigIconFrameClassName,
  floatingConfigRowClassName,
  floatingConfigTextStackClassName,
} from "./floating-config-rail-row-classes";

type FloatingTemplateSelectOption = {
  description?: string;
  label: string;
  value: string;
};

type FloatingTemplateSelectFieldInput = {
  label?: string;
  options: ReadonlyArray<FloatingTemplateSelectOption>;
  profileId: string;
  value: string;
};

const selectOpenAttribute = "data-template-config-select-open";

export function FloatingTemplateSelectField({
  label = "Template",
  options,
  profileId,
  value,
}: FloatingTemplateSelectFieldInput) {
  const trpc = useTRPC();
  const router = useRouter();
  const persistedOption = options.find((option) => option.value === value);
  const fallbackOption = persistedOption ?? options[0];
  const selectedValue = persistedOption?.value ?? fallbackOption?.value ?? "";
  const selectOpenOwnerId = useId();
  const latestSubmittedValueRef = useRef<string | null>(null);
  const rollbackValueRef = useRef(selectedValue);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [optimisticValue, setOptimisticValue] = useState(selectedValue);
  const mutation = useMutation(
    trpc.templateSandbox.update.mutationOptions({
      onError: (_error, variables) => {
        if (variables.templateKey === latestSubmittedValueRef.current) {
          setOptimisticValue(rollbackValueRef.current);
        }
      },
      onSuccess: (_result, variables) => {
        if (variables.templateKey === latestSubmittedValueRef.current) {
          router.refresh();
        }
      },
    }),
  );
  const optimisticOption =
    options.find((option) => option.value === optimisticValue) ??
    fallbackOption;
  const optimisticLabel = optimisticOption?.label ?? "";
  const mutationError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.error
        ? "Unable to save this template."
        : "";

  useEffect(() => {
    setOptimisticValue(selectedValue);
    latestSubmittedValueRef.current = null;
    rollbackValueRef.current = selectedValue;
    mutation.reset();
  }, [profileId, selectedValue]);

  const syncSelectOpenAttribute = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        document.documentElement.setAttribute(
          selectOpenAttribute,
          selectOpenOwnerId,
        );
        return;
      }

      if (
        document.documentElement.getAttribute(selectOpenAttribute) ===
        selectOpenOwnerId
      ) {
        document.documentElement.removeAttribute(selectOpenAttribute);
      }
    },
    [selectOpenOwnerId],
  );

  useEffect(() => {
    syncSelectOpenAttribute(isSelectOpen);

    return () => syncSelectOpenAttribute(false);
  }, [isSelectOpen, syncSelectOpenAttribute]);

  function handleOpenChange(nextOpen: boolean) {
    syncSelectOpenAttribute(nextOpen);
    setIsSelectOpen(nextOpen);
  }

  function handleChange(nextTemplateKey: string) {
    if (nextTemplateKey === optimisticValue && value === nextTemplateKey) {
      return;
    }

    latestSubmittedValueRef.current = nextTemplateKey;
    rollbackValueRef.current = selectedValue;
    setOptimisticValue(nextTemplateKey);
    mutation.mutate({
      profileId,
      templateKey: nextTemplateKey,
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
      <Select
        open={isSelectOpen}
        value={optimisticValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleChange}
      >
        <SelectTrigger
          aria-label={`${label}: ${optimisticLabel}`}
          className="h-auto min-h-12 w-full cursor-pointer border-0 bg-transparent px-2 py-1.5 text-left text-foreground shadow-none focus:ring-0 [&>svg]:hidden"
          title={
            mutationError
              ? `${label}: ${optimisticLabel}. ${mutationError}`
              : `${label}: ${optimisticLabel}`
          }
          onClick={(event) => event.stopPropagation()}
        >
          <span className={floatingConfigRowClassName}>
            <span className={floatingConfigTextStackClassName}>
              <span className="text-[11px] font-normal text-muted-foreground">
                {label}
              </span>
              <span className="truncate text-xs font-semibold text-foreground">
                {optimisticLabel}
              </span>
            </span>
            <span className={floatingConfigIconFrameClassName}>
              <Icon.Template className="size-4" />
            </span>
          </span>
        </SelectTrigger>
        {mutationError ? (
          <p className={floatingConfigExpandedErrorClassName}>
            {mutationError}
          </p>
        ) : null}
        <SelectContent
          align="start"
          className="z-[120] max-h-72 min-w-64 overflow-hidden"
          position="popper"
          side="right"
          sideOffset={8}
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                className="cursor-pointer items-start border-l-2 border-transparent py-1.5 text-xs data-[state=checked]:border-primary data-[state=checked]:font-semibold"
                key={option.value}
                textValue={
                  option.description
                    ? `${option.label} ${option.description}`
                    : option.label
                }
                value={option.value}
              >
                <span className="flex min-w-0 items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground"
                  >
                    <Icon.Template className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.description ? (
                      <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
