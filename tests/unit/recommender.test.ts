import { describe, it, expect } from "vitest";
import { recommend, rankByRating, formatCards } from "@/lib/recommender";
import type { Spot } from "@/types";

const mockSpots: Spot[] = [
  { id: "1", name: "Turret Coffee", neighborhood: "Ginza", category: "Coffee", hours: "07:00-18:00", rating: 4.6, whatToTry: "Turret Latte", station: "Ginza", walkTime: 4 },
  { id: "2", name: "Glitch Coffee", neighborhood: "Ginza", category: "Coffee", hours: "09:00-19:00", rating: 4.7, whatToTry: "Pour-over", station: "Ginza", walkTime: 3 },
  { id: "3", name: "Viron Shibuya", neighborhood: "Shibuya", category: "Bakery", hours: "09:00-21:00", rating: 4.6, whatToTry: "Baguette Retro", station: "Shibuya", walkTime: 5 },
  { id: "4", name: "Map Camera", neighborhood: "Shinjuku", category: "Camera", hours: "11:00-19:00", rating: 4.8, whatToTry: "Used Leica", station: "Shinjuku", walkTime: 3 },
];

describe("recommend", () => {
  it("filters by neighborhood", () => {
    const result = recommend(mockSpots, { neighborhood: "Ginza" });
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.neighborhood === "Ginza")).toBe(true);
  });

  it("filters by category", () => {
    const result = recommend(mockSpots, { category: "Coffee" });
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.category === "Coffee")).toBe(true);
  });

  it("filters by both neighborhood and category", () => {
    const result = recommend(mockSpots, { neighborhood: "Ginza", category: "Coffee" });
    expect(result).toHaveLength(2);
  });

  it("returns empty array when no matches", () => {
    const result = recommend(mockSpots, { neighborhood: "Ueno" });
    expect(result).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const result = recommend(mockSpots, { neighborhood: "ginza" });
    expect(result).toHaveLength(2);
  });

  it("returns results sorted by rating descending", () => {
    const result = recommend(mockSpots, { neighborhood: "Ginza" });
    expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
  });
});

describe("rankByRating", () => {
  it("sorts spots by rating descending", () => {
    const result = rankByRating(mockSpots);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rating).toBeGreaterThanOrEqual(result[i + 1].rating);
    }
  });

  it("does not mutate original array", () => {
    const original = [...mockSpots];
    rankByRating(mockSpots);
    expect(mockSpots).toEqual(original);
  });
});

describe("formatCards", () => {
  it("marks master list spots correctly", () => {
    const ids = new Set(["1", "2"]);
    const cards = formatCards(mockSpots.slice(0, 3), ids);
    expect(cards[0].isOnMasterList).toBe(true);
    expect(cards[2].isOnMasterList).toBe(false);
  });

  it("generates navigate URLs", () => {
    const cards = formatCards([mockSpots[0]], new Set(["1"]));
    expect(cards[0].navigateUrl).toContain("google.com/maps");
  });
});
