import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import type { Spot, Message } from "@/types";

export function buildSystemPrompt(spots: Spot[]): string {
  const spotList = spots
    .map((s) => `${s.name} | ${s.neighborhood} | ${s.category} | ${s.hours} | ⭐${s.rating} | ${s.whatToTry} | ${s.station}, ${s.walkTime} min`)
    .join("\n");

  return `You are Conan, an expert Tokyo travel agent. You help users discover curated spots, plan itineraries, and manage their list.

RULES:
- Always prioritize Master List spots over external recommendations.
- When recommending, return ALL matching Master List entries first, sorted by rating.
- If no Master List matches, suggest exactly 3 external picks (highest rated).
- For itineraries, group spots by neighborhood proximity to minimize transit.
- For multi-location responses, include a route suggestion.
- When user wants to add/update/remove a spot, guide them through the process.
- Detect context automatically: "plan my trip" = planning mode, "I'm in X" = trip mode.
- Be concise, warm, and actionable.

RESPONSE FORMAT:
You MUST respond with ONLY a valid JSON object. No text before or after the JSON. No markdown code fences. Just the raw JSON:
{"text": "your conversational response (markdown allowed)", "locations": [{"name": "...", "neighborhood": "...", "category": "...", "hours": "...", "rating": N, "whatToTry": "...", "station": "...", "walkTime": N}], "quickActions": ["suggested follow-up 1", "suggested follow-up 2"], "action": null}

For list modifications, set action:
{"type": "add", "data": {...partial spot}} or {"type": "remove", "data": {"name": "..."}} or {"type": "update", "data": {"name": "...", "fields": {...}}}

If no locations to show, set locations to [].
If no action needed, set action to null.

MASTER LIST (${spots.length} spots):
${spotList}

NEIGHBORHOODS: Ginza, Shinjuku, Nakano, Shibuya, Daikanyama, Nakameguro, Meguro, Harajuku, Omotesando, Aoyama, Asakusa, Yanaka, Ueno, Gotokuji, Setagaya, Kichijoji, Shimokitazawa
CATEGORIES: Bakery, Coffee, Camera, Eyewear, Jewelry, Sight`;
}

export function streamChat(systemPrompt: string, messages: Message[]) {
  const formattedMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: formattedMessages,
    maxTokens: 2048,
  });
}

export function validateInput(message: string): string {
  // SEC-2: Input sanitization
  let sanitized = message.trim();
  if (sanitized.length > 2000) {
    sanitized = sanitized.slice(0, 2000);
  }
  // Strip control characters except newlines
  sanitized = sanitized.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "");
  return sanitized;
}
