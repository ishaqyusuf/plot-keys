"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTRPC } from "../../trpc/client";

export function CreateProjectForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onError(err) {
        setError(err.message);
      },
      onSuccess() {
        router.refresh();
      },
    }),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") ?? "").trim();
    if (!name) {
      setError("Project name is required.");
      return;
    }

    await createMutation.mutateAsync({
      name,
      code: String(fd.get("code") ?? "").trim() || null,
      type:
        (String(fd.get("type") ?? "").trim() as
          | "building"
          | "estate"
          | "fit_out"
          | "infrastructure"
          | "renovation") || null,
      location: String(fd.get("location") ?? "").trim() || null,
      description: String(fd.get("description") ?? "").trim() || null,
      startDate: String(fd.get("startDate") ?? "").trim() || null,
      targetCompletionDate:
        String(fd.get("targetCompletionDate") ?? "").trim() || null,
    });

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="name">Project Name *</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="e.g. Lekki Phase 2 Estate"
        />
      </div>
      <div>
        <Label htmlFor="code">Project Code</Label>
        <Input id="code" name="code" placeholder="e.g. LK-P2-001" />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
        >
          <option value="">Select type</option>
          <option value="building">Building</option>
          <option value="estate">Estate</option>
          <option value="fit_out">Fit-out</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="renovation">Renovation</option>
        </select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g. Lekki, Lagos"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" name="startDate" type="date" />
      </div>
      <div>
        <Label htmlFor="targetCompletionDate">Target Completion Date</Label>
        <Input
          id="targetCompletionDate"
          name="targetCompletionDate"
          type="date"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Brief description of the project"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive sm:col-span-2">{error}</p>
      )}
      <div className="sm:col-span-2">
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating…" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
