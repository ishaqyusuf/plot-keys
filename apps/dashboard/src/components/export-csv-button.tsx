"use client";

import { Icon } from "@plotkeys/ui/icons";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useTransition } from "react";

type Props = {
  exportAction: () => Promise<string> | string;
  filename: string;
  label?: string;
};

export function ExportCsvButton({
  exportAction,
  filename,
  label = "Export CSV",
}: Props) {
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
    <SubmitButton
      variant="outline"
      size="sm"
      isSubmitting={isPending}
      onClick={handleExport}
      type="button"
    >
      <Icon.Download className="mr-1.5 size-3.5" />
      {label}
    </SubmitButton>
  );
}
