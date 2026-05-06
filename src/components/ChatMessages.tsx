"use client";

import type { Message } from "ai";
import { useEffect, useRef } from "react";

interface ParsedResponse {
  text: string;
  locations: Array<{
    name: string;
    neighborhood: string;
    category: string;
    hours: string;
    rating: number;
    whatToTry: string;
    station: string;
    walkTime: number;
  }>;
}

function parseAssistantMessage(content: string): ParsedResponse | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed.text) return parsed;
  } catch {
    // Not JSON
  }
  return null;
}

function mapsUrl(name: string, neighborhood: string): string {
  const q = encodeURIComponent(`${name} ${neighborhood} Tokyo Japan`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function SpotCard({ spot }: { spot: ParsedResponse["locations"][0] }) {
  return (
    <a
      href={mapsUrl(spot.name, spot.neighborhood)}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-gray-900">{spot.name}</h3>
          <p className="text-xs text-gray-500">{spot.neighborhood} · {spot.category}</p>
        </div>
        <span className="text-xs font-medium text-yellow-600">⭐ {spot.rating}</span>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        🕐 {spot.hours} · 🚶 {spot.walkTime} min from {spot.station}
      </p>
      <p className="text-xs text-gray-700 mt-1 italic">{spot.whatToTry}</p>
      <p className="text-xs text-blue-600 mt-2">🗺️ Open in Google Maps →</p>
    </a>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const parsed = parseAssistantMessage(content);

  if (!parsed) {
    return <p className="whitespace-pre-wrap text-sm">{content}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="whitespace-pre-wrap text-sm">{parsed.text}</p>
      {parsed.locations?.length > 0 && (
        <div className="grid gap-2">
          {parsed.locations.map((spot) => (
            <SpotCard key={spot.name} spot={spot} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatMessages({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-50 border border-gray-200 shadow-sm"
            }`}
            data-testid={`message-${m.role}`}
          >
            {m.role === "assistant" ? (
              <AssistantMessage content={m.content} />
            ) : (
              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
            )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
