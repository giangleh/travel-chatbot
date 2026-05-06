import type { Spot } from "@/types";
import { fetchAllSpots, createSpot, updateSpot as updateRecord, deleteSpot } from "./airtable";

const REQUIRED_FIELDS: (keyof Omit<Spot, "id">)[] = [
  "name", "neighborhood", "category", "hours", "rating", "whatToTry", "station", "walkTime",
];

export function getMissingFields(partial: Partial<Spot>): string[] {
  return REQUIRED_FIELDS.filter((f) => !partial[f]);
}

export async function detectDuplicate(name: string): Promise<Spot | null> {
  const spots = await fetchAllSpots();
  return spots.find((s) => s.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function addSpot(
  input: Partial<Spot>
): Promise<{ type: "missing"; fields: string[] } | { type: "duplicate"; existing: Spot } | { type: "ready"; spot: Omit<Spot, "id"> }> {
  const missing = getMissingFields(input);
  if (missing.length > 0) return { type: "missing", fields: missing };

  const duplicate = await detectDuplicate(input.name!);
  if (duplicate) return { type: "duplicate", existing: duplicate };

  return { type: "ready", spot: input as Omit<Spot, "id"> };
}

export async function confirmAdd(spot: Omit<Spot, "id">): Promise<Spot> {
  return createSpot(spot);
}

export async function modifySpot(name: string, fields: Partial<Spot>): Promise<Spot | null> {
  const spots = await fetchAllSpots();
  const match = spots.find((s) => s.name.toLowerCase() === name.toLowerCase());
  if (!match) return null;
  return updateRecord(match.id, fields);
}

export async function removeSpot(name: string): Promise<Spot | null> {
  const spots = await fetchAllSpots();
  const match = spots.find((s) => s.name.toLowerCase() === name.toLowerCase());
  if (!match) return null;
  await deleteSpot(match.id);
  return match;
}
