import { createPrismaClient, listAgentsForCompany } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import Link from "next/link";

import { requireOnboardedSession } from "../../lib/session";
import {
  createAgentAction,
  deleteAgentAction,
  toggleAgentFeaturedAction,
} from "../actions";
import { AgentForm } from "./agent-form";

export default async function AgentsPage() {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  const agents = prisma
    ? await listAgentsForCompany(prisma, session.activeMembership.companyId)
    : [];

  return (
    <main className="min-h-screen bg-background px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Agents</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {agents.length} team member{agents.length === 1 ? "" : "s"} on
              your website
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/">Back to dashboard</Link>
            </Button>
            <AgentForm onSave={createAgentAction} />
          </div>
        </div>

        {agents.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No agents yet</EmptyTitle>
                  <EmptyDescription>
                    Add your team members to showcase them on your website.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden">
                <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {agent.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={agent.name}
                        className="h-12 w-12 rounded-full object-cover"
                        src={agent.imageUrl}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">
                          {agent.name}
                        </p>
                        {agent.featured && (
                          <Badge
                            className="border-amber-400/60 text-amber-600"
                            variant="outline"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                      {agent.title && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {agent.title}
                        </p>
                      )}
                      {agent.email && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {agent.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={toggleAgentFeaturedAction}>
                      <input type="hidden" name="agentId" value={agent.id} />
                      <input
                        type="hidden"
                        name="featured"
                        value={String(!agent.featured)}
                      />
                      <Button size="sm" type="submit" variant="ghost">
                        {agent.featured ? "Unfeature" : "Feature"}
                      </Button>
                    </form>
                    <AgentForm
                      initialData={agent}
                      onSave={createAgentAction}
                      trigger={
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      }
                    />
                    <form action={deleteAgentAction}>
                      <input type="hidden" name="agentId" value={agent.id} />
                      <Button
                        className="text-destructive hover:text-destructive"
                        size="sm"
                        type="submit"
                        variant="ghost"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
