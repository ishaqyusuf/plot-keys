import { Button } from "@plotkeys/ui/button";
import { SearchX, Users } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

type TeamsNoResultsProps = {
  onClear: () => void;
};

export function TeamsEmptyState() {
  return (
    <DashboardEmptyState
      description="Invite a colleague to collaborate on this workspace."
      icon={<Users className="size-5" />}
      title="No team members yet"
    />
  );
}

export function TeamsNoResults({ onClear }: TeamsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No members found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current member search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
