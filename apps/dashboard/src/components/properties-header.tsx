import { OpenPropertySheet } from "@/components/open-property-sheet";
import { PropertiesColumnVisibility } from "@/components/properties-column-visibility";
import { PropertiesSearchFilter } from "@/components/properties-search-filter";

export function PropertiesHeader() {
  return (
    <div className="flex items-center justify-between">
      <PropertiesSearchFilter />

      <div className="flex items-center gap-2">
        <PropertiesColumnVisibility />
        <div className="hidden sm:block">
          <OpenPropertySheet />
        </div>
      </div>
    </div>
  );
}
