"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@plotkeys/ui/alert-dialog";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";

type Props = {
  count: number;
  disabled?: boolean;
  label: string;
  onConfirm: () => void;
};

export function BulkClientDeleteAction({
  count,
  disabled,
  label,
  onConfirm,
}: Props) {
  if (count === 0) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={disabled}
        >
          <Icon.Delete size={18} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete selected {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete {count} selected {label}. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
