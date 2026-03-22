"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Label } from "@plotkeys/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTRPC } from "../../trpc/client";

// ---------------------------------------------------------------------------
// Re-Recommend Templates — lets the user update core profile inputs and
// re-derive template recommendations post-onboarding.
// ---------------------------------------------------------------------------

type RecommendTemplatePanelProps = {
  currentBusinessType?: string | null;
  currentPrimaryGoal?: string | null;
  currentStylePreference?: string | null;
  currentTone?: string | null;
};

export function RecommendTemplatePanel({
  currentBusinessType,
  currentPrimaryGoal,
  currentStylePreference,
  currentTone,
}: RecommendTemplatePanelProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [businessType, setBusinessType] = useState(
    currentBusinessType ?? "",
  );
  const [primaryGoal, setPrimaryGoal] = useState(currentPrimaryGoal ?? "");
  const [stylePreference, setStylePreference] = useState(
    currentStylePreference ?? "",
  );
  const [tone, setTone] = useState(currentTone ?? "");

  const mutation = useMutation(
    trpc.workspace.updateOnboardingInputs.mutationOptions({
      onSuccess() {
        router.refresh();
        setOpen(false);
      },
    }),
  );

  const handleSubmit = () => {
    mutation.mutate({
      businessType: businessType || undefined,
      primaryGoal: primaryGoal || undefined,
      stylePreference: stylePreference || undefined,
      tone: tone || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          🎯 Re-recommend templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update your profile</DialogTitle>
          <DialogDescription>
            Adjust your core business inputs to get updated template
            recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="rtp-business-type">Business type</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger id="rtp-business-type">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="residential-sales">
                  Residential (Sales)
                </SelectItem>
                <SelectItem value="residential-rentals">
                  Residential (Rentals)
                </SelectItem>
                <SelectItem value="mixed">Mixed / General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rtp-primary-goal">Primary goal</Label>
            <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
              <SelectTrigger id="rtp-primary-goal">
                <SelectValue placeholder="Select primary goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generate-leads">Generate leads</SelectItem>
                <SelectItem value="showcase-listings">
                  Showcase listings
                </SelectItem>
                <SelectItem value="build-brand">Build brand</SelectItem>
                <SelectItem value="all-of-above">All of the above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rtp-style">Style preference</Label>
            <Select
              value={stylePreference}
              onValueChange={setStylePreference}
            >
              <SelectTrigger id="rtp-style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal / Editorial</SelectItem>
                <SelectItem value="bold">Bold / Dynamic</SelectItem>
                <SelectItem value="classic">Classic / Warm</SelectItem>
                <SelectItem value="modern">Modern / Clean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rtp-tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="rtp-tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {mutation.data && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Updated profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge variant="outline">{mutation.data.profile.segment}</Badge>
              <Badge variant="outline">
                {mutation.data.profile.designIntent}
              </Badge>
              <Badge variant="outline">
                {mutation.data.profile.conversionFocus}
              </Badge>
            </CardContent>
          </Card>
        )}

        {mutation.isError && (
          <p className="text-sm text-destructive">
            {mutation.error?.message ?? "Something went wrong."}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Updating…" : "Update & re-recommend"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// AI Content Bootstrap — generates hero/intro/CTA copy from onboarding data.
// ---------------------------------------------------------------------------

export function AiContentBootstrapButton() {
  const router = useRouter();
  const trpc = useTRPC();
  const [result, setResult] = useState<{
    fieldsUpdated: string[];
    success: boolean;
  } | null>(null);

  const mutation = useMutation(
    trpc.workspace.bootstrapAiContent.mutationOptions({
      onSuccess(data) {
        setResult(data);
        router.refresh();
      },
    }),
  );

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Generating…" : "✨ AI-generate hero & CTA copy"}
      </Button>

      {mutation.isError && (
        <p className="text-xs text-destructive">
          {mutation.error?.message ?? "AI generation failed."}
        </p>
      )}

      {result && (
        <p className="text-xs text-muted-foreground">
          ✅ Updated {result.fieldsUpdated.length} fields:{" "}
          {result.fieldsUpdated.join(", ")}
        </p>
      )}
    </div>
  );
}
