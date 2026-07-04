import { getDevAppUrlStrings } from "@plotkeys/utils";

function unique(values: Array<string | undefined>) {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ];
}

export const localAuthOrigins = [
  "http://localhost:3900",
  "http://localhost:3901",
  "http://localhost:3903",
  "http://127.0.0.1:3900",
  "http://127.0.0.1:3901",
  "http://127.0.0.1:3903",
] as const;

export const portlessAuthOrigins = [
  "http://plotkeys.localhost",
  "http://plotkeys.localhost:1355",
  "http://app-plotkeys.localhost",
  "http://app-plotkeys.localhost:1355",
  "http://tenant-plotkeys.localhost",
  "http://tenant-plotkeys.localhost:1355",
] as const;

export function getTrustedOrigins() {
  const urls = getDevAppUrlStrings();

  return unique(
    [
      urls.site,
      urls.dashboard,
      urls.tenantSite,
      ...localAuthOrigins,
      ...portlessAuthOrigins,
      process.env.BETTER_AUTH_TRUSTED_ORIGINS,
      process.env.AUTH_TRUSTED_ORIGINS,
    ].flatMap((value) =>
      value?.split(",").map((origin: string) => origin.trim()),
    ),
  );
}
