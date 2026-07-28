"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import type { ReactNode } from "react";
import {
  AgentNameCell,
  type AgentPerformanceReportRows,
  AgentTitleCell,
  type ListingPerformanceReportRows,
  ListingStatusCell,
  ListingTitleCell,
  ListingTypeCell,
  ReportNumberCell,
} from "@/components/reports/report-table-cells";

type AgentPerformanceReportTableInput = {
  agents: AgentPerformanceReportRows;
};

type ListingsPerformanceReportTableInput = {
  listings: ListingPerformanceReportRows;
};

type ReportTableFrameInput = {
  children: ReactNode;
};

function ReportTableFrame({ children }: ReportTableFrameInput) {
  return (
    <div className="overflow-auto overscroll-contain border-x border-b border-border scrollbar-hide">
      {children}
    </div>
  );
}

export function AgentPerformanceReportTable({
  agents,
}: AgentPerformanceReportTableInput) {
  return (
    <ReportTableFrame>
      <Table className="min-w-[44rem]">
        <TableHeader className="bg-background">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 border-t border-border px-4 font-medium text-foreground">
              Agent
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 font-medium text-foreground">
              Title
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 text-right font-medium text-foreground">
              Appointments
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 text-right font-medium text-foreground">
              Completed
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 text-right font-medium text-foreground">
              Leads
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow
              className="border-border bg-background hover:bg-muted"
              key={agent.id}
            >
              <TableCell className="h-12 border-b border-border px-4 py-3 font-medium">
                <AgentNameCell agent={agent} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-muted-foreground">
                <AgentTitleCell agent={agent} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-right">
                <ReportNumberCell value={agent.appointments} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-right">
                <ReportNumberCell emphasized value={agent.completed} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-right">
                <ReportNumberCell value={agent.leads} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ReportTableFrame>
  );
}

export function ListingsPerformanceReportTable({
  listings,
}: ListingsPerformanceReportTableInput) {
  return (
    <ReportTableFrame>
      <Table className="min-w-[46rem]">
        <TableHeader className="bg-background">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 border-t border-border px-4 font-medium text-foreground">
              Title
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 font-medium text-foreground">
              Type
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 font-medium text-foreground">
              Status
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 text-right font-medium text-foreground">
              Views (30d)
            </TableHead>
            <TableHead className="h-12 border-t border-border px-4 text-right font-medium text-foreground">
              Appointments
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow
              className="border-border bg-background hover:bg-muted"
              key={listing.id}
            >
              <TableCell className="h-12 max-w-48 truncate border-b border-border px-4 py-3 font-medium">
                <ListingTitleCell listing={listing} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3">
                <ListingTypeCell listing={listing} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3">
                <ListingStatusCell listing={listing} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-right">
                <ReportNumberCell value={listing.views30d} />
              </TableCell>
              <TableCell className="h-12 border-b border-border px-4 py-3 text-right">
                <ReportNumberCell value={listing.appointments} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ReportTableFrame>
  );
}
