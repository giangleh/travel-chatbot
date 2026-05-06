import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSpots = [
  { id: "1", name: "Turret Coffee", neighborhood: "Ginza", category: "Coffee", hours: "07:00-18:00", rating: 4.6, whatToTry: "Turret Latte", station: "Ginza", walkTime: 4 },
];

vi.mock("@/lib/airtable", () => ({
  fetchAllSpots: vi.fn().mockResolvedValue(mockSpots),
  createSpot: vi.fn().mockResolvedValue({ id: "2", name: "New Spot", neighborhood: "Shibuya", category: "Coffee", hours: "09:00-18:00", rating: 4.0, whatToTry: "Latte", station: "Shibuya", walkTime: 5 }),
  updateSpot: vi.fn().mockResolvedValue({ ...mockSpots[0], rating: 4.8 }),
  deleteSpot: vi.fn().mockResolvedValue(undefined),
}));

describe("GET /api/spots", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns spots list", async () => {
    const { GET } = await import("@/app/api/spots/route");
    const request = new Request("http://localhost/api/spots");
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Turret Coffee");
  });
});

describe("POST /api/spots", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("creates a new spot", async () => {
    const { POST } = await import("@/app/api/spots/route");
    const request = new Request("http://localhost/api/spots", {
      method: "POST",
      body: JSON.stringify({ name: "New Spot", neighborhood: "Shibuya", category: "Coffee", hours: "09:00-18:00", rating: 4.0, whatToTry: "Latte", station: "Shibuya", walkTime: 5 }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});

describe("DELETE /api/spots", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("deletes a spot", async () => {
    const { DELETE } = await import("@/app/api/spots/route");
    const request = new Request("http://localhost/api/spots", {
      method: "DELETE",
      body: JSON.stringify({ id: "1" }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await DELETE(request);
    expect(response.status).toBe(200);
  });
});
