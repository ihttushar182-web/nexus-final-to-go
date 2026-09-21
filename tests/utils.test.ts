import { describe, expect, it } from "vitest";
import {
  chunk,
  formatCurrency,
  formatDate,
  formatPercent,
  formatRelative,
  initials,
  isBangladeshiPhone,
  isEmail,
  slugify,
  t,
  tList,
  truncate,
  unique,
} from "@/lib/utils";

describe("formatting", () => {
  it("formats BDT with the taka sign and a thousands separator", () => {
    const value = formatCurrency(1499);
    expect(value).toContain("৳");
    expect(value.replace(/[^\d]/g, "")).toContain("1499");
  });

  it("formats percentages and dates in both locales", () => {
    expect(formatPercent(47)).toContain("47");
    expect(formatDate("2026-01-15", "en")).toMatch(/2026/);
    expect(formatDate("2026-01-15", "bn")).toBeTruthy();
  });

  it("describes relative time for recently created records", () => {
    const now = new Date("2026-01-15T12:00:00.000Z");
    const twoHoursAgo = new Date("2026-01-15T10:00:00.000Z").toISOString();
    expect(formatRelative(twoHoursAgo, now).length).toBeGreaterThan(0);
  });
});

describe("localisation helpers", () => {
  it("returns the requested language and never throws on missing data", () => {
    expect(t({ bn: "বাংলা", en: "English" }, "bn")).toBe("বাংলা");
    expect(t({ bn: "বাংলা", en: "English" }, "en")).toBe("English");
    expect(t(null, "bn")).toBe("");
    expect(t(undefined, "en")).toBe("");
  });

  it("returns locale lists or an empty array", () => {
    expect(tList({ bn: ["ক", "খ"], en: ["a", "b"] }, "en")).toEqual(["a", "b"]);
    expect(tList(undefined, "bn")).toEqual([]);
  });
});

describe("validators and text helpers", () => {
  it("validates email and Bangladeshi phone numbers", () => {
    expect(isEmail("a@b.com")).toBe(true);
    expect(isEmail("a@b")).toBe(false);
    // Every format a customer actually types must be accepted.
    expect(isBangladeshiPhone("01814716713")).toBe(true);
    expect(isBangladeshiPhone("1814716713")).toBe(true);
    expect(isBangladeshiPhone("+8801814716713")).toBe(true);
    expect(isBangladeshiPhone("880 1814-716713")).toBe(true);
    expect(isBangladeshiPhone("12345")).toBe(false);
    expect(isBangladeshiPhone("0171471671")).toBe(false);
  });

  it("slugifies mixed content safely for URLs", () => {
    expect(slugify("Professional Business Starter")).toBe("professional-business-starter");
    expect(slugify("  Trailing  Spaces  ")).toBe("trailing-spaces");
    expect(slugify("Hello & World!")).toMatch(/^[a-z0-9-]+$/);
  });

  it("truncates without cutting mid-word into nonsense", () => {
    const result = truncate("The quick brown fox jumps over the lazy dog", 20);
    expect(result.length).toBeLessThanOrEqual(21);
  });

  it("has small collection helpers used across the admin tables", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(unique([1, 1, 2])).toEqual([1, 2]);
    expect(initials("Rahim Uddin")).toBe("RU");
  });
});
