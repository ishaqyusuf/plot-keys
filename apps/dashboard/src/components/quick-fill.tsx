"use client";

import { useNotifications } from "@plotkeys/notifications-react";
import { Button } from "@plotkeys/ui/button";
import { CurrencyInput } from "@plotkeys/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import { useState } from "react";
import {
  createQuickFillAdapter,
  fillQuickFillProfile,
  type PricingPlanQuickFillTemplate,
  type QuickFillArgs,
  type QuickFillName,
  quickFillers,
} from "@/lib/quick-fill";

export { createQuickFillAdapter };

type QuickFillProps<Name extends QuickFillName> = {
  args: QuickFillArgs[Name];
  label?: string;
  name: Name;
  onFilled?: () => void;
};

function notifyQuickFillError(
  showError: ReturnType<typeof useNotifications>["showError"],
  error: unknown,
) {
  showError("Could not quick fill", {
    description:
      error instanceof Error ? error.message : "Something went wrong.",
  });
}

function fillInstant<Name extends QuickFillName>({
  args,
  name,
  onFilled,
  showError,
}: QuickFillProps<Name> & {
  showError: ReturnType<typeof useNotifications>["showError"];
}) {
  try {
    fillQuickFillProfile({
      args,
      name,
    });
    onFilled?.();
  } catch (error) {
    notifyQuickFillError(showError, error);
  }
}

function PricingPlansQuickFill({
  args,
  label,
  onFilled,
}: QuickFillProps<"pricing-plans">) {
  const { showError } = useNotifications();
  const quickFill = quickFillers["pricing-plans"];
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<PricingPlanQuickFillTemplate>(
    () => ({
      ...quickFill.initialTemplate,
    }),
  );
  const disabled = args.disabled;

  function updateTemplate(patch: Partial<PricingPlanQuickFillTemplate>) {
    setTemplate((currentTemplate) => ({ ...currentTemplate, ...patch }));
  }

  function fillRows() {
    try {
      fillQuickFillProfile({
        args,
        name: "pricing-plans",
        template,
      });
      onFilled?.();
      setOpen(false);
    } catch (error) {
      notifyQuickFillError(showError, error);
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" type="button" variant="ghost">
          {label ?? "Quick fill"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{quickFill.title}</DialogTitle>
          <DialogDescription>
            Generate pricing rows inside the current form, then review before
            saving.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel>Base amount *</FieldLabel>
            <CurrencyInput
              allowLeadingZeros={false}
              onValueChange={(values) =>
                updateTemplate({ amount: values.value })
              }
              placeholder="45000000"
              value={template.amount}
            />
          </Field>
          <Field>
            <FieldLabel>Rows</FieldLabel>
            <Input
              max={12}
              min={1}
              onChange={(event) =>
                updateTemplate({ count: event.target.value })
              }
              placeholder="3"
              type="number"
              value={template.count}
            />
          </Field>
          <Field>
            <FieldLabel>Base months *</FieldLabel>
            <Input
              min={1}
              onChange={(event) =>
                updateTemplate({ months: event.target.value })
              }
              placeholder="6"
              type="number"
              value={template.months}
            />
          </Field>
          <Field>
            <FieldLabel>Initial deposit</FieldLabel>
            <InputGroup>
              <InputGroupInput
                className="text-right"
                max={100}
                min={0}
                onChange={(event) =>
                  updateTemplate({
                    initialDepositPercent: event.target.value,
                  })
                }
                placeholder="20"
                step="0.1"
                type="number"
                value={template.initialDepositPercent}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <DialogFooter>
          <Button disabled={disabled} onClick={fillRows} type="button">
            Fill rows
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function QuickFill<Name extends QuickFillName>(
  props: QuickFillProps<Name>,
) {
  const { showError } = useNotifications();
  const [busy, setBusy] = useState(false);
  const quickFill = quickFillers[props.name] as {
    mode: "instant" | "dialog";
    title: string;
  };
  const disabled =
    "disabled" in props.args && typeof props.args.disabled === "boolean"
      ? props.args.disabled
      : false;

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (props.name === "pricing-plans") {
    return (
      <PricingPlansQuickFill
        args={props.args as QuickFillArgs["pricing-plans"]}
        label={props.label}
        name="pricing-plans"
        onFilled={props.onFilled}
      />
    );
  }

  if (quickFill.mode !== "instant") {
    return null;
  }

  return (
    <Button
      disabled={disabled || busy}
      onClick={async () => {
        setBusy(true);
        try {
          fillInstant({
            args: props.args,
            label: props.label,
            name: props.name,
            onFilled: props.onFilled,
            showError,
          });
        } finally {
          setBusy(false);
        }
      }}
      size="sm"
      type="button"
      variant="outline"
    >
      {busy ? "Filling..." : (props.label ?? "Quick fill")}
    </Button>
  );
}
