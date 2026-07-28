import { Button } from "@plotkeys/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ProjectAiInsights } from "@/components/projects/project-ai";
import { ProjectDetailHeader } from "@/components/projects/project-detail-header";
import { ProjectDetailStats } from "@/components/projects/project-detail-stats";
import { ProjectOverviewSections } from "@/components/projects/project-overview-sections";
import { ProjectSection } from "@/components/projects/project-section";
import { useTRPC } from "@/trpc/client";

type Props = {
  projectId: string;
};

export function ProjectDetailContent({ projectId }: Props) {
  const trpc = useTRPC();
  const { data: detail } = useSuspenseQuery(
    trpc.projects.getOverviewDetail.queryOptions({ projectId }),
  );

  if (!detail) {
    return (
      <div className="flex min-h-56 items-center justify-center px-5 py-10">
        <div className="flex max-w-sm flex-col items-center text-center">
          <h3 className="font-medium text-foreground">Project not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This project may have been deleted, archived outside this workspace,
            or opened from an old link.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/projects">Back to projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { project } = detail;

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailHeader project={project} />
      <ProjectDetailStats project={project} />

      <ProjectOverviewSections detail={detail} />

      <ProjectSection
        description="Review model-generated observations for this project inside the shared dashboard flow."
        title="AI insights"
      >
        <ProjectAiInsights projectId={project.id} />
      </ProjectSection>
    </div>
  );
}
