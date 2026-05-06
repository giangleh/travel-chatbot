"use client";

import type { Spot } from "@/types";

interface LocationCardProps {
  spot: Spot;
  isOnMasterList: boolean;
  navigateUrl: string;
  photoSearchUrl: string;
}

export function LocationCard({ spot, isOnMasterList, navigateUrl, photoSearchUrl }: LocationCardProps) {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm" data-testid="location-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm">{spot.name}</h3>
          <p className="text-xs text-gray-500">
            {spot.neighborhood} · {spot.category}
          </p>
        </div>
        <span className="text-xs font-medium text-yellow-600">⭐ {spot.rating}</span>
      </div>

      <p className="text-xs text-gray-600 mt-1">
        🕐 {spot.hours} · 🚶 {spot.walkTime} min from {spot.station}
      </p>
      <p className="text-xs text-gray-700 mt-1 italic">{spot.whatToTry}</p>

      {isOnMasterList && (
        <p className="text-xs text-green-600 font-medium mt-1" data-testid="master-list-badge">
          ✓ On Giang&apos;s Master List
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <a
          href={photoSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
          data-testid="photo-link"
        >
          📸 Photos
        </a>
        <a
          href={navigateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
          data-testid="navigate-link"
        >
          🗺️ Navigate →
        </a>
      </div>
    </div>
  );
}
