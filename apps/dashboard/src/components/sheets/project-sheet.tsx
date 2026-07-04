"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { ProjectForm } from "@/components/forms/project-form";

export function ProjectSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New project
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description="Create a delivery workspace for phases, milestones, issues, staffing, and customer updates."
          title="New project"
        />
        <ProjectForm onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
