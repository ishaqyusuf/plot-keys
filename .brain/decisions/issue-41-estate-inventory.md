# Issue 41 - Estate Inventory Pagination Decision

Estate launch inventory stays on a finite card-grid instead of the shared infinite table contract.

Reason: estate launches are bounded workspace objects that group listings, plots, reservations, documents, and launch copy. The primary workflow is scanning a small set of launches and opening a detail workspace, not triaging an unbounded operational row feed.

The estate detail workspace keeps its nested property inventory finite with an explicit 200-row cap. That cap is deliberate for the launch-detail view; if estate detail inventory becomes an unbounded operational workflow, migrate that nested list to the shared paginated contract instead of deriving summary cards from partial pages.
