import { describe, expect, it } from "vitest";
import {
  capabilities,
  capabilityFamilies,
  capabilityPositioning,
  capabilityStats,
  declaredCapabilities,
  getCapabilitiesByFamily,
  getCapabilitiesByLayer,
  getCapability,
  getCapabilityFamily,
  resolveDeclaredCapabilities,
  technologyStack,
} from "@/data/capabilities";
import { businessLayers, layerIds } from "@/data/layers";
import { getSolutionCategoryById } from "@/data/solutions";
import { getProduct } from "@/data/products";

/**
 * The capability inventory is a direct transcription of the business's declared
 * product lines. These tests protect two things:
 *
 *   1. Nothing gets dropped. Every declared phrase maps to a line that carries it.
 *   2. Nothing gets over-claimed. Capabilities are positioned as outcomes, never as
 *      technology menus, guaranteed results or prices.
 */

/** The owner's canonical product-line letters, A through W. */
const EXPECTED_CODES = "ABCDEFGHIJKLMNOPQRSTUVW".split("");

/** Every distinct phrase from the owner's declared capability list. */
const DECLARED_LIST = [
  "Business AI Automation",
  "AI Automation",
  "AI Agents",
  "AI Chatbots",
  "AI Business Assistants",
  "AI Lead Generation Systems",
  "AI Lead Qualification",
  "AI Sales Agents",
  "AI Customer Support Agents",
  "n8n automation",
  "Make automation",
  "Zapier automation",
  "Webhooks",
  "API integrations",
  "REST API integrations",
  "CRM integrations",
  "Custom CRM",
  "CRM automation",
  "Lead management systems",
  "Sales pipeline systems",
  "Business dashboards",
  "Analytics dashboards",
  "Admin dashboards",
  "Internal business tools",
  "Custom web applications",
  "Next.js",
  "React",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "AI-powered websites",
  "Lead-generating websites",
  "Custom business websites",
  "AI-powered custom tools",
  "SaaS MVPs",
  "AI SaaS systems",
  "Client portals",
  "Employee portals",
  "Knowledge bases",
  "RAG systems",
  "AI knowledge assistants",
  "AI document systems",
  "Personalized business tools",
  "Personal websites",
  "Personal brand websites",
  "Portfolio websites",
  "Professional portfolio websites",
];

