import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProjectOverviewDetail = NonNullable<
  RouterOutputs["projects"]["getOverviewDetail"]
>;

type Props = {
  project: ProjectOverviewDetail["project"];
};

export function ProjectDetailStats({ project }: Props) {
  const stats = [
    { label: "Phases", value: project._count.phases },
    { label: "Milestones", value: project._count.milestones },
    { label: "Issues", value: project._count.issues },
    { label: "Team members", value: project._count.assignments },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="border border-border bg-card p-5 transition-all duration-300"
          key={stat.label}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-3 text-xl font-medium">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
