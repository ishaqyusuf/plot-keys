import type { TemplateDefinition } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Checkbox } from "@plotkeys/ui/checkbox";

type Props = {
  checked: boolean;
  onCheckedChange: () => void;
  template: TemplateDefinition;
};

export function BuilderTemplatePublishStatus({
  checked,
  onCheckedChange,
  template,
}: Props) {
  return (
    <div className="border bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="capitalize">
            {template.tier}
          </Badge>
          <span className="font-medium text-foreground">{template.name}</span>
        </div>
        <label
          className="flex cursor-pointer items-center gap-2 text-sm"
          htmlFor="preview-published-toggle"
        >
          <Checkbox
            checked={checked}
            id="preview-published-toggle"
            onCheckedChange={onCheckedChange}
          />
          <span className="text-muted-foreground">Published</span>
        </label>
      </div>
    </div>
  );
}
