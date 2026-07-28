"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  TableBody,
  TableCell,
  Table as TablePrimitive,
  TableRow,
} from "@plotkeys/ui/table";
import type { Row, RowSelectionState, Table } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import type { ComponentProps, ComponentType, CSSProperties } from "react";
import type { TableId } from "@/utils/table-settings";
import type { TableScrollState } from "./types";
import { VirtualRow } from "./virtual-row";

export type CoreDataTableContentRuntime<TData> = {
  getStickyClassName: (columnId: string, baseClassName?: string) => string;
  getStickyStyle: (columnId: string) => CSSProperties;
  handleDragEnd: ComponentProps<typeof DndContext>["onDragEnd"];
  rows: Row<TData>[];
  rowHeight: number;
  rowSelection: RowSelectionState;
  rowVirtualizer: Pick<
    Virtualizer<HTMLDivElement, Element>,
    "getTotalSize" | "getVirtualItems"
  >;
  sensors: ComponentProps<typeof DndContext>["sensors"];
  tableId: TableId;
  tableScroll: TableScrollState;
};

export type CoreDataTableContentHeaderProps<TData> = {
  table: Table<TData>;
  tableScroll?: TableScrollState;
};

type Props<TData> = {
  header: ComponentType<CoreDataTableContentHeaderProps<TData>>;
  nonClickableColumns?: Set<string>;
  onCellClick?: (rowId: string, columnId: string) => void;
  runtime: CoreDataTableContentRuntime<TData>;
  table: Table<TData>;
};

export function CoreDataTableContent<TData>({
  header,
  nonClickableColumns = new Set(["select", "actions"]),
  onCellClick,
  runtime,
  table,
}: Props<TData>) {
  const Header = header;
  const {
    getStickyClassName,
    getStickyStyle,
    handleDragEnd,
    rows,
    rowHeight,
    rowSelection,
    rowVirtualizer,
    sensors,
    tableId,
    tableScroll,
  } = runtime;
  const { columnOrder, columnSizing, columnVisibility } = table.getState();
  const columnsLength = table.getAllLeafColumns().length;
  const virtualItems = rowVirtualizer.getVirtualItems() as VirtualItem[];

  return (
    <DndContext
      id={`${tableId}-table-dnd`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <TablePrimitive className="w-full min-w-full">
        <Header table={table} tableScroll={tableScroll} />
        <TableBody
          className="border-l-0 border-r-0 block"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualItems.length > 0 ? (
            virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];

              if (!row) {
                return null;
              }

              return (
                <VirtualRow
                  key={row.id}
                  row={row}
                  virtualStart={virtualRow.start}
                  rowHeight={rowHeight}
                  getStickyStyle={getStickyStyle}
                  getStickyClassName={getStickyClassName}
                  nonClickableColumns={nonClickableColumns}
                  onCellClick={onCellClick}
                  columnSizing={columnSizing}
                  columnOrder={columnOrder}
                  columnVisibility={columnVisibility}
                  isSelected={rowSelection[row.id] ?? false}
                />
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columnsLength} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TablePrimitive>
    </DndContext>
  );
}
