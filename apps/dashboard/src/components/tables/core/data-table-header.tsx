"use client";

import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { TableHead, TableHeader, TableRow } from "@plotkeys/ui/table";
import type { Header, Table } from "@tanstack/react-table";
import { useMemo } from "react";

import { HorizontalPagination } from "@/components/horizontal-pagination";
import { DraggableHeader } from "@/components/tables/draggable-header";
import { ResizeHandle } from "@/components/tables/resize-handle";
import { useSortQuery } from "@/hooks/use-sort-query";
import { useStickyColumns } from "@/hooks/use-sticky-columns";
import {
  NON_REORDERABLE_COLUMNS,
  SORT_FIELD_MAPS,
  STICKY_COLUMNS,
} from "@/utils/table-configs";
import type { TableId } from "@/utils/table-settings";
import { SelectColumnHeader } from "./select-column";
import {
  ACTIONS_FULL_WIDTH_HEADER_CLASS,
  ACTIONS_STICKY_HEADER_CLASS,
  type TableScrollState,
} from "./types";

export type CoreDataTableHeaderPrimaryColumn = {
  id: string;
  label: string;
  sortField: string;
};

export type CoreDataTableHeaderProps<TData> = {
  loading?: boolean;
  primaryColumn: CoreDataTableHeaderPrimaryColumn;
  table?: Table<TData>;
  tableId: TableId;
  tableScroll?: TableScrollState;
};

function getHeaderLabel(columnId: string) {
  return columnId
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CoreDataTableHeader<TData>({
  loading,
  primaryColumn,
  table,
  tableId,
  tableScroll,
}: CoreDataTableHeaderProps<TData>) {
  const { sortColumn, sortValue, createSortQuery } = useSortQuery();
  const { getStickyStyle, getStickyClassName, isVisible } = useStickyColumns({
    loading,
    stickyColumns: STICKY_COLUMNS[tableId],
    table,
  });
  const sortableColumnIds = useMemo(() => {
    if (!table) {
      return [];
    }

    return table
      .getAllLeafColumns()
      .filter((column) => !NON_REORDERABLE_COLUMNS[tableId].has(column.id))
      .map((column) => column.id);
  }, [table, tableId]);

  if (!table) {
    return null;
  }

  return (
    <TableHeader className="border-0 block sticky top-0 z-20 bg-background w-full">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          className="h-[45px] hover:bg-transparent flex items-center !border-b-0 min-w-full"
          key={headerGroup.id}
        >
          <SortableContext
            items={sortableColumnIds}
            strategy={horizontalListSortingStrategy}
          >
            {headerGroup.headers.map((header, headerIndex, headers) => {
              const columnId = header.column.id;
              const meta = header.column.columnDef.meta as
                | { className?: string; sticky?: boolean }
                | undefined;
              const isSticky = meta?.sticky;
              const canReorder =
                !NON_REORDERABLE_COLUMNS[tableId].has(columnId);
              const isActions = columnId === "actions";

              if (!isVisible(columnId)) {
                return null;
              }

              const hasNonStickyVisible = headers.some((candidate) => {
                if (candidate.column.id === "actions") {
                  return false;
                }

                if (!isVisible(candidate.column.id)) {
                  return false;
                }

                const candidateMeta = candidate.column.columnDef.meta as
                  | { sticky?: boolean }
                  | undefined;

                return !candidateMeta?.sticky;
              });
              const actionsFullWidth = isActions && !hasNonStickyVisible;
              const isLastBeforeActions =
                headerIndex === headers.length - 2 &&
                headers[headers.length - 1]?.column.id === "actions";
              const shouldFlex =
                (isLastBeforeActions && !isSticky) || actionsFullWidth;
              const headerStyle = {
                width: actionsFullWidth ? undefined : header.getSize(),
                minWidth: actionsFullWidth
                  ? undefined
                  : isSticky
                    ? header.getSize()
                    : header.column.columnDef.minSize,
                maxWidth: actionsFullWidth
                  ? undefined
                  : isSticky
                    ? header.getSize()
                    : undefined,
                ...(!actionsFullWidth && getStickyStyle(columnId)),
                ...(shouldFlex && { flex: 1 }),
              };

              if (!canReorder) {
                const stickyClass = getStickyClassName(
                  columnId,
                  "group/header relative h-full px-4 border-t border-border flex items-center",
                );
                const className = isActions
                  ? actionsFullWidth
                    ? ACTIONS_FULL_WIDTH_HEADER_CLASS
                    : ACTIONS_STICKY_HEADER_CLASS
                  : `${stickyClass} bg-background z-10`;

                return (
                  <TableHead
                    key={header.id}
                    className={className}
                    style={headerStyle}
                  >
                    {renderHeaderContent(
                      header,
                      columnId,
                      sortColumn,
                      sortValue,
                      createSortQuery,
                      primaryColumn,
                      tableId,
                      tableScroll,
                    )}
                    {header.column.getCanResize() && (
                      <ResizeHandle header={header} />
                    )}
                  </TableHead>
                );
              }

              return (
                <DraggableHeader
                  key={header.id}
                  id={columnId}
                  style={headerStyle}
                >
                  <div className="flex items-center flex-1 min-w-0 overflow-hidden">
                    {renderHeaderContent(
                      header,
                      columnId,
                      sortColumn,
                      sortValue,
                      createSortQuery,
                      primaryColumn,
                      tableId,
                      tableScroll,
                    )}
                  </div>
                  {header.column.getCanResize() && (
                    <ResizeHandle header={header} />
                  )}
                </DraggableHeader>
              );
            })}
          </SortableContext>
        </TableRow>
      ))}
    </TableHeader>
  );
}

