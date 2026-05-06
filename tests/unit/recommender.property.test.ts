import { describe, it } from "vitest";
import fc from "fast-check";
import { recommend, rankByRating } from "@/lib/recommender";
import type { Spot, Category } from "@/types";

const NEIGHBORHOODS = ["Ginza", "Shinjuku", "Shibuya", "Daikanyama"];
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

describe("recommender property-based tests", () => {
  it("recommend: results are always a subset of input", () => {
    fc.assert(
      fc.property(
        fc.array(spotArbitrary, { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...NEIGHBORHOODS),
        (spots, neighborhood) => {
          const result = recommend(spots, { neighborhood });
          return result.every((r) => spots.some((s) => s.id === r.id));
        }
      )
    );
  });

  it("recommend: filtered results match the filter criteria", () => {
    fc.assert(
      fc.property(
        fc.array(spotArbitrary, { minLength: 0, maxLength: 30 }),
        fc.constantFrom(...CATEGORIES),
        (spots, category) => {
          const result = recommend(spots, { category });
          return result.every((r) => r.category.toLowerCase() === category.toLowerCase());
        }
      )
    );
  });

  it("rankByRating: output is sorted descending", () => {
    fc.assert(
      fc.property(fc.array(spotArbitrary, { minLength: 0, maxLength: 30 }), (spots) => {
        const result = rankByRating(spots);
        for (let i = 0; i < result.length - 1; i++) {
          if (result[i].rating < result[i + 1].rating) return false;
        }
        return true;
      })
    );
  });

  it("rankByRating: output length equals input length", () => {
    fc.assert(
      fc.property(fc.array(spotArbitrary, { minLength: 0, maxLength: 30 }), (spots) => {
        return rankByRating(spots).length === spots.length;
      })
    );
  });
});
