import { CustomersColumnVisibility } from "@/components/customers-column-visibility";
import { OpenCustomerSheet } from "@/components/open-customer-sheet";
import { SearchField } from "@/components/search-field";

type Props = {
  canManage: boolean;
};

export function CustomersHeader({ canManage }: Props) {
  return (
    <div className="flex items-center justify-between">
      <SearchField placeholder="Search customers" />

      <div className="flex items-center gap-2">
        <CustomersColumnVisibility />
        {canManage ? (
          <div className="hidden sm:block">
            <OpenCustomerSheet />
          </div>
        ) : null}
      </div>
    </div>
  );
}