function renderHeaderContent<TData>(
  header: Header<TData, unknown>,
  columnId: string,
  sortColumn: string | undefined,
  sortValue: string | undefined,
  createSortQuery: (name: string) => void,
  primaryColumn: CoreDataTableHeaderProps<TData>["primaryColumn"],
  tableId: TableId,
  tableScroll?: TableScrollState,
) {
  const sortField = SORT_FIELD_MAPS[tableId][columnId];
  const meta = header.column.columnDef.meta as
    | { headerLabel?: string }
    | undefined;

  if (columnId === "select") {
    return <SelectColumnHeader table={header.getContext().table} />;
  }

  if (columnId === "actions") {
    return (
      <span className="w-full text-center text-muted-foreground">Actions</span>
    );
  }

  if (columnId === primaryColumn.id) {
    return (
      <div className="flex items-center justify-between w-full overflow-hidden">
        <div className="min-w-0 overflow-hidden">
          <SortButton
            label={primaryColumn.label}
            sortField={primaryColumn.sortField}
            currentSortColumn={sortColumn}
            currentSortValue={sortValue}
            onSort={createSortQuery}
          />
        </div>
        {tableScroll?.isScrollable ? (
          <HorizontalPagination
            canScrollLeft={tableScroll.canScrollLeft}
            canScrollRight={tableScroll.canScrollRight}
            onScrollLeft={tableScroll.scrollLeft}
            onScrollRight={tableScroll.scrollRight}
            className="hidden md:flex flex-shrink-0"
          />
        ) : null}
      </div>
    );
  }

  if (sortField) {
    return (
      <div className="w-full overflow-hidden">
        <SortButton
          label={meta?.headerLabel ?? getHeaderLabel(columnId)}
          sortField={sortField}
          currentSortColumn={sortColumn}
          currentSortValue={sortValue}
          onSort={createSortQuery}
        />
      </div>
    );
  }

  return (
    <span className="truncate">
      {meta?.headerLabel ?? getHeaderLabel(columnId)}
    </span>
  );
}

function SortButton({
  label,
  sortField,
  currentSortColumn,
  currentSortValue,
  onSort,
}: {
  currentSortColumn?: string;
  currentSortValue?: string;
  label: string;
  onSort: (field: string) => void;
  sortField: string;
}) {
  return (
    <Button
      className="p-0 hover:bg-transparent space-x-2 min-w-0 max-w-full"
      variant="ghost"
      onClick={(event) => {
        event.stopPropagation();
        onSort(sortField);
      }}
    >
      <span className="truncate">{label}</span>
      {sortField === currentSortColumn && currentSortValue === "asc" ? (
        <Icon.ArrowDown size={16} />
      ) : null}
      {sortField === currentSortColumn && currentSortValue === "desc" ? (
        <Icon.ArrowUp size={16} />
      ) : null}
    </Button>
  );
}

type CreateCoreDataTableHeaderOptions = {
  primaryColumn: CoreDataTableHeaderPrimaryColumn;
  tableId: TableId;
};

type CreatedCoreDataTableHeaderProps<TData> = Omit<
  CoreDataTableHeaderProps<TData>,
  "primaryColumn" | "tableId"
>;

export function createCoreDataTableHeader({
  primaryColumn,
  tableId,
}: CreateCoreDataTableHeaderOptions) {
  function DataTableHeader<TData>(
    props: CreatedCoreDataTableHeaderProps<TData>,
  ) {
    return (
      <CoreDataTableHeader
        {...props}
        primaryColumn={primaryColumn}
        tableId={tableId}
      />
    );
  }

  return DataTableHeader;
}
