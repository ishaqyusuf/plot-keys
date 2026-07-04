import { cookies } from "next/headers";
import {
  type AllTableSettings,
  mergeWithDefaults,
  TABLE_SETTINGS_COOKIE,
  type TableId,
  type TableSettings,
} from "./table-settings";

export async function getInitialTableSettings(
  tableId: TableId,
): Promise<TableSettings> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(TABLE_SETTINGS_COOKIE)?.value;

  if (!saved) {
    return mergeWithDefaults(undefined, tableId);
  }

  try {
    const allSettings: AllTableSettings = JSON.parse(saved);
    return mergeWithDefaults(allSettings[tableId], tableId);
  } catch {
    return mergeWithDefaults(undefined, tableId);
  }
}
