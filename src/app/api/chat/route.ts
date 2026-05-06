import { fetchAllSpots } from "@/lib/airtable";
import { buildSystemPrompt, validateInput } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rate-limit";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "chat", 20);
  if (rateLimited) return rateLimited;

  try {
    const { messages } = await request.json();

    const lastMessage = messages[messages.length - 1];
    const sanitized = validateInput(lastMessage.content);
    if (!sanitized) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    let spots;
    try {
      spots = await fetchAllSpots();
    } catch (e) {
      console.error("Airtable error:", e);
      return Response.json({ error: "Failed to fetch spots from Airtable" }, { status: 500 });
    }

    const systemPrompt = buildSystemPrompt(spots);

    const result = streamText({
      model: google("gemini-2.5-flash", { structuredOutputs: false }),
      system: systemPrompt,
      messages: messages.slice(-20),
      maxTokens: 2048,
      providerOptions: {
        google: { responseModalities: ["TEXT"], responseMimeType: "application/json" },
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error (Gemini):", error);
    return Response.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}