describe("product-line coverage", () => {
  it("covers every letter A–W exactly once", () => {
    const codes = capabilities.map((item) => item.code).sort();
    expect(codes).toEqual(EXPECTED_CODES);
  });

  it("has unique ids and orders, so links and sections cannot collide", () => {
    const ids = capabilities.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    const orders = capabilities.map((item) => item.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("resolves a capability by letter and by id", () => {
    expect(getCapability("B")?.id).toBe("ai-agents");
    expect(getCapability("b")?.id).toBe("ai-agents");
    expect(getCapability("rag-knowledge-assistant")?.code).toBe("T");
    expect(getCapability("Z")).toBeUndefined();
  });

  it("maps every declared capability to a real home — nothing is dropped", () => {
    for (const phrase of DECLARED_LIST) {
      const entry = declaredCapabilities.find(
        (item) => item.phrase.toLowerCase() === phrase.toLowerCase(),
      );
      expect(entry, `"${phrase}" has no home in the inventory`).toBeDefined();
      const isStack = entry!.mappedTo === "technology-stack";
      const capability = capabilities.find((item) => item.id === entry!.mappedTo);
      expect(
        isStack || Boolean(capability),
        `"${phrase}" points at "${entry!.mappedTo}", which does not exist`,
      ).toBe(true);
    }
  });

  it("never resolves a declared phrase to a dangling target", () => {
    const dangling = resolveDeclaredCapabilities().filter(
      (entry) => entry.mappedTo !== "technology-stack" && entry.target === null,
    );
    expect(dangling).toEqual([]);
  });

  it("lists every declared capability in the site copy as well", () => {
    // `covers` is the human-readable register shown on each card; the declared list
    // above is the machine-readable one. They must agree.
    const covered = capabilities.flatMap((item) => item.covers?.en ?? []).map((v) => v.toLowerCase());
    const missing = DECLARED_LIST.filter(
      (phrase) => !covered.includes(phrase.toLowerCase()) && !declaredCapabilities.some((d) => d.phrase === phrase),
    );
    expect(missing).toEqual([]);
  });
});

describe("capability content", () => {
  it("gives every capability a complete outcome-first description", () => {
    for (const item of capabilities) {
      expect(item.name.bn.length, `${item.id} name.bn`).toBeGreaterThan(0);
      expect(item.name.en.length, `${item.id} name.en`).toBeGreaterThan(0);
      expect(item.outcome.bn.length, `${item.id} outcome.bn`).toBeGreaterThan(0);
      expect(item.outcome.en.length, `${item.id} outcome.en`).toBeGreaterThan(0);
      expect(item.problem.en.length, `${item.id} problem.en`).toBeGreaterThan(0);
      expect(item.system.en.length, `${item.id} system.en`).toBeGreaterThan(0);
      expect(item.includes.bn.length, `${item.id} includes.bn`).toBeGreaterThan(0);
      expect(item.includes.en.length, `${item.id} includes.en`).toBeGreaterThan(0);
    }
  });

  it("ties every capability to a real layer, family, solution and product", () => {
    for (const item of capabilities) {
      expect(getCapabilityFamily(item.family), `${item.id} family`).toBeDefined();
      expect(item.layers.length).toBeGreaterThan(0);
      for (const layer of item.layers) {
        expect(layerIds, `${item.id} layer ${layer}`).toContain(layer);
      }
      for (const slug of item.related.solutions) {
        expect(getSolutionCategoryById(slug), `${item.id} solution ${slug}`).toBeDefined();
      }
      for (const slug of item.related.products) {
        expect(getProduct(slug), `${item.id} product ${slug}`).toBeDefined();
      }
    }
  });

  it("gives every family at least one capability", () => {
    for (const family of capabilityFamilies) {
      expect(getCapabilitiesByFamily(family.id).length, family.id).toBeGreaterThan(0);
    }
  });

  it("reaches every one of the six layers from at least one capability", () => {
    for (const layer of businessLayers) {
      expect(getCapabilitiesByLayer(layer.id).length, `layer ${layer.id}`).toBeGreaterThan(0);
    }
  });

  it("marks custom work as scoped rather than inventing a price", () => {
    for (const item of capabilities) {
      if (item.engagement === "product") {
        // Productised lines must point at a real catalogue product that carries the price.
        expect(item.related.products.length, `${item.id} needs a product`).toBeGreaterThan(0);
      } else {
        expect(item.related.products.length, `${item.id} is scoped, so it must not point at a price`).toBe(0);
      }
    }
  });
});

describe("honesty rules for capability claims (§02/§03)", () => {
  it("never states a price inside the capability inventory", () => {
    for (const item of capabilities) {
      const text = [item.outcome, item.problem, item.system].map((v) => `${v.bn} ${v.en}`).join(" ") +
        [...item.includes.bn, ...item.includes.en].join(" ");
      // A taka amount or a "starting at" style price would mean a price leaked in here.
      expect(/৳|\bBDT\b|\bTk\.?\s?\d/i.test(text), `${item.id} appears to contain a price`).toBe(false);
    }
  });

  it("never promises a guaranteed result", () => {
    const banned = /guarantee|guaranteed|নিশ্চিত (?:প্রবৃদ্ধি|ফলাফল|আয়)|100% (?:growth|result)/i;
    for (const item of capabilities) {
      const text = `${item.outcome.bn} ${item.outcome.en} ${item.system.bn} ${item.system.en}`;
      expect(banned.test(text), `${item.id} contains a guarantee claim`).toBe(false);
    }
  });

  it("states that descriptions explain how a system works, not a promised outcome", () => {
    expect(capabilityPositioning.outcomeNote.bn.length).toBeGreaterThan(0);
    expect(capabilityPositioning.outcomeNote.en).toMatch(/not a guaranteed result/i);
  });

  it("leads with outcomes rather than technology", () => {
    expect(capabilityPositioning.principle.en).toMatch(/do not sell technology/i);
    expect(capabilityPositioning.combination.length).toBeGreaterThanOrEqual(8);
    // The technologies are present, but only as implementation detail.
    expect(technologyStack.length).toBeGreaterThan(0);
    for (const tech of technologyStack) {
      expect(tech.role.bn.length).toBeGreaterThan(0);
      expect(tech.role.en.length).toBeGreaterThan(0);
    }
  });
});

describe("capability stats", () => {
  it("reports numbers computed from the data, not hand-written", () => {
    const stats = capabilityStats();
    expect(stats.lines).toBe(capabilities.length);
    expect(stats.families).toBe(capabilityFamilies.length);
    expect(stats.declared).toBe(declaredCapabilities.length);
    expect(stats.technologies).toBe(technologyStack.length);
    expect(stats.productised + stats.scoped).toBe(stats.lines);
  });
});
