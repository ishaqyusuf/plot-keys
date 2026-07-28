import { buildSandboxUrl } from "@plotkeys/utils/app-urls";
import { headers } from "next/headers";

export async function buildLegacySandboxRedirect(path = "/") {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return buildSandboxUrl({
    currentHost: host,
    currentProtocol: protocol,
    path,
  });
}
