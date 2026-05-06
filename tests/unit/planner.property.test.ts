import { describe, it } from "vitest";
import fc from "fast-check";
import { groupByProximity, optimizeRoute, clusterNeighborhoods } from "@/lib/planner";
import type { Spot, Category } from "@/types";

const NEIGHBORHOODS = ["Ginza", "Shinjuku", "Shibuya", "Daikanyama", "Nakameguro", "Harajuku", "Omotesando"];
const CATEGORIES: Category[] = ["Bakery", "Coffee", "Camera", "Eyewear", "Jewelry", "Sight"];

const spotArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  neighborhood: fc.constantFrom(...NEIGHBORHOODS),
  category: fc.constantFrom(...CATEGORIES),
  hours: fc.constant("09:00-18:00"),
  rating: fc.float({ min: 1, max: 5, noNaN: true }),
  whatToTry: fc.string({ minLength: 1, maxLength: 50 }),
  station: fc.string({ minLength: 1, maxLength: 20 }),
  walkTime: fc.integer({ min: 1, max: 30 }),
}) as fc.Arbitrary<Spot>;

describe("planner property-based tests", () => {
  it("groupByProximity: every spot appears exactly once", () => {
    fc.assert(
      fc.property(fc.array(spotArbitrary, { minLength: 1, maxLength: 50 }), (spots) => {
        const groups = groupByProximity(spots);
        const allGrouped = [...groups.values()].flat();
        return allGrouped.length === spots.length;
      })
    );
  });

  it("optimizeRoute: output is a permutation of input", () => {
    fc.assert(
      fc.property(fc.array(spotArbitrary, { minLength: 1, maxLength: 20 }), (spots) => {
        const result = optimizeRoute(spots);
        if (result.length !== spots.length) return false;
        const inputNames = spots.map((s) => s.name).sort();
        const outputNames = result.map((s) => s.name).sort();
        return JSON.stringify(inputNames) === JSON.stringify(outputNames);
      })
    );
  });

  it("clusterNeighborhoods: all input neighborhoods appear in output", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.constantFrom(...NEIGHBORHOODS), { minLength: 1, maxLength: 7 }),
        (neighborhoods) => {
          const clusters = clusterNeighborhoods(neighborhoods);
          const allClustered = clusters.flat();
          return neighborhoods.every((n) => allClustered.includes(n));
        }
      )
    );
  });

  it("clusterNeighborhoods: no duplicates in output", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.constantFrom(...NEIGHBORHOODS), { minLength: 1, maxLength: 7 }),
        (neighborhoods) => {
          const clusters = clusterNeighborhoods(neighborhoods);
          const allClustered = clusters.flat();
          return new Set(allClustered).size === allClustered.length;
        }
      )
    );
  });
});
