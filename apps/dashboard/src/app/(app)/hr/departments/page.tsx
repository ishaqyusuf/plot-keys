import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { FolderTree } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../../components/dashboard/dashboard-empty-state";
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
  createDepartmentAction,
  deleteDepartmentAction,
} from "../../../actions";

export default async function DepartmentsPage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;

  const departments = prisma
    ? await prisma.department.findMany({
        where: { companyId, deletedAt: null },
        include: {
          _count: { select: { employees: { where: { deletedAt: null } } } },
        },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
              <DashboardPageTitle>Departments</DashboardPageTitle>
              <DashboardPageDescription>
                Organize team structure with the same calmer dashboard language
                used across the rest of the product.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild size="sm" variant="outline">
                <Link href="/hr/employees">Back to employees</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Create department</DashboardSectionTitle>
              <DashboardSectionDescription>
                Define internal team groupings before assigning employees to
                them.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <Card className="border-border/65 bg-card/78">
            <CardHeader className="px-5 py-4">
              <CardTitle>Add department</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <form action={createDepartmentAction} className="space-y-4">
                <FieldGroup className="sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">Department name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Sales"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Optional description"
                    />
                  </Field>
                </FieldGroup>
                <div className="flex justify-end">
                  <SubmitButton loadingLabel="Adding…">
                    Add department
                  </SubmitButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </DashboardSection>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Department list</DashboardSectionTitle>
              <DashboardSectionDescription>
                Review headcount and jump directly into filtered employee views.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          {departments.length === 0 ? (
            <DashboardEmptyState
              title="No departments yet"
              description="Create your first department above to start structuring the workforce."
              icon={<FolderTree className="size-5" />}
            />
          ) : (
            <div className="grid gap-2.5">
              {departments.map((dept) => (
                <Card key={dept.id} className="border-border/65 bg-card/78">
                  <CardHeader className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {dept.name}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {dept._count.employees} employee
                        {dept._count.employees !== 1 ? "s" : ""}
                        {dept.description ? ` · ${dept.description}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/hr/employees?department=${dept.id}`}>
                          View employees
                        </Link>
                      </Button>
                      <form action={deleteDepartmentAction}>
                        <input
                          type="hidden"
                          name="departmentId"
                          value={dept.id}
                        />
                        <Button size="sm" type="submit" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </DashboardSection>
      </div>
    </DashboardPage>
  );
}
