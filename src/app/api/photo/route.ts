import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const cache = new Map<string, { url: string; ts: number }>();
const TTL = 86_400_000; // 24h

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const cached = cache.get(query);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ url: cached.url });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ url: "" });

  try {
    const findRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query + " Tokyo")}&inputtype=textquery&fields=photos&key=${key}`
    );
    const findData = await findRes.json();
    const photoRef = findData?.candidates?.[0]?.photos?.[0]?.photo_reference;

    if (!photoRef) return NextResponse.json({ url: "" });

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${key}`;
    cache.set(query, { url, ts: Date.now() });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ url: "" });
  }
}
