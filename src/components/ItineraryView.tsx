"use client";

import type { DayPlan } from "@/types";
import { LocationCard } from "./LocationCard";
import { getNavigateUrl, getPhotoSearchUrl } from "@/lib/maps";

export function ItineraryView({ plan }: { plan: DayPlan }) {
  return (
    <div className="space-y-3" data-testid="itinerary-view">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Day {plan.dayNumber}</h3>
        <a
          href={plan.routeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
          data-testid="route-link"
        >
          🗺️ Open full route →
        </a>
      </div>

      <p className="text-xs text-gray-500">
        {plan.neighborhoods.join(" → ")} · ~{plan.estimatedHours}h
      </p>

      {plan.morning.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Morning</p>
          <div className="space-y-2">
            {plan.morning.map((spot) => (
              <LocationCard
                key={spot.id || spot.name}
                spot={spot}
                isOnMasterList={true}
                navigateUrl={getNavigateUrl(spot)}
                photoSearchUrl={getPhotoSearchUrl(spot)}
              />
            ))}
          </div>
        </div>
      )}

      {plan.afternoon.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Afternoon</p>
          <div className="space-y-2">
            {plan.afternoon.map((spot) => (
              <LocationCard
                key={spot.id || spot.name}
                spot={spot}
                isOnMasterList={true}
                navigateUrl={getNavigateUrl(spot)}
                photoSearchUrl={getPhotoSearchUrl(spot)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
