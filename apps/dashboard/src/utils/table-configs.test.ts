import { describe, expect, test } from "bun:test";

import {
  getTableConfig,
  NON_REORDERABLE_COLUMNS,
  ROW_HEIGHTS,
  SORT_FIELD_MAPS,
  STICKY_COLUMNS,
  TABLE_CONFIGS,
} from "./table-configs";
import { defaultHiddenColumns, type TableId } from "./table-settings";

const tableIds = Object.keys(defaultHiddenColumns) as TableId[];

describe("table identity configuration", () => {
  test("declares explicit configuration for every dashboard table identity", () => {
    expect(Object.keys(TABLE_CONFIGS).sort()).toEqual([...tableIds].sort());

    for (const tableId of tableIds) {
      const config = getTableConfig(tableId);

      expect(config.tableId).toBe(tableId);
      expect(config.stickyColumns).toBe(STICKY_COLUMNS[tableId]);
      expect(config.nonReorderableColumns).toBe(
        NON_REORDERABLE_COLUMNS[tableId],
      );
      expect(config.rowHeight).toBe(ROW_HEIGHTS[tableId]);
      expect(config.sortFieldMap).toBe(SORT_FIELD_MAPS[tableId]);
    }
  });

  test("keeps sticky and action columns non-reorderable", () => {
    for (const tableId of tableIds) {
      const config = getTableConfig(tableId);

      expect(config.nonReorderableColumns.has("actions")).toBe(true);
      for (const stickyColumn of config.stickyColumns) {
        expect(config.nonReorderableColumns.has(stickyColumn.id)).toBe(true);
      }
    }
  });

  test("declares sortable backend fields only through the table identity map", () => {
    for (const tableId of tableIds) {
      const config = getTableConfig(tableId);

      expect(Object.keys(config.sortFieldMap).length).toBeGreaterThan(0);
      for (const [columnId, sortField] of Object.entries(config.sortFieldMap)) {
        expect(columnId.trim().length).toBeGreaterThan(0);
        expect(sortField.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
