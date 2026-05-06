import { describe, it, expect } from "vitest";
import { getMissingFields } from "@/lib/list-manager";

describe("getMissingFields", () => {
  it("returns all fields when input is empty", () => {
    const missing = getMissingFields({});
    expect(missing).toContain("name");
    expect(missing).toContain("neighborhood");
    expect(missing).toContain("category");
    expect(missing).toContain("hours");
    expect(missing).toContain("rating");
    expect(missing).toContain("whatToTry");
    expect(missing).toContain("station");
    expect(missing).toContain("walkTime");
  });

  it("returns empty array when all fields present", () => {
    const missing = getMissingFields({
      name: "Test", neighborhood: "Ginza", category: "Coffee",
      hours: "09:00-18:00", rating: 4.5, whatToTry: "Latte",
      station: "Ginza", walkTime: 5,
    });
    expect(missing).toHaveLength(0);
  });

  it("returns only missing fields", () => {
    const missing = getMissingFields({ name: "Test", neighborhood: "Ginza" });
    expect(missing).not.toContain("name");
    expect(missing).not.toContain("neighborhood");
    expect(missing).toContain("category");
  });
});
