import { OpenEstateCreateSheet } from "@/components/open-estate-create-sheet";

export function EstatesEmptyState() {
  return (
    <div className="flex min-h-56 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">No estate launches yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create an estate launch when you want to group land listings around a
          presale deal and estate plan.
        </p>
        <div className="mt-4">
          <OpenEstateCreateSheet />
        </div>
      </div>
    </div>
  );
}
