"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { AgentForm, type AgentFormRecord } from "@/components/forms/agent-form";

type AgentSheetProps =
  | { mode: "create"; agent?: never }
  | { mode: "edit"; agent: AgentFormRecord };

export function AgentSheet(props: AgentSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant={props.mode === "create" ? "default" : "outline"}
        >
          {props.mode === "create" ? <Plus className="size-4" /> : null}
          {props.mode === "create" ? "Add agent" : "Edit"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description={
            props.mode === "create"
              ? "Create a polished public-facing team profile using the shared dashboard editing flow."
              : "Update the agent profile, ordering, and featured status without leaving the team workspace."
          }
          title={props.mode === "create" ? "Add agent" : "Edit agent"}
        />
        {props.mode === "edit" ? (
          <AgentForm
            agent={props.agent}
            mode="edit"
            onCancel={() => setOpen(false)}
          />
        ) : (
          <AgentForm mode="create" onCancel={() => setOpen(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
}
