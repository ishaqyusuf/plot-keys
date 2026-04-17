import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogRichTextEditor } from "../../../../components/blog/blog-rich-text-editor";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import {
  deleteBlogPostAction,
  updateBlogPostAction,
  updateBlogPostStatusAction,
} from "../../../actions";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ created?: string; error?: string; saved?: string }>;
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

export default async function BlogDetailPage({
  params,
  searchParams,
}: BlogDetailPageProps) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;
  const { id } = await params;
  const sp = (await searchParams) ?? {};

  if (!prisma) return notFound();

  const post = await prisma.blogPost.findFirst({
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      id,
    },
  });

  if (!post) return notFound();

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {sp.error ? (
          <Alert variant="destructive">
            <AlertDescription>{sp.error}</AlertDescription>
          </Alert>
        ) : null}
        {sp.created ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Draft blog post created.</AlertDescription>
          </Alert>
        ) : null}
        {sp.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Blog post updated.</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>Content workspace</DashboardPageEyebrow>
              <DashboardPageTitle>{post.title}</DashboardPageTitle>
              <DashboardPageDescription>
                Public URL: <code>/blog/{post.slug}</code> · Published{" "}
                {formatDate(post.publishedAt)}
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog">Back to blog</Link>
              </Button>
              {post.status !== "published" ? (
                <form action={updateBlogPostStatusAction}>
                  <input type="hidden" name="blogPostId" value={post.id} />
                  <input type="hidden" name="status" value="published" />
                  <Button size="sm" type="submit">
                    Publish
                  </Button>
                </form>
              ) : (
                <form action={updateBlogPostStatusAction}>
                  <input type="hidden" name="blogPostId" value={post.id} />
                  <input type="hidden" name="status" value="draft" />
                  <Button size="sm" type="submit" variant="outline">
                    Move to draft
                  </Button>
                </form>
              )}
              {post.status !== "archived" ? (
                <form action={updateBlogPostStatusAction}>
                  <input type="hidden" name="blogPostId" value={post.id} />
                  <input type="hidden" name="status" value="archived" />
                  <Button size="sm" type="submit" variant="outline">
                    Archive
                  </Button>
                </form>
              ) : null}
              <form action={deleteBlogPostAction}>
                <input type="hidden" name="blogPostId" value={post.id} />
                <Button
                  size="sm"
                  type="submit"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </form>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
            <Badge
              className="capitalize"
              variant={statusVariant[post.status] ?? "outline"}
            >
              {post.status}
            </Badge>
            <Badge variant="outline">
              Updated {formatDate(post.updatedAt)}
            </Badge>
          </div>
        </DashboardPageHeader>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Edit article</DashboardSectionTitle>
              <DashboardSectionDescription>
                Refine metadata, featured visuals, and rich content in one
                focused editorial surface.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle>Article details</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateBlogPostAction} className="space-y-5">
                <input type="hidden" name="blogPostId" value={post.id} />

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      defaultValue={post.title}
                      id="title"
                      name="title"
                      placeholder="Article title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      defaultValue={post.slug}
                      id="slug"
                      name="slug"
                      placeholder="market-update"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured image URL</Label>
                  <Input
                    defaultValue={post.featuredImage ?? ""}
                    id="featuredImage"
                    name="featuredImage"
                    placeholder="https://..."
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    defaultValue={post.excerpt ?? ""}
                    id="excerpt"
                    name="excerpt"
                    placeholder="Short summary shown on the blog listing page"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <BlogRichTextEditor
                    defaultValue={post.content}
                    name="content"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>
    </DashboardPage>
  );
}
