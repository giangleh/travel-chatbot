import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { fetchAllSpots } from "@/lib/airtable";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;

function isYouTubeUrl(text: string): string | null {
  const match = text.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/);
  return match ? match[0] : null;
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "youtube", 5, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const { url } = await request.json();

    if (!url || !isYouTubeUrl(url)) {
      return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const existingSpots = await fetchAllSpots();
    const existingNames = new Set(existingSpots.map((s) => s.name.toLowerCase()));

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Watch this YouTube video and extract ALL locations/spots mentioned in the video or its description.

For each location, extract:
- name (exact name of the place)
- city (which city it's in)
- neighborhood (if mentioned)
- category (one of: Bakery, Coffee, Camera, Eyewear, Jewelry, Sight, Sightseeing, Shopping, Shrine, Temple, Park, Museum, Restaurant, Bar)
- hours (opening hours if mentioned, otherwise empty string)
- rating (if mentioned, otherwise 0)
- whatToTry (signature item or experience if mentioned, otherwise empty string)
- station (nearest train station if mentioned, otherwise empty string)
- walkTime (minutes from station if mentioned, otherwise 0)

Respond with ONLY valid JSON: {"spots": [...], "videoTitle": "...", "summary": "brief summary of the video"}

If no locations are found, return {"spots": [], "videoTitle": "...", "summary": "..."}`,
            },
            {
              type: "file",
              data: url,
              mimeType: "video/mp4",
            },
          ],
        },
      ],
      maxTokens: 4096,
    });

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { spots: [], videoTitle: "", summary: "Could not parse response" };
    }

    // Mark duplicates
    const spots = (parsed.spots || []).map((s: Record<string, unknown>) => ({
      ...s,
      isDuplicate: existingNames.has((s.name as string || "").toLowerCase()),
    }));

    return Response.json({
      spots,
      videoTitle: parsed.videoTitle || "",
      summary: parsed.summary || "",
    });
  } catch (error) {
    console.error("YouTube extraction error:", error);
    return Response.json({ error: "Failed to extract from video. It may be private or unavailable." }, { status: 500 });
  }
}
