import { fetchAllSpots, createSpot, updateSpot, deleteSpot } from "@/lib/airtable";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Spot } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request, "spots:read", 30);
  if (rateLimited) return rateLimited;

  try {
    const spots = await fetchAllSpots();
    return Response.json(spots);
  } catch (error) {
    console.error("Spots GET error:", error);
    return Response.json({ error: "Failed to fetch spots" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "spots:write", 5);
  if (rateLimited) return rateLimited;

  try {
    const body = (await request.json()) as Omit<Spot, "id">;
    const spot = await createSpot(body);
    return Response.json(spot, { status: 201 });
  } catch (error) {
    console.error("Spots POST error:", error);
    return Response.json({ error: "Failed to create spot" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const rateLimited = checkRateLimit(request, "spots:write", 5);
  if (rateLimited) return rateLimited;

  try {
    const { id, ...fields } = (await request.json()) as Spot;
    const spot = await updateSpot(id, fields);
    return Response.json(spot);
  } catch (error) {
    console.error("Spots PUT error:", error);
    return Response.json({ error: "Failed to update spot" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const rateLimited = checkRateLimit(request, "spots:write", 5);
  if (rateLimited) return rateLimited;

  try {
    const { id } = (await request.json()) as { id: string };
    await deleteSpot(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Spots DELETE error:", error);
    return Response.json({ error: "Failed to delete spot" }, { status: 500 });
  }
}
