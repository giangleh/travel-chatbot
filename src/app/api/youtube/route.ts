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
          content: `Watch this YouTube video: ${url}

Extract ALL locations/spots mentioned in the video content, narration, or description.

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

Respond with ONLY valid JSON: {"spots": [...], "videoTitle": "title of the video", "summary": "brief summary of the video content"}

If no locations are found, return {"spots": [], "videoTitle": "...", "summary": "..."}`,
        },
      ],
      maxTokens: 4096,
    });

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code fences or partial response
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Last resort: try to find and fix truncated JSON
        const jsonMatch = cleaned.match(/\{[\s\S]*"spots"\s*:\s*\[/);
        if (jsonMatch) {
          // Find all complete spot objects
          const spotRegex = /\{[^{}]*"name"\s*:\s*"[^"]+[^{}]*\}/g;
          const spots = [...cleaned.matchAll(spotRegex)].map((m) => {
            try { return JSON.parse(m[0]); } catch { return null; }
          }).filter(Boolean);
          const titleMatch = cleaned.match(/"videoTitle"\s*:\s*"([^"]*)"/);
          const summaryMatch = cleaned.match(/"summary"\s*:\s*"([^"]*)"/);
          parsed = { spots, videoTitle: titleMatch?.[1] || "", summary: summaryMatch?.[1] || "" };
        } else {
          parsed = { spots: [], videoTitle: "", summary: "Could not parse response" };
        }
      }
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
