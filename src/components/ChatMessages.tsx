"use client";

import type { Message } from "ai";
import { useEffect, useRef } from "react";

interface SpotInfo {
  name: string;
  category: string;
  whatToTry: string;
  hours: string;
  rating: number;
  station: string;
  walkTime: number;
}

function mapsUrl(name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Tokyo Japan`)}`;
}

function tryParseJSON(content: string): { text: string; locations: SpotInfo[] } | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed.text && Array.isArray(parsed.locations)) return parsed;
  } catch { /* not JSON */ }
  return null;
}

function extractSpots(text: string): { intro: string; spots: SpotInfo[] } {
  const lines = text.split("\n");
  const spots: SpotInfo[] = [];
  const introLines: string[] = [];
  let currentSpot: Partial<SpotInfo> | null = null;
  let foundFirstSpot = false;

  for (const line of lines) {
    const spotMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*\((.+?)\)/);
    if (spotMatch) {
      if (currentSpot?.name) spots.push(currentSpot as SpotInfo);
      currentSpot = { name: spotMatch[1], category: spotMatch[2], whatToTry: "", hours: "", rating: 0, station: "", walkTime: 0 };
      foundFirstSpot = true;
      continue;
    }

    if (currentSpot) {
      const tryMatch = line.match(/What to Try[:\*]*\s*(.+)/i);
      const hoursMatch = line.match(/Hours[:\*]*\s*(.+)/i);
      const ratingMatch = line.match(/Rating[:\*]*\s*⭐?([\d.]+)/i);
      const walkMatch = line.match(/Walk[:\*]*\s*(\d+)\s*min\s*from\s*(.+)/i);

      if (tryMatch) currentSpot.whatToTry = tryMatch[1].replace(/\*/g, "").trim();
      else if (hoursMatch) currentSpot.hours = hoursMatch[1].replace(/\*/g, "").trim();
      else if (ratingMatch) currentSpot.rating = parseFloat(ratingMatch[1]);
      else if (walkMatch) { currentSpot.walkTime = parseInt(walkMatch[1]); currentSpot.station = walkMatch[2].replace(/\*/g, "").replace(/station/i, "").trim(); }
      // Section headers between spots
      else if (line.match(/^\*\*.*\*\*$/) && !line.match(/What|Hours|Rating|Walk/i)) {
        if (currentSpot?.name) spots.push(currentSpot as SpotInfo);
        currentSpot = null;
      }
    } else if (!foundFirstSpot) {
      introLines.push(line);
    }
  }
  if (currentSpot?.name) spots.push(currentSpot as SpotInfo);

  return { intro: introLines.join("\n").replace(/^#+\s*/gm, "").trim(), spots };
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
          <p className="text-xs text-gray-500">{spot.category}</p>
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

interface ChatMessagesProps {
  messages: Message[];
  completedIds: Set<string>;
}

export function ChatMessages({ messages, completedIds }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
      {messages.map((m) => {
        const isCompleted = m.role === "user" || completedIds.has(m.id);

        return (
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
              {m.role === "assistant" && isCompleted ? (
                <FormattedResponse content={m.content} />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{m.content}</p>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

function FormattedResponse({ content }: { content: string }) {
  const json = tryParseJSON(content);
  if (json) {
    return (
      <div className="space-y-3">
        <p className="whitespace-pre-wrap text-sm">{json.text}</p>
        {json.locations.length > 0 && (
          <div className="grid gap-2">
            {json.locations.map((spot) => <SpotCard key={spot.name} spot={spot} />)}
          </div>
        )}
      </div>
    );
  }

  const { intro, spots } = extractSpots(content);
  if (spots.length > 0) {
    return (
      <div className="space-y-3">
        {intro && <p className="whitespace-pre-wrap text-sm">{intro}</p>}
        <div className="grid gap-2">
          {spots.map((spot) => <SpotCard key={spot.name} spot={spot} />)}
        </div>
      </div>
    );
  }

  return <p className="whitespace-pre-wrap text-sm">{content}</p>;
}
