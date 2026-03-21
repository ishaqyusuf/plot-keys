"use client";

import { Button } from "@plotkeys/ui/button";
import { Download } from "lucide-react";
import { useState, useTransition } from "react";

type ExportCsvButtonProps = {
  exportAction: () => Promise<string>;
  filename: string;
  label?: string;
};

export function ExportCsvButton({
  exportAction,
  filename,
  label = "Export CSV",
}: ExportCsvButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportAction();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      disabled={isPending}
    >
      <Download className="mr-1.5 size-3.5" />
      {isPending ? "Exporting…" : label}
    </Button>
  );
}
