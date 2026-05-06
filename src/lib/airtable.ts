import Airtable from "airtable";
import type { Spot, Category } from "@/types";

function getTable() {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  return base(process.env.AIRTABLE_TABLE_NAME || "Master List");
}

let cache: { data: Spot[]; timestamp: number } | null = null;
const TTL = 60_000;

function mapRecord(record: Airtable.Record<Airtable.FieldSet>): Spot {
  return {
    id: record.id,
    name: (record.get("Name") as string) || "",
    neighborhood: (record.get("Neighborhood") as string) || "",
    category: (record.get("Category") as Category) || "Sight",
    hours: (record.get("Hours") as string) || "",
    rating: (record.get("Rating") as number) || 0,
    whatToTry: (record.get("What to Try") as string) || "",
    station: (record.get("Station") as string) || "",
    walkTime: (record.get("Walk Time") as number) || 0,
  };
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Unreachable");
}

export async function fetchAllSpots(): Promise<Spot[]> {
  if (cache && Date.now() - cache.timestamp < TTL) {
    return cache.data;
  }
  const records = await withRetry(() => getTable().select().all());
  const data = records.map(mapRecord);
  cache = { data, timestamp: Date.now() };
  return data;
}

export async function createSpot(spot: Omit<Spot, "id">): Promise<Spot> {
  const record = await withRetry(() =>
    getTable().create({
      Name: spot.name,
      Neighborhood: spot.neighborhood,
      Category: spot.category,
      Hours: spot.hours,
      Rating: spot.rating,
      "What to Try": spot.whatToTry,
      Station: spot.station,
      "Walk Time": spot.walkTime,
    })
  );
  invalidateCache();
  return mapRecord(record);
}

export async function updateSpot(id: string, fields: Partial<Spot>): Promise<Spot> {
  const airtableFields: Partial<Airtable.FieldSet> = {};
  if (fields.name) airtableFields["Name"] = fields.name;
  if (fields.neighborhood) airtableFields["Neighborhood"] = fields.neighborhood;
  if (fields.category) airtableFields["Category"] = fields.category;
  if (fields.hours) airtableFields["Hours"] = fields.hours;
  if (fields.rating) airtableFields["Rating"] = fields.rating;
  if (fields.whatToTry) airtableFields["What to Try"] = fields.whatToTry;
  if (fields.station) airtableFields["Station"] = fields.station;
  if (fields.walkTime) airtableFields["Walk Time"] = fields.walkTime;

  const record = await withRetry(() => getTable().update(id, airtableFields));
  invalidateCache();
  return mapRecord(record);
}

export async function deleteSpot(id: string): Promise<void> {
  await withRetry(() => getTable().destroy(id));
  invalidateCache();
}

export function invalidateCache(): void {
  cache = null;
}
