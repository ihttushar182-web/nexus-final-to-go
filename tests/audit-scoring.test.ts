import { describe, expect, it } from "vitest";
import {
  ANSWER_SCORES,
  MAX_LAYER_SCORE,
  buildEvidence,
  buildSnapshot,
  determinePriority,
  getMaturityBand,
  scoreAnswer,
} from "@/lib/audit/scoring";
import { layerIds } from "@/data/layers";
import type { AuditAnswer, LayerId } from "@/types";

/** All layers answered "yes" unless overridden — keeps each test focused on one layer. */
const answers = (fill: Partial<Record<LayerId, AuditAnswer>> = {}): Record<LayerId, AuditAnswer> => {
  const base = Object.fromEntries(layerIds.map((id) => [id, "yes"])) as Record<LayerId, AuditAnswer>;
  return { ...base, ...fill };
};

describe("audit scoring (§22)", () => {
  it("scores Yes = 10, Partial = 5, No = 0", () => {
    expect(ANSWER_SCORES).toEqual({ yes: 10, partial: 5, no: 0 });
    expect(scoreAnswer("yes")).toBe(10);
    expect(scoreAnswer("partial")).toBe(5);
    expect(scoreAnswer("no")).toBe(0);
  });

  it("scores all six layers independently", () => {
    const snapshot = buildSnapshot(answers({ operations: "partial", control: "no" }));

    expect(snapshot.layerScores).toHaveLength(6);
    expect(snapshot.maxTotal).toBe(6 * MAX_LAYER_SCORE);
    expect(snapshot.layerScores.find((l) => l.layer === "operations")?.score).toBe(5);
    expect(snapshot.layerScores.find((l) => l.layer === "control")?.score).toBe(0);
    expect(snapshot.total).toBe(10 * 4 + 5);
    expect(snapshot.percent).toBe(75);
  });

  it("always produces a total between 0 and maxTotal", () => {
    const allNo = buildSnapshot(answers(Object.fromEntries(layerIds.map((id) => [id, "no"])) as Partial<Record<LayerId, AuditAnswer>>));
    const allYes = buildSnapshot(answers({}));
    expect(allNo.total).toBe(0);
    expect(allNo.percent).toBe(0);
    expect(allYes.total).toBe(allYes.maxTotal);
    expect(allYes.percent).toBe(100);
  });

  it("maps scores to the six maturity band labels from the spec", () => {
    expect(getMaturityBand(10).label.en).toBe("Strong Foundation");
    expect(getMaturityBand(9).label.en).toBe("Strong Foundation");
    expect(getMaturityBand(7).label.en).toBe("Partially Defined");
    expect(getMaturityBand(5).label.en).toBe("Needs Development");
    expect(getMaturityBand(3).label.en).toBe("Mostly Manual");
    expect(getMaturityBand(1).label.en).toBe("Limited Integration");
    expect(getMaturityBand(0).label.en).toBe("Low Visibility");
  });

  it("picks the lowest layer as the priority", () => {
    const { priorityLayer, weakestLayer } = determinePriority([
      { layer: "identity", score: 10 },
      { layer: "structure", score: 5 },
      { layer: "operations", score: 0 },
      { layer: "growth", score: 10 },
      { layer: "intelligence", score: 5 },
      { layer: "control", score: 10 },
    ]);
    expect(priorityLayer).toBe("operations");
    expect(weakestLayer).toBe("operations");
  });

  it("breaks a tie with the stated biggest problem, then the stated goal", () => {
    const tied = [
      { layer: "identity" as LayerId, score: 0 },
      { layer: "control" as LayerId, score: 0 },
    ];
    expect(determinePriority(tied, { problemLayer: "control" }).priorityLayer).toBe("control");
    expect(determinePriority(tied, { goalLayer: "control" }).priorityLayer).toBe("control");
    // No signal at all → canonical layer order decides, deterministically.
    expect(determinePriority(tied).priorityLayer).toBe("identity");
  });

  it("is deterministic for the same input", () => {
    const input = answers({ control: "partial", intelligence: "no" });
    expect(JSON.stringify(buildSnapshot(input))).toBe(JSON.stringify(buildSnapshot(input)));
  });

  it("never claims scientific validation in the evidence block", () => {
    const snapshot = buildSnapshot(answers({ control: "no" }));
    const evidence = buildEvidence(snapshot, { biggestProblemLabel: "No visibility", goalLabel: "More leads" });
    const text = evidence.map((item) => `${item.bn} ${item.en}`).join(" ");

    expect(text).toContain("scientifically validated");
    expect(text).toMatch(/diagnostic snapshot/i);
    // Evidence is built only from the user's own answers — no external claim.
    expect(text).toContain("No visibility");
    expect(text).toContain("More leads");
  });
});
