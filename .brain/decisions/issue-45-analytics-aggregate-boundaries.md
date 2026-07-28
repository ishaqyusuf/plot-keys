# Issue 45 - Analytics Aggregate Boundaries

Dashboard summary cards and reports must continue to read from finite aggregate queries, not from flattened infinite-list pages.

Current boundaries:

- Analytics summary cards use `getAnalyticsSummary`, `getPageViewsByDay`, `getTopPages`, `getTrafficSources`, `getPropertyAnalytics`, `getLeadSourceBreakdown`, and `getAgentPerformanceStats`.
- Report summary cards use `getMonthlyBusinessSummary` count queries.
- Bounded analytics drilldowns remain finite by design: recent analytics events are capped at 50 rows, top pages at 10 rows, property views at 10 rows, and listings performance at 20 rows.
- Operational row-list drilldowns use the shared paginated list contract instead of summary-card data.

Rule: do not derive aggregate totals from `data.pages` or any flattened infinite-query page. If an analytics/report drilldown becomes an unbounded operational table, migrate that drilldown to the shared paginated contract and leave summary cards on aggregate queries.
