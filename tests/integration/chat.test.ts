import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/airtable", () => ({
  fetchAllSpots: vi.fn().mockResolvedValue([
    { id: "1", name: "Turret Coffee", neighborhood: "Ginza", category: "Coffee", hours: "07:00-18:00", rating: 4.6, whatToTry: "Turret Latte", station: "Ginza", walkTime: 4 },
  ]),
}));

vi.mock("ai", () => ({
  streamText: vi.fn().mockReturnValue({
    toDataStreamResponse: () => new Response('{"text":"Here are coffee spots in Ginza"}', { status: 200 }),
  }),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn().mockReturnValue("mock-model"),
}));

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for empty message", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "", history: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 200 for valid message", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "coffee in Ginza", history: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
