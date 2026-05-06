import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request, "maps", 60);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Response.json({ error: "Maps not configured" }, { status: 500 });
  }

  if (type === "embed") {
    const q = searchParams.get("q") || "";
    const url = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(q)}`;
    return Response.json({ embedUrl: url });
  }

  return Response.json({ error: "Invalid type parameter" }, { status: 400 });
}
