"use client";

import { useState } from "react";

interface ExtractedSpot {
  name: string;
  city?: string;
  neighborhood: string;
  category: string;
  hours: string;
  rating: number;
  whatToTry: string;
  station: string;
  walkTime: number;
  isDuplicate?: boolean;
}

interface YouTubePreviewProps {
  spots: ExtractedSpot[];
  videoTitle: string;
  summary: string;
  onApprove: (spots: ExtractedSpot[]) => void;
  onCancel: () => void;
}

export function YouTubePreview({ spots, videoTitle, summary, onApprove, onCancel }: YouTubePreviewProps) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(spots.map((_, i) => i).filter((i) => !spots[i].isDuplicate))
  );

  const toggle = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  return (
    <div className="space-y-3">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-sm font-semibold text-purple-800">🎬 {videoTitle}</p>
        <p className="text-xs text-purple-600 mt-1">{summary}</p>
        <p className="text-xs text-gray-500 mt-2">{spots.length} spots found · Select which to add:</p>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {spots.map((spot, i) => (
          <label
            key={i}
            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors ${
              spot.isDuplicate
                ? "bg-yellow-50 border-yellow-200 opacity-70"
                : selected.has(i)
                ? "bg-blue-50 border-blue-300"
                : "bg-white border-gray-200"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(i)}
              onChange={() => toggle(i)}
              className="mt-1 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium truncate">{spot.name}</span>
                {spot.isDuplicate && (
                  <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1 rounded">duplicate</span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {spot.city && `${spot.city} · `}{spot.neighborhood} · {spot.category}
                {spot.rating > 0 && ` · ⭐${spot.rating}`}
              </p>
              {spot.whatToTry && <p className="text-xs text-gray-600 italic">💡 {spot.whatToTry}</p>}
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onApprove(spots.filter((_, i) => selected.has(i)))}
          disabled={selected.size === 0}
          className="flex-1 rounded-full bg-green-600 px-4 py-2 text-sm text-white font-medium hover:bg-green-700 disabled:opacity-50"
        >
          Add {selected.size} spot{selected.size !== 1 ? "s" : ""} to list
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
