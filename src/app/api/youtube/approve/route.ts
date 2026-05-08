import { createSpot } from "@/lib/airtable";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "youtube:approve", 5, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const { spots } = await request.json();

    if (!Array.isArray(spots) || spots.length === 0) {
      return Response.json({ error: "No spots provided" }, { status: 400 });
    }

    const results = [];
    for (const spot of spots) {
      try {
        const created = await createSpot({
          name: spot.name || "",
          neighborhood: spot.neighborhood || "",
          category: spot.category || "Sight",
          hours: spot.hours || "",
          rating: spot.rating || 0,
          whatToTry: spot.whatToTry || "",
          station: spot.station || "",
          walkTime: spot.walkTime || 0,
        });
        results.push({ name: spot.name, success: true, id: created.id });
      } catch (e) {
        results.push({ name: spot.name, success: false, error: String(e) });
      }
    }

    return Response.json({ results });
  } catch (error) {
    console.error("YouTube approve error:", error);
    return Response.json({ error: "Failed to add spots" }, { status: 500 });
  }
}
