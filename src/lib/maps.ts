import type { Spot } from "@/types";

export function getNavigateUrl(spot: Spot): string {
  const destination = encodeURIComponent(`${spot.name} ${spot.neighborhood} Tokyo Japan`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
}

export function getPhotoSearchUrl(spot: Spot): string {
  const query = encodeURIComponent(`${spot.name} ${spot.neighborhood} Tokyo`);
  return `https://www.google.com/maps/search/${query}`;
}

export function getMultiStopUrl(spots: Spot[]): string {
  if (spots.length === 0) return "";
  const waypoints = spots.map((s) => encodeURIComponent(`${s.name} ${s.neighborhood} Tokyo`));
  return `https://www.google.com/maps/dir/${waypoints.join("/")}`;
}

export function getEmbedUrl(spots: Spot[]): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (spots.length === 1) {
    const q = encodeURIComponent(`${spots[0].name} ${spots[0].neighborhood} Tokyo`);
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`;
  }
  const origin = encodeURIComponent(`${spots[0].name} ${spots[0].neighborhood} Tokyo`);
  const dest = encodeURIComponent(`${spots[spots.length - 1].name} ${spots[spots.length - 1].neighborhood} Tokyo`);
  const waypoints = spots.slice(1, -1).map((s) => encodeURIComponent(`${s.name} ${s.neighborhood} Tokyo`)).join("|");
  return `https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${origin}&destination=${dest}&waypoints=${waypoints}&mode=walking`;
}
