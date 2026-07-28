import { DepartmentsColumnVisibility } from "@/components/departments-column-visibility";
import { OpenDepartmentSheet } from "@/components/open-department-sheet";
import { SearchField } from "@/components/search-field";

export function DepartmentsHeader() {
  return (
    <div className="flex items-center justify-between">
      <SearchField placeholder="Search departments" />

      <div className="flex items-center gap-2">
        <DepartmentsColumnVisibility />
        <div className="hidden sm:block">
          <OpenDepartmentSheet />
        </div>
      </div>
    </div>
  );
}
