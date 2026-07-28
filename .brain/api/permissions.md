# QA maintenance permissions

- Only platform admins may discover/adopt candidates or operate purge runs.
- Companies marked purging reject sessions and normal company operations.

# Sandbox permissions

- Sandbox authoring requires an authenticated active membership whose role is
  `platform_admin`.
- Authenticated owners, admins, agents, and staff are rejected from authoring
  procedures and protected Sandbox pages.
- Share-ID preview reads are anonymous, read-only, `noindex`, and expose no
  mutation contract.
- Archiving is a soft delete. Archived profiles are excluded from authoring
  lists and their share preview resolves as not found.
- The Sandbox same-origin tRPC endpoint exposes only sign-in and sandbox
  contracts; general dashboard/business routers are not mounted.
