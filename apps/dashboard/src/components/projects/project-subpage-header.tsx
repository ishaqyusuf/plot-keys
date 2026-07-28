import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

type Props = {
  description: string;
  projectId: string;
  title: string;
};

export function ProjectSubpageHeader({ description, projectId, title }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Project workspace
        </p>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${projectId}`}>Back to project</Link>
        </Button>
      </div>
    </div>
  );
}
