import type { StickyColumnConfig, TableConfig } from "@/components/tables/core";
import type { TableId } from "./table-settings";

/**
 * Sticky column configurations for each table
 */
export const STICKY_COLUMNS: Record<TableId, StickyColumnConfig[]> = {
  agents: [
    { id: "select", width: 50 },
    { id: "agent", width: 260 },
  ],
  blog: [
    { id: "select", width: 50 },
    { id: "post", width: 300 },
  ],
  appointments: [
    { id: "select", width: 50 },
    { id: "appointment", width: 260 },
  ],
  customers: [
    { id: "select", width: 50 },
    { id: "name", width: 320 },
  ],
  departments: [
    { id: "select", width: 50 },
    { id: "department", width: 260 },
  ],
  employees: [
    { id: "select", width: 50 },
    { id: "employee", width: 260 },
  ],
  leads: [
    { id: "select", width: 50 },
    { id: "lead", width: 260 },
  ],
  "leave-requests": [
    { id: "select", width: 50 },
    { id: "request", width: 280 },
  ],
  notifications: [
    { id: "select", width: 50 },
    { id: "notification", width: 320 },
  ],
  payroll: [
    { id: "select", width: 50 },
    { id: "entry", width: 260 },
  ],
  projects: [
    { id: "select", width: 50 },
    { id: "project", width: 280 },
  ],
  properties: [
    { id: "select", width: 50 },
    { id: "property", width: 320 },
  ],
  team: [
    { id: "select", width: 50 },
    { id: "member", width: 260 },
  ],
};

/**
 * Sort field mappings for each table
 * Maps column IDs to their backend sort field names
 */
export const SORT_FIELD_MAPS: Record<TableId, Record<string, string>> = {
  agents: {
    agent: "name",
    bio: "bio",
    contact: "email",
    displayOrder: "displayOrder",
  },
  blog: {
    activity: "updatedAt",
    excerpt: "excerpt",
    post: "title",
  },
  appointments: {
    appointment: "name",
    assignment: "agent",
    notes: "notes",
    schedule: "scheduledAt",
    status: "status",
  },
  customers: {
    contact: "contact",
    createdAt: "created_at",
    name: "name",
    status: "status",
  },
  departments: {
    createdAt: "createdAt",
    department: "name",
    description: "description",
  },
  employees: {
    contact: "email",
    department: "department",
    employee: "name",
    role: "workRole",
    status: "status",
  },
  leads: {
    captured: "createdAt",
    lead: "name",
    source: "source",
    status: "status",
  },
  "leave-requests": {
    dates: "startDate",
    reason: "reason",
    request: "employee",
  },
  notifications: {
    meta: "type",
    notification: "title",
  },
  payroll: {
    amount: "grossAmount",
    employee: "name",
    entry: "employee",
    notes: "notes",
    status: "status",
  },
  projects: {
    project: "name",
    timeline: "startDate",
    status: "status",
  },
  properties: {
    price: "price",
    property: "title",
    status: "status",
    type: "type",
  },
  team: {
    access: "role",
    joined: "createdAt",
    member: "name",
  },
};

/**
 * Non-reorderable columns for each table (sticky + actions)
 */
export const NON_REORDERABLE_COLUMNS: Record<TableId, Set<string>> = {
  agents: new Set(["select", "agent", "actions"]),
  blog: new Set(["select", "post", "actions"]),
  appointments: new Set(["select", "appointment", "actions"]),
  customers: new Set(["select", "name", "actions"]),
  departments: new Set(["select", "department", "actions"]),
  employees: new Set(["select", "employee", "actions"]),
  leads: new Set(["select", "lead", "actions"]),
  "leave-requests": new Set(["select", "request", "actions"]),
  notifications: new Set(["select", "notification", "actions"]),
  payroll: new Set(["select", "entry", "actions"]),
  projects: new Set(["select", "project", "actions"]),
  properties: new Set(["select", "property", "actions"]),
  team: new Set(["select", "member", "actions"]),
};

/**
 * Row heights for each table
 */
