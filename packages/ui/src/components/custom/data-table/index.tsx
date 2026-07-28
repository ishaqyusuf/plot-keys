"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";

import { cn } from "../../../utils";
import { createContextFactory } from "../../../utils/context-factory";
import {
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableHeader as BaseTableHeader,
  TableRow as BaseTableRow,
  TableCell,
  TableHead,
} from "../../table";
import { DataTableLoadMore } from "./load-more";
import { DataTableSkeleton } from "./skeleton";

export type TableMeta<TData> = {
  hidePagination?: boolean;
  mobileMode?: {
    borderless?: boolean;
    hideHeader?: boolean;
  };
  rowClassName?: (row: { original: TData }) => string | undefined;
  rowClick?: (id: string, rowData: TData) => void;
};

export type DataTableProps<TData> = {
  checkbox?: boolean;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  mobileColumn?: ColumnDef<TData, any>;
  props?: {
    hasNextPage?: boolean;
    loadMoreRef?: ((node?: Element | null) => void) | null;
  };
  rowSelection?: RowSelectionState;
  setRowSelection?: (selection: RowSelectionState) => void;
  tableMeta?: TableMeta<TData>;
  tableScroll?: {
    containerRef?: React.RefObject<HTMLDivElement | null>;
  };
};

type DataTableContextValue<TData> = {
  isMobile: boolean;
  table: ReturnType<typeof useReactTable<TData>>;
} & DataTableProps<TData>;

const [DataTableProviderBase, useDataTableContext] =
  createContextFactory<DataTableContextValue<any>>("Table");

function DataTableRoot({
  children,
  className,
}: React.ComponentProps<typeof BaseTable>) {
  return (
    <BaseTable
      className={cn("min-w-full border-separate border-spacing-0", className)}
    >
      {children}
    </BaseTable>
  );
}

function Provider<TData>({
  args,
  children,
}: {
  args: [DataTableProps<TData>];
  children: React.ReactNode;
}) {
  const [props] = args;
  const [localRowSelection, setLocalRowSelection] = useState<RowSelectionState>(
    {},
  );
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const columns =
    isMobile && props.mobileColumn ? [props.mobileColumn] : props.columns;
  const table = useReactTable<TData>({
    columns,
    data: props.data,
    enableRowSelection: props.checkbox,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) =>
      String(
        (row as { id?: string }).id ?? (row as { uuid?: string }).uuid ?? index,
      ),
    onRowSelectionChange: (updater) => {
      const current = props.rowSelection ?? localRowSelection;
      const next = typeof updater === "function" ? updater(current) : updater;
      props.setRowSelection?.(next);
      setLocalRowSelection(next);
    },
    state: { rowSelection: props.rowSelection ?? localRowSelection },
  });

  return (
    <DataTableProviderBase value={{ ...props, isMobile, table }}>
      {children}
    </DataTableProviderBase>
  );
}

function TableHeader() {
  const { table, tableMeta } = useDataTableContext();

  if (tableMeta?.mobileMode?.hideHeader) {
    return null;
  }

  return (
    <BaseTableHeader className="[&_tr]:border-border">
      {table.getHeaderGroups().map((headerGroup) => (
        <BaseTableRow className="hover:bg-transparent" key={headerGroup.id}>
          {headerGroup.headers.map((header, index) => (
            <TableHead
              className={cn(
                "h-10 whitespace-nowrap border-b border-border bg-background px-3 text-left text-[11px] font-medium uppercase tracking-normal text-muted-foreground",
                (
                  header.column.columnDef.meta as
                    | { className?: string }
                    | undefined
                )?.className,
              )}
              data-column-index={index}
              key={header.id}
              style={{ width: header.getSize() }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </BaseTableRow>
      ))}
    </BaseTableHeader>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <BaseTableBody>{children}</BaseTableBody>;
}

function TableRow() {
  const { table, tableMeta } = useDataTableContext();

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <BaseTableRow
          className={cn(
            "group border-border/70 bg-background hover:bg-muted/35",
            tableMeta?.rowClick ? "cursor-pointer" : "",
            tableMeta?.rowClassName?.({ original: row.original }),
          )}
          data-state={row.getIsSelected() ? "selected" : undefined}
          key={row.id}
          onClick={() => tableMeta?.rowClick?.(row.id, row.original)}
        >
          {row.getVisibleCells().map((cell, index) => (
            <TableCell
              className={cn(
                "h-12 border-b border-border/70 px-3 py-2 align-middle text-sm",
                (
                  cell.column.columnDef.meta as
                    | { className?: string }
                    | undefined
                )?.className,
              )}
              data-column-index={index}
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </BaseTableRow>
      ))}
    </>
  );
}

function LoadMore() {
  const { props } = useDataTableContext();
  return <DataTableLoadMore {...props} />;
}

function SummaryHeader() {
  const { data } = useDataTableContext();
  const meta = (data as unknown as { meta?: { count?: number } }).meta;

  if (!meta?.count) {
    return null;
  }

  return (
    <div className="hidden items-center justify-between px-1 text-xs text-muted-foreground md:flex">
      <span>{meta.count} total</span>
    </div>
  );
}

export function useTableData({
  filter,
  route,
}: {
  filter: Record<string, unknown>;
  route: any;
}) {
  const { inView, ref } = useInView();
  const deferredSearch = useDeferredValue(filter.q);
  const infiniteQueryOptions = route.infiniteQueryOptions(
    { ...filter, q: deferredSearch },
    { getNextPageParam: ({ meta }: any) => meta?.cursor },
  );
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);

  const tableData = useMemo(() => {
    const infiniteData = data as { pages?: any[] } | undefined;
    const list =
      infiniteData?.pages?.flatMap((page: any) => page?.data ?? []) ?? [];
    const meta = ([...(infiniteData?.pages || [])].reverse()[0] as any)?.meta;

    return {
      data: Object.assign(list, { meta }),
      meta,
      resultCount: meta?.cursor,
      total: meta?.count,
    };
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching]);

  return {
    ...tableData,
    hasNextPage,
    isFetching,
    queryData: data,
    ref,
  };
}

const TableNamespace = Object.assign(DataTableRoot, {
  Body,
  LoadMore,
  Provider,
  Skeleton: DataTableSkeleton,
  SummaryHeader,
  TableHeader,
  TableRow,
});

export type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
export { cells } from "./cells";
export { TableNamespace as Table, useDataTableContext };
