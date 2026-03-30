import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { requireOnboardedSession } from "../../../lib/session";
import {
  deleteAgentAction,
  inviteAgentAction,
  revokeInviteAction,
  toggleAgentFeaturedAction,
} from "../../actions";
import { AgentForm } from "./agent-form";

type AgentsPageProps = {
  searchParams?: Promise<{ error?: string; invited?: string }>;
};

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const [agents, pendingInvites] = prisma
    ? await Promise.all([
        prisma.agent.findMany({
          orderBy: [
            { featured: "desc" },
            { displayOrder: "asc" },
            { createdAt: "asc" },
          ],
          where: {
            companyId: session.activeMembership.companyId,
            deletedAt: null,
          },
        }),
        prisma.teamInvite.findMany({
          orderBy: { createdAt: "desc" },
          where: {
            acceptedAt: null,
            companyId: session.activeMembership.companyId,
            expiresAt: { gt: new Date() },
            revokedAt: null,
            role: "agent",
          },
        }),
      ])
    : [[], []];

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.invited ? (
          <Alert className="mb-6">
            <AlertDescription>
              Agent invite sent. They&apos;ll receive an email to join and fill
              in their profile directly.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Agents
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {agents.length} team member{agents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invite an agent</CardTitle>
            <CardDescription>
              Enter an email address and PlotKeys will invite them to join your
              workspace and complete their agent profile on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={inviteAgentAction}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="flex-1">
                <Label htmlFor="agent-email">Email address</Label>
                <Input
                  id="agent-email"
                  name="email"
                  placeholder="agent@company.com"
                  required
                  type="email"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit">Send invite</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {pendingInvites.length > 0 ? (
          <div className="mb-8 grid gap-3">
            {pendingInvites.map((invite) => (
              <Card key={invite.id} className="border-dashed">
                <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {invite.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pending agent setup
                    </p>
                  </div>
                  <form action={revokeInviteAction}>
                    <input name="inviteId" type="hidden" value={invite.id} />
                    <Button size="sm" type="submit" variant="ghost">
                      Revoke
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {agents.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No agents yet. Invite your first agent and they&apos;ll complete
                their profile themselves.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-card">
                <CardHeader className="px-5 pt-5 pb-3">
                  <div className="flex items-start gap-3">
                    {agent.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={agent.name}
                        className="h-12 w-12 rounded-full object-cover shrink-0"
                        src={agent.imageUrl}
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground truncate">
                          {agent.name}
                        </p>
                        {agent.featured && (
                          <Badge variant="default" className="shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {agent.title && (
                        <p className="text-sm text-muted-foreground truncate">
                          {agent.title}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {agent.bio && (
                  <CardContent className="px-5 pb-3 text-sm text-muted-foreground line-clamp-2">
                    {agent.bio}
                  </CardContent>
                )}

                <CardContent className="flex flex-wrap items-center gap-2 px-5 pb-5 pt-0">
                  <form action={toggleAgentFeaturedAction}>
                    <input name="agentId" type="hidden" value={agent.id} />
                    <Button size="sm" type="submit" variant="outline">
                      {agent.featured ? "Unfeature" : "Feature"}
                    </Button>
                  </form>
                  <AgentForm agent={agent} mode="edit" />
                  <form action={deleteAgentAction}>
                    <input name="agentId" type="hidden" value={agent.id} />
                    <Button
                      className="text-destructive hover:text-destructive"
                      size="sm"
                      type="submit"
                      variant="ghost"
                    >
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
