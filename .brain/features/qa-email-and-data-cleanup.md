# QA email and data cleanup

- `EMAIL_DELIVERY_MODE` controls ordinary `console` or `live` delivery.
  `EMAIL_QA_DOMAIN_ROUTES` remains active in either mode: mapped `.test`
  recipients are always provider-routed, unmapped `.test` recipients fail
  closed, and mixed lists route independently.
- QA mail preserves the synthetic identity in subject, banner, provider header,
  and delivery evidence.
- `Company` is the explicit QA isolation root. New companies are
  server-classified from the owner email; legacy candidates need explicit
  platform-admin adoption, and identities cannot cross QA/live membership
  lanes.
- `/platform/qa-maintenance` exposes discovery, adoption, preview, blockers,
  signed destructive confirmation, and purge execution.
- Cleanup removes Vercel Blob assets first, removes non-live Vercel domain
  attachments, blocks paid subscriptions/purchased or active custom domains
  and missing provider credentials, revokes sessions, deletes company
  aggregates, and retains counts-only receipts.
