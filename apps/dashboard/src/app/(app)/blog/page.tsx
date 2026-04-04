import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";
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
  for (const item of grouped) {
    counts[item.status] = item._count.id;
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {sp.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{sp.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/">← Dashboard</Link>
            </Button>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Blog
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create articles for your public site at <code>/blog</code>.
            </p>
          </div>

          <form action={createBlogPostAction}>
            <Button type="submit">
              <Icon.PlusCircle className="size-4" />
              New post
            </Button>
          </form>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {(["draft", "published", "archived"] as const).map((status) => (
            <Card key={status}>
              <CardContent className="flex items-center justify-between px-4 py-3">
                <p className="text-xs capitalize text-muted-foreground">
                  {status}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {counts[status]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 ? (
          <Card className="py-20 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon.File className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No blog posts yet.</p>
              <p className="text-xs text-muted-foreground">
                Start with a draft and publish it when your article is ready.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">
                        <Link
                          className="hover:underline"
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
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDate(post.publishedAt)}</p>
                    <p>Updated {formatDate(post.updatedAt)}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
