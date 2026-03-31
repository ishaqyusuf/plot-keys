import { describe, expect, it } from "bun:test";

import {
  extractApexDomain,
  isValidDomainName,
  buildDnsInstructions,
  SUPPORTED_TLDS,
  ALL_SUPPORTED_TLDS,
} from "./domain-service";

describe("isValidDomainName", () => {
  it("accepts standard domains", () => {
    expect(isValidDomainName("example.com")).toBe(true);
    expect(isValidDomainName("my-site.org")).toBe(true);
    expect(isValidDomainName("sub.domain.com")).toBe(true);
  });

  it("accepts .com.ng domains", () => {
    expect(isValidDomainName("myrealestate.com.ng")).toBe(true);
    expect(isValidDomainName("luxury-properties.com.ng")).toBe(true);
    expect(isValidDomainName("a.ng")).toBe(true);
    expect(isValidDomainName("test.org.ng")).toBe(true);
    expect(isValidDomainName("test.net.ng")).toBe(true);
  });

  it("rejects invalid domains", () => {
    expect(isValidDomainName("")).toBe(false);
    expect(isValidDomainName("a")).toBe(false);
    expect(isValidDomainName("not a domain")).toBe(false);
    expect(isValidDomainName("http://example.com")).toBe(false);
    expect(isValidDomainName("-invalid.com")).toBe(false);
  });

  it("rejects labels longer than 63 characters", () => {
    const longLabel = "a".repeat(64);
    expect(isValidDomainName(`${longLabel}.com`)).toBe(false);
    expect(isValidDomainName(`${"a".repeat(63)}.com`)).toBe(true);
  });
});

describe("extractApexDomain", () => {
  it("returns two-part domains as-is", () => {
    expect(extractApexDomain("example.com")).toBe("example.com");
    expect(extractApexDomain("test.ng")).toBe("test.ng");
  });

  it("extracts apex from subdomains", () => {
    expect(extractApexDomain("www.example.com")).toBe("example.com");
    expect(extractApexDomain("shop.example.com")).toBe("example.com");
    expect(extractApexDomain("deep.sub.example.com")).toBe("example.com");
  });

  it("handles two-part ccTLDs correctly", () => {
    expect(extractApexDomain("mysite.com.ng")).toBe("mysite.com.ng");
    expect(extractApexDomain("www.mysite.com.ng")).toBe("mysite.com.ng");
    expect(extractApexDomain("shop.mysite.com.ng")).toBe("mysite.com.ng");
    expect(extractApexDomain("mysite.org.ng")).toBe("mysite.org.ng");
    expect(extractApexDomain("mysite.net.ng")).toBe("mysite.net.ng");
  });

  it("handles other two-part ccTLDs", () => {
    expect(extractApexDomain("example.co.uk")).toBe("example.co.uk");
    expect(extractApexDomain("www.example.co.uk")).toBe("example.co.uk");
    expect(extractApexDomain("example.co.za")).toBe("example.co.za");
    expect(extractApexDomain("example.com.gh")).toBe("example.com.gh");
  });

  it("strips trailing dot", () => {
    expect(extractApexDomain("example.com.")).toBe("example.com");
    expect(extractApexDomain("mysite.com.ng.")).toBe("mysite.com.ng");
  });
});

describe("buildDnsInstructions", () => {
  it("returns A record for apex domains", () => {
    const result = buildDnsInstructions("example.com");
    expect(result.hostname).toBe("example.com");
    expect(result.records.length).toBeGreaterThanOrEqual(1);
    expect(result.records[0]?.type).toBe("A");
    expect(result.records[0]?.name).toBe("@");
    expect(result.records[0]?.value).toBe("76.76.21.21");
  });

  it("returns A record for .com.ng apex domains", () => {
    const result = buildDnsInstructions("mysite.com.ng");
    expect(result.hostname).toBe("mysite.com.ng");
    expect(result.records[0]?.type).toBe("A");
    expect(result.records[0]?.name).toBe("@");
    expect(result.records[0]?.value).toBe("76.76.21.21");
  });

  it("returns CNAME for subdomains", () => {
    const result = buildDnsInstructions("www.example.com");
    expect(result.records[0]?.type).toBe("CNAME");
    expect(result.records[0]?.name).toBe("www");
    expect(result.records[0]?.value).toBe("cname.vercel-dns.com");
  });

  it("returns CNAME for .com.ng subdomains", () => {
    const result = buildDnsInstructions("www.mysite.com.ng");
    expect(result.records[0]?.type).toBe("CNAME");
    expect(result.records[0]?.name).toBe("www");
    expect(result.records[0]?.value).toBe("cname.vercel-dns.com");
  });

  it("includes verification challenges as TXT records", () => {
    const result = buildDnsInstructions("example.com", [
      { type: "TXT", domain: "_vercel.example.com", value: "vc-abc123" },
    ]);
    expect(result.records.length).toBe(2);
    expect(result.records[1]?.type).toBe("TXT");
    expect(result.records[1]?.value).toBe("vc-abc123");
  });
});

describe("TLD constants", () => {
  it("includes Nigerian TLDs", () => {
    expect(SUPPORTED_TLDS.nigeria).toContain(".com.ng");
    expect(SUPPORTED_TLDS.nigeria).toContain(".ng");
    expect(SUPPORTED_TLDS.nigeria).toContain(".org.ng");
    expect(SUPPORTED_TLDS.nigeria).toContain(".net.ng");
  });

  it("includes global TLDs", () => {
    expect(SUPPORTED_TLDS.global).toContain(".com");
    expect(SUPPORTED_TLDS.global).toContain(".net");
    expect(SUPPORTED_TLDS.global).toContain(".org");
  });

  it("ALL_SUPPORTED_TLDS combines both groups", () => {
    expect(ALL_SUPPORTED_TLDS.length).toBe(
      SUPPORTED_TLDS.global.length + SUPPORTED_TLDS.nigeria.length,
    );
    expect(ALL_SUPPORTED_TLDS).toContain(".com");
    expect(ALL_SUPPORTED_TLDS).toContain(".com.ng");
  });
});
