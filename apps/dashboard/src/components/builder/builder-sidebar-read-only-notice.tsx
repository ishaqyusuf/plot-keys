import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { type SubscriptionTier, tierLabels } from "@plotkeys/utils";

type Props = {
  planTier: SubscriptionTier;
  readOnlyMessage?: string;
  requiredPlan?: SubscriptionTier;
};

export function BuilderSidebarReadOnlyNotice({
  planTier,
  readOnlyMessage,
  requiredPlan,
}: Props) {
  return (
    <Alert className="border-warning/30 bg-warning/10">
      <AlertDescription className="text-xs leading-5 text-foreground">
        {readOnlyMessage ??
          `Upgrade to the ${tierLabels[requiredPlan ?? planTier]} plan to edit this template.`}
      </AlertDescription>
    </Alert>
  );
}
