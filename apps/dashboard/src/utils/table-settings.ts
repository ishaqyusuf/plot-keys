import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table";

export type TableId =
  | "agents"
  | "blog"
  | "appointments"
  | "customers"
  | "departments"
  | "employees"
  | "estates"
  | "leads"
  | "leave-requests"
  | "notifications"
  | "payroll"
  | "projects"
  | "properties"
  | "team";

export interface TableSettings {
  columns: VisibilityState;
  sizing: ColumnSizingState;
  order: ColumnOrderState;
}

export type AllTableSettings = {
  [K in TableId]?: Partial<TableSettings>;
};

export const TABLE_SETTINGS_COOKIE = "table-settings";

export const defaultHiddenColumns: Record<TableId, string[]> = {
  agents: [],
  blog: [],
  appointments: [],
  customers: [],
  departments: [],
  employees: [],
  estates: [],
  leads: [],
  "leave-requests": [],
  notifications: [],
  payroll: [],
  projects: [],
  properties: [],
  team: [],
};

export function getDefaultColumnVisibility(tableId: TableId): VisibilityState {
  const columnsToHide = defaultHiddenColumns[tableId];

  return columnsToHide.reduce(
    (acc, column) => {
      acc[column] = false;
      return acc;
    },
    {} as Record<string, boolean>,
  );
}

export function getDefaultTableSettings(tableId: TableId): TableSettings {
  return {
    columns: getDefaultColumnVisibility(tableId),
    order: [],
    sizing: {},
  };
}

export function mergeWithDefaults(
  saved: Partial<TableSettings> | undefined,
  tableId: TableId,
): TableSettings {
  const defaults = getDefaultTableSettings(tableId);

  return {
    columns: saved?.columns ?? defaults.columns,
    order: saved?.order ?? defaults.order,
    sizing: saved?.sizing ?? defaults.sizing,
  };
}

export function getColumnIds<TData>(
  columns: ColumnDef<TData>[],
): ColumnOrderState {
  return columns
    .map(
      (column) =>
        column.id ??
        (column as ColumnDef<TData> & { accessorKey?: string }).accessorKey ??
        "",
    )
    .filter(Boolean);
}

export function normalizeColumnOrder(
  savedOrder: ColumnOrderState,
  allColumnIds: string[],
): ColumnOrderState {
  if (savedOrder.length === 0) {
    return savedOrder;
  }

  const definedIds = new Set(allColumnIds);
  const savedIds = new Set(savedOrder);
  const orderWithoutActions = savedOrder.filter(
    (id) => id !== "actions" && definedIds.has(id),
  );
  const newColumns = allColumnIds.filter(
    (id) => id !== "actions" && !savedIds.has(id),
  );
  const result = [...orderWithoutActions, ...newColumns];

  if (definedIds.has("actions")) {
    result.push("actions");
  }

  return result;
}
