import { describe, expect, it } from "vitest";
import { getUnlockedLabCount, LAB_SIMULATION_IDS, labScenarios } from "./labScenarios";

const expectedNewIds = [
  "threat-map",
  "sql-query",
  "session-lock",
  "api-object-access",
  "csrf-check",
  "password-vault",
  "upload-gate",
  "url-fetch",
  "browser-headers",
  "secret-leak",
  "firewall-trace",
  "https-certificate",
  "signed-release",
  "ransomware-restore",
  "cloud-bucket",
  "incident-evidence",
  "authorized-pentest",
];

describe("TEUM safe simulation deck", () => {
  it("preserves three legacy simulation IDs and adds the requested 17 new cases", () => {
    expect(labScenarios).toHaveLength(20);
    expect(new Set(LAB_SIMULATION_IDS).size).toBe(20);
    expect(LAB_SIMULATION_IDS.slice(0, 3)).toEqual(["mail-room", "web-check", "access-audit"]);
    expect(LAB_SIMULATION_IDS.slice(3)).toEqual(expectedNewIds);
  });

  it("unlocks scenarios progressively at the intended XP levels", () => {
    expect(getUnlockedLabCount(1)).toBe(0);
    expect(getUnlockedLabCount(2)).toBe(0);
    expect(getUnlockedLabCount(3)).toBe(7);
    expect(getUnlockedLabCount(4)).toBe(12);
    expect(getUnlockedLabCount(5)).toBe(17);
    expect(getUnlockedLabCount(6)).toBe(20);
    expect(getUnlockedLabCount(20)).toBe(20);
  });

  it("provides three evidence-led decisions and source references for every case", () => {
    for (const scenario of labScenarios) {
      expect(scenario.title.length, scenario.id).toBeGreaterThan(3);
      expect(scenario.briefing.length, scenario.id).toBeGreaterThan(20);
      expect(scenario.artifactText.length, scenario.id).toBeGreaterThan(20);
      expect(scenario.steps, scenario.id).toHaveLength(3);
      expect(scenario.minLevel, scenario.id).toBeGreaterThanOrEqual(3);
      expect(scenario.minLevel, scenario.id).toBeLessThanOrEqual(6);
      expect(scenario.references.length, scenario.id).toBeGreaterThan(0);
      for (const step of scenario.steps) {
        expect(step.options, `${scenario.id}: ${step.stepTitle}`).toHaveLength(4);
        expect(step.correctIndex, `${scenario.id}: ${step.stepTitle}`).toBeGreaterThanOrEqual(0);
        expect(step.correctIndex, `${scenario.id}: ${step.stepTitle}`).toBeLessThan(4);
        expect(step.explanation.length, `${scenario.id}: ${step.stepTitle}`).toBeGreaterThan(20);
      }
      for (const reference of scenario.references) {
        expect(reference.url, scenario.id).toMatch(/^https:\/\//);
      }
    }
  });

  it("includes an explicitly authorized, synthetic-only penetration-testing exercise", () => {
    const pentest = labScenarios.find((scenario) => scenario.id === "authorized-pentest");
    expect(pentest).toBeDefined();
    expect(`${pentest?.briefing}\n${pentest?.artifactText}`).toMatch(/teum\.test/i);
    expect(`${pentest?.briefing}\n${pentest?.mission}`).toMatch(/허가|승인/);
    expect(pentest?.steps).toHaveLength(3);
  });
});
