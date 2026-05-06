import { describe, it, expect } from "vitest";
import { groupByProximity, clusterNeighborhoods, optimizeRoute, splitMorningAfternoon, planDay } from "@/lib/planner";
import type { Spot } from "@/types";

const makeSpot = (overrides: Partial<Spot> = {}): Spot => ({
  id: "1", name: "Test", neighborhood: "Ginza", category: "Coffee",
  hours: "09:00-18:00", rating: 4.5, whatToTry: "Test", station: "Ginza", walkTime: 5,
  ...overrides,
});

describe("groupByProximity", () => {
  it("groups spots by neighborhood", () => {
    const spots = [
      makeSpot({ neighborhood: "Ginza", name: "A" }),
      makeSpot({ neighborhood: "Ginza", name: "B" }),
      makeSpot({ neighborhood: "Shibuya", name: "C" }),
    ];
    const groups = groupByProximity(spots);
    expect(groups.get("Ginza")).toHaveLength(2);
    expect(groups.get("Shibuya")).toHaveLength(1);
  });
});

describe("clusterNeighborhoods", () => {
  it("clusters adjacent neighborhoods", () => {
    const clusters = clusterNeighborhoods(["Shibuya", "Daikanyama", "Ginza"]);
    // Shibuya and Daikanyama are adjacent, Ginza is standalone
    const shibuyaCluster = clusters.find((c) => c.includes("Shibuya"));
    expect(shibuyaCluster).toContain("Daikanyama");
    expect(clusters.find((c) => c.includes("Ginza"))).not.toContain("Shibuya");
  });

  it("handles single neighborhood", () => {
    const clusters = clusterNeighborhoods(["Ginza"]);
    expect(clusters).toEqual([["Ginza"]]);
  });

  it("handles empty input", () => {
    expect(clusterNeighborhoods([])).toEqual([]);
  });
});

describe("optimizeRoute", () => {
  it("sorts by walkTime within same neighborhood for 3+ spots", () => {
    const spots = [
      makeSpot({ name: "A", walkTime: 10 }),
      makeSpot({ name: "B", walkTime: 2 }),
      makeSpot({ name: "C", walkTime: 7 }),
    ];
    const result = optimizeRoute(spots);
    expect(result).toHaveLength(3);
    expect(result[0].walkTime).toBeLessThanOrEqual(result[1].walkTime);
  });

  it("returns input unchanged for 2 or fewer spots", () => {
    const spots = [makeSpot({ name: "A" })];
    expect(optimizeRoute(spots)).toEqual(spots);
  });
});

describe("splitMorningAfternoon", () => {
  it("splits evenly", () => {
    const spots = Array.from({ length: 12 }, (_, i) =>
      makeSpot({ name: `S${i}`, hours: `${String(8 + i).padStart(2, "0")}:00-20:00` })
    );
    const { morning, afternoon } = splitMorningAfternoon(spots);
    expect(morning.length).toBe(6);
    expect(afternoon.length).toBe(6);
  });
});

describe("planDay", () => {
  it("creates a day plan with route URL", () => {
    const spots = [
      makeSpot({ name: "A" }),
      makeSpot({ name: "B" }),
    ];
    const plan = planDay(spots);
    expect(plan.dayNumber).toBe(1);
    expect(plan.routeUrl).toContain("google.com/maps");
    expect(plan.morning.length + plan.afternoon.length).toBe(2);
  });

  it("splits into morning/afternoon when >10 spots", () => {
    const spots = Array.from({ length: 12 }, (_, i) =>
      makeSpot({ name: `S${i}`, hours: `${String(8 + i).padStart(2, "0")}:00-20:00` })
    );
    const plan = planDay(spots);
    expect(plan.morning.length).toBeGreaterThan(0);
    expect(plan.afternoon.length).toBeGreaterThan(0);
  });
});
