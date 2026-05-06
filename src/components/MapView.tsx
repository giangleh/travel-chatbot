"use client";

import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { Spot } from "@/types";

// Approximate coordinates for Tokyo neighborhoods
const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  Ginza: { lat: 35.6717, lng: 139.7649 },
  Shinjuku: { lat: 35.6938, lng: 139.7034 },
  Shibuya: { lat: 35.6580, lng: 139.7016 },
  Daikanyama: { lat: 35.6487, lng: 139.7030 },
  Nakameguro: { lat: 35.6441, lng: 139.6986 },
  Meguro: { lat: 35.6340, lng: 139.7158 },
  Harajuku: { lat: 35.6702, lng: 139.7027 },
  Omotesando: { lat: 35.6654, lng: 139.7122 },
  Aoyama: { lat: 35.6654, lng: 139.7197 },
  Nakano: { lat: 35.7074, lng: 139.6659 },
  Asakusa: { lat: 35.7148, lng: 139.7967 },
  Yanaka: { lat: 35.7265, lng: 139.7677 },
  Ueno: { lat: 35.7141, lng: 139.7774 },
  Shimokitazawa: { lat: 35.6613, lng: 139.6680 },
  Setagaya: { lat: 35.6464, lng: 139.6532 },
  Kichijoji: { lat: 35.7032, lng: 139.5795 },
  Gotokuji: { lat: 35.6530, lng: 139.6380 },
};

function getSpotCoords(spot: Spot): { lat: number; lng: number } {
  const base = NEIGHBORHOOD_COORDS[spot.neighborhood] || { lat: 35.6762, lng: 139.6503 };
  // Offset slightly so pins don't overlap
  const offset = (spot.name.length % 10) * 0.001;
  return { lat: base.lat + offset, lng: base.lng + offset };
}

export function MapView({ spots }: { spots: Spot[] }) {
  const [selected, setSelected] = useState<Spot | null>(null);
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-4">
        Map unavailable — configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  const center = spots.length > 0
    ? getSpotCoords(spots[0])
    : { lat: 35.6762, lng: 139.6503 };

  return (
    <div className="h-full min-h-[256px]" data-testid="map-view">
      <APIProvider apiKey={apiKey}>
        <Map defaultCenter={center} defaultZoom={13} mapId={mapId} className="w-full h-full">
          {spots.map((spot) => {
            const pos = getSpotCoords(spot);
            return (
              <AdvancedMarker
                key={spot.id || spot.name}
                position={pos}
                onClick={() => setSelected(spot)}
              />
            );
          })}
          {selected && (
            <InfoWindow
              position={getSpotCoords(selected)}
              onCloseClick={() => setSelected(null)}
            >
              <div className="text-xs">
                <p className="font-semibold">{selected.name}</p>
                <p>{selected.category} · ⭐ {selected.rating}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
