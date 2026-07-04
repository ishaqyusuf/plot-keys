"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import {
  PropertyForm,
  type PropertyFormProps,
} from "@/components/forms/property-form";

export function PropertySheet(props: PropertyFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant={props.mode === "create" ? "default" : "outline"}
        >
          {props.mode === "create" ? (props.label ?? "Add listing") : "Edit"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description={
            props.mode === "create"
              ? "Add a home or land listing using fields that match the listing type."
              : "Update pricing, details, and publish state without leaving the inventory view."
          }
          title={props.mode === "create" ? "Add listing" : "Edit listing"}
        />
        <PropertyForm {...props} onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
