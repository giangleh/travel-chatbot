"use client";

import { useEffect, useRef } from "react";

interface SpotInfo {
  name: string;
  neighborhood: string;
  category: string;
  whatToTry: string;
  hours: string;
  rating: number;
  station: string;
  walkTime: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function mapsUrl(name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Tokyo Japan`)}`;
}

function tryParseJSON(content: string): { text: string; locations?: SpotInfo[] } | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed.text) return parsed;
  } catch { /* not JSON */ }
  return null;
}

function SpotCard({ spot }: { spot: SpotInfo }) {
  return (
    <a
      href={mapsUrl(spot.name)}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-gray-900">{spot.name}</h3>
          <p className="text-xs text-gray-500">{spot.neighborhood} · {spot.category}</p>
        </div>
        {spot.rating > 0 && (
          <span className="text-xs font-medium text-yellow-600">⭐ {spot.rating}</span>
        )}
      </div>
      {(spot.hours || spot.walkTime > 0) && (
        <p className="text-xs text-gray-600 mt-1">
          {spot.hours && <>🕐 {spot.hours}</>}
          {spot.hours && spot.walkTime > 0 && " · "}
          {spot.walkTime > 0 && <>🚶 {spot.walkTime} min from {spot.station}</>}
        </p>
      )}
      {spot.whatToTry && (
        <p className="text-xs text-gray-700 mt-1 italic">💡 {spot.whatToTry}</p>
      )}
      <p className="text-xs text-blue-600 mt-2 font-medium">🗺️ Open in Google Maps →</p>
    </a>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const parsed = tryParseJSON(content);

  if (parsed) {
    return (
      <div className="space-y-3">
        <p className="whitespace-pre-wrap text-sm">{parsed.text}</p>
        {parsed.locations && parsed.locations.length > 0 && (
          <div className="grid gap-2">
            {parsed.locations.map((spot) => (
              <SpotCard key={spot.name} spot={spot} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return <p className="whitespace-pre-wrap text-sm">{content}</p>;
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-50 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Planning your trip</span>
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </div>
      </div>
    </div>
  );
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
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
      {isLoading && <LoadingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
