import { Badge } from "@plotkeys/ui/badge";
import { cn } from "@plotkeys/ui/cn";

type Props = {
  className?: string;
  countDisplay?: "badge" | "text";
  editableFieldCount: number;
  sectionCount: number;
  titleClassName?: string;
};

export function BuilderSidebarEditableFieldsNote({
  className,
  countDisplay = "text",
  editableFieldCount,
  sectionCount,
  titleClassName,
}: Props) {
  const titleStyles =
    countDisplay === "badge"
      ? "text-sm font-medium text-muted-foreground"
      : "text-xs text-muted-foreground";

  return (
    <section className={cn("flex flex-col gap-1.5", className)}>
      <p className={cn(titleStyles, titleClassName)}>Editable fields</p>
      <p className="text-xs leading-5 text-muted-foreground">
        Click any section in the preview to reveal its inline field editor.
        Changes are saved per field.
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        {countDisplay === "badge" ? (
          <>
            <Badge variant="outline">{editableFieldCount} fields</Badge>
            <Badge variant="outline">{sectionCount} sections</Badge>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground">
              {editableFieldCount} fields
            </span>
            <span className="text-xs text-muted-foreground">
              {sectionCount} sections
            </span>
          </>
        )}
      </div>
    </section>
  );
}
