"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { RecommendTemplateActions } from "./recommend-template-actions";
import { RecommendTemplateError } from "./recommend-template-error";
import { RecommendTemplateFields } from "./recommend-template-fields";
import { RecommendTemplateProfileSummary } from "./recommend-template-profile-summary";

type Props = {
  currentBusinessType?: string | null;
  currentPrimaryGoal?: string | null;
  currentStylePreference?: string | null;
  currentTone?: string | null;
  disabled?: boolean;
};

export function RecommendTemplatePanel({
  currentBusinessType,
  currentPrimaryGoal,
  currentStylePreference,
  currentTone,
  disabled = false,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [businessType, setBusinessType] = useState(currentBusinessType ?? "");
  const [primaryGoal, setPrimaryGoal] = useState(currentPrimaryGoal ?? "");
  const [stylePreference, setStylePreference] = useState(
    currentStylePreference ?? "",
  );
  const [tone, setTone] = useState(currentTone ?? "");

  const mutation = useMutation(
    trpc.onboarding.updateInputs.mutationOptions({
      onSuccess() {
        router.refresh();
        setOpen(false);
      },
    }),
  );

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setBusinessType(currentBusinessType ?? "");
      setPrimaryGoal(currentPrimaryGoal ?? "");
      setStylePreference(currentStylePreference ?? "");
      setTone(currentTone ?? "");
      mutation.reset();
    }

    setOpen(nextOpen);
  }

  const handleSubmit = () => {
    mutation.mutate({
      businessType: businessType || undefined,
      primaryGoal: primaryGoal || undefined,
      stylePreference: stylePreference || undefined,
      tone: tone || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={disabled}
        >
          Re-recommend templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[455px]">
        <div className="p-4 space-y-4">
          <DialogHeader>
            <DialogTitle>Update your profile</DialogTitle>
            <DialogDescription>
              Adjust your core business inputs to get updated template
              recommendations.
            </DialogDescription>
          </DialogHeader>
          <RecommendTemplateFields
            businessType={businessType}
            onBusinessTypeChange={setBusinessType}
            onPrimaryGoalChange={setPrimaryGoal}
            onStylePreferenceChange={setStylePreference}
            onToneChange={setTone}
            primaryGoal={primaryGoal}
            stylePreference={stylePreference}
            tone={tone}
          />

          {mutation.data ? (
            <RecommendTemplateProfileSummary
              conversionFocus={mutation.data.profile.conversionFocus}
              designIntent={mutation.data.profile.designIntent}
              segment={mutation.data.profile.segment}
            />
          ) : null}

          {mutation.isError ? (
            <RecommendTemplateError message={mutation.error?.message} />
          ) : null}

          <RecommendTemplateActions
            isPending={mutation.isPending}
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