export const ROW_HEIGHTS: Record<TableId, number> = {
  agents: 45,
  blog: 45,
  appointments: 45,
  customers: 45,
  departments: 45,
  employees: 45,
  leads: 45,
  "leave-requests": 45,
  notifications: 45,
  payroll: 45,
  projects: 45,
  properties: 45,
  team: 45,
};

/**
 * Summary grid heights for tables with summary sections
 */
export const SUMMARY_GRID_HEIGHTS: Partial<Record<TableId, number>> = {
  customers: 180,
};

/**
 * Complete table configurations
 */
export const TABLE_CONFIGS: Record<TableId, TableConfig> = {
  agents: {
    tableId: "agents",
    stickyColumns: STICKY_COLUMNS.agents,
    sortFieldMap: SORT_FIELD_MAPS.agents,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.agents,
    rowHeight: ROW_HEIGHTS.agents,
  },
  blog: {
    tableId: "blog",
    stickyColumns: STICKY_COLUMNS.blog,
    sortFieldMap: SORT_FIELD_MAPS.blog,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.blog,
    rowHeight: ROW_HEIGHTS.blog,
  },
  appointments: {
    tableId: "appointments",
    stickyColumns: STICKY_COLUMNS.appointments,
    sortFieldMap: SORT_FIELD_MAPS.appointments,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.appointments,
    rowHeight: ROW_HEIGHTS.appointments,
  },
  customers: {
    tableId: "customers",
    stickyColumns: STICKY_COLUMNS.customers,
    sortFieldMap: SORT_FIELD_MAPS.customers,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.customers,
    rowHeight: ROW_HEIGHTS.customers,
    summaryGridHeight: SUMMARY_GRID_HEIGHTS.customers,
  },
  departments: {
    tableId: "departments",
    stickyColumns: STICKY_COLUMNS.departments,
    sortFieldMap: SORT_FIELD_MAPS.departments,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.departments,
    rowHeight: ROW_HEIGHTS.departments,
  },
  employees: {
    tableId: "employees",
    stickyColumns: STICKY_COLUMNS.employees,
    sortFieldMap: SORT_FIELD_MAPS.employees,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.employees,
    rowHeight: ROW_HEIGHTS.employees,
  },
  leads: {
    tableId: "leads",
    stickyColumns: STICKY_COLUMNS.leads,
    sortFieldMap: SORT_FIELD_MAPS.leads,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.leads,
    rowHeight: ROW_HEIGHTS.leads,
  },
  "leave-requests": {
    tableId: "leave-requests",
    stickyColumns: STICKY_COLUMNS["leave-requests"],
    sortFieldMap: SORT_FIELD_MAPS["leave-requests"],
    nonReorderableColumns: NON_REORDERABLE_COLUMNS["leave-requests"],
    rowHeight: ROW_HEIGHTS["leave-requests"],
  },
  notifications: {
    tableId: "notifications",
    stickyColumns: STICKY_COLUMNS.notifications,
    sortFieldMap: SORT_FIELD_MAPS.notifications,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.notifications,
    rowHeight: ROW_HEIGHTS.notifications,
  },
  payroll: {
    tableId: "payroll",
    stickyColumns: STICKY_COLUMNS.payroll,
    sortFieldMap: SORT_FIELD_MAPS.payroll,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.payroll,
    rowHeight: ROW_HEIGHTS.payroll,
  },
  projects: {
    tableId: "projects",
    stickyColumns: STICKY_COLUMNS.projects,
    sortFieldMap: SORT_FIELD_MAPS.projects,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.projects,
    rowHeight: ROW_HEIGHTS.projects,
  },
  properties: {
    tableId: "properties",
    stickyColumns: STICKY_COLUMNS.properties,
    sortFieldMap: SORT_FIELD_MAPS.properties,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.properties,
    rowHeight: ROW_HEIGHTS.properties,
  },
  team: {
    tableId: "team",
    stickyColumns: STICKY_COLUMNS.team,
    sortFieldMap: SORT_FIELD_MAPS.team,
    nonReorderableColumns: NON_REORDERABLE_COLUMNS.team,
    rowHeight: ROW_HEIGHTS.team,
  },
};

/**
 * Get table configuration by ID
 */
export function getTableConfig(tableId: TableId): TableConfig {
  return TABLE_CONFIGS[tableId];
}
