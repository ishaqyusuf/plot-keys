import { OpenProjectSheet } from "@/components/open-project-sheet";
import { ProjectsColumnVisibility } from "@/components/projects-column-visibility";
import { ProjectsSearchFilter } from "@/components/projects-search-filter";
import { ProjectsStatusTabs } from "@/components/projects-status-tabs";

export function ProjectsHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <ProjectsSearchFilter />

        <div className="flex items-center gap-2">
          <ProjectsColumnVisibility />
          <div className="hidden sm:block">
            <OpenProjectSheet />
          </div>
        </div>
      </div>

      <ProjectsStatusTabs />
    </div>
  );
}
