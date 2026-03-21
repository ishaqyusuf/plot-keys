import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Departments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {departments.length} department{departments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hr/employees">← Employees</Link>
          </Button>
        </div>

        {/* Add Department Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDepartmentAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input id="name" name="name" required placeholder="e.g. Sales" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Optional description" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Add Department</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Department List */}
        {departments.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No departments yet. Create your first department above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {dept.name}
                    </CardTitle>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {dept._count.employees} employee{dept._count.employees !== 1 ? "s" : ""}
                      {dept.description ? ` · ${dept.description}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/hr/employees?department=${dept.id}`}>
                        View Employees
                      </Link>
                    </Button>
                    <form action={deleteDepartmentAction}>
                      <input type="hidden" name="departmentId" value={dept.id} />
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
      </div>
    </main>
  );
}
