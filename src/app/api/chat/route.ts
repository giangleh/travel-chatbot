import { fetchAllSpots } from "@/lib/airtable";
import { buildSystemPrompt, streamChat, validateInput } from "@/lib/claude";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Message } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, "chat", 20);
  if (rateLimited) return rateLimited;

  try {
    const { message, history } = (await request.json()) as {
      message: string;
      history: Message[];
    };

    const sanitized = validateInput(message);
    if (!sanitized) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    const spots = await fetchAllSpots();
    const systemPrompt = buildSystemPrompt(spots);

    const messages: Message[] = [
      ...history.slice(-20),
      { role: "user", content: sanitized },
    ];

    const result = streamChat(systemPrompt, messages);
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}
