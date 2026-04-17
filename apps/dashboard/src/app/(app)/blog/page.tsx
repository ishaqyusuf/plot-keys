import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import { createBlogPostAction } from "../../actions";

type BlogPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

function formatDate(value?: Date | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;
  const sp = (await searchParams) ?? {};

  const companyId = session.activeMembership.companyId;
  const [posts, grouped] = prisma
    ? await Promise.all([
        prisma.blogPost.findMany({
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          where: { companyId, deletedAt: null },
        }),
        prisma.blogPost.groupBy({
          by: ["status"],
          where: { companyId, deletedAt: null },
          _count: { id: true },
        }),
      ])
    : [[], []];

  const counts = { archived: 0, draft: 0, published: 0 };
  for (const item of grouped) counts[item.status] = item._count.id;

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Content workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Blog</DashboardPageTitle>
            <DashboardPageDescription>
              Publish calmer, editorial updates to your public site using the
              same systemized dashboard structure as the rest of the product.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <form action={createBlogPostAction}>
              <Button type="submit">
                <PlusCircle className="size-4" />
                New post
              </Button>
            </form>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {posts.length} post{posts.length === 1 ? "" : "s"} across your
            content workspace
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {(["draft", "published", "archived"] as const).map((status) => (
          <Card key={status} className="border-border/70 bg-card/82">
            <CardContent className="px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {status}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {counts[status]}
              </p>
            </CardContent>
          </Card>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Editorial queue</DashboardSectionTitle>
            <DashboardSectionDescription>
              Drafts, published stories, and archived articles all follow one
              quieter list presentation.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        {posts.length === 0 ? (
          <DashboardEmptyState
            title="No blog posts yet"
            description="Start with a draft and publish it when your article is ready."
            icon={<FileText className="size-5" />}
            actions={
              <form action={createBlogPostAction}>
                <Button type="submit">Create first post</Button>
              </form>
            }
          />
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="border-border/70 bg-card/82">
                <CardHeader className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">
                        <Link
                          className="transition-colors hover:text-primary"
                          href={`/blog/${post.id}`}
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <Badge
                        className="capitalize"
                        variant={statusVariant[post.status] ?? "outline"}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      /blog/{post.slug}
                    </p>
                    {post.excerpt ? (
                      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-sm text-muted-foreground lg:text-right">
                    <p>Published {formatDate(post.publishedAt)}</p>
                    <p>Updated {formatDate(post.updatedAt)}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
