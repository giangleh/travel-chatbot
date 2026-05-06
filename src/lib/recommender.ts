import type { Spot, LocationCard } from "@/types";
import { getNavigateUrl, getPhotoSearchUrl } from "./maps";

export function recommend(
  spots: Spot[],
  filters: { neighborhood?: string; category?: string }
): Spot[] {
  let results = spots;
  if (filters.neighborhood) {
    results = results.filter(
      (s) => s.neighborhood.toLowerCase() === filters.neighborhood!.toLowerCase()
    );
  }
  if (filters.category) {
    results = results.filter(
      (s) => s.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }
  return rankByRating(results);
}

export function rankByRating(spots: Spot[]): Spot[] {
  return [...spots].sort((a, b) => b.rating - a.rating);
}

export function formatCards(spots: Spot[], masterListIds: Set<string>): LocationCard[] {
  return spots.map((spot) => ({
    spot,
    isOnMasterList: masterListIds.has(spot.id),
    navigateUrl: getNavigateUrl(spot),
    photoSearchUrl: getPhotoSearchUrl(spot),
  }));
}
