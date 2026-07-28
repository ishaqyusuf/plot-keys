"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { ProjectForm } from "@/components/forms/project-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useProjectParams } from "@/hooks/use-project-params";

export function ProjectCreateSheet() {
  const { createProject, setParams } = useProjectParams();
  const isOpen = Boolean(createProject);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Create a delivery workspace for phases, milestones, issues, staffing, and customer updates."
          onClose={() => setParams(null)}
          title="New project"
        />

        <ProjectForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
