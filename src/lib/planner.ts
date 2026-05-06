import type { Spot, DayPlan, MultiDayPlan } from "@/types";
import { getMultiStopUrl } from "./maps";

const ADJACENCY: Record<string, string[]> = {
  Shibuya: ["Daikanyama", "Harajuku"],
  Daikanyama: ["Shibuya", "Nakameguro"],
  Nakameguro: ["Daikanyama", "Meguro"],
  Meguro: ["Nakameguro"],
  Harajuku: ["Shibuya", "Omotesando"],
  Omotesando: ["Harajuku", "Aoyama"],
  Aoyama: ["Omotesando"],
  Shinjuku: ["Nakano"],
  Nakano: ["Shinjuku"],
  Asakusa: ["Yanaka", "Ueno"],
  Yanaka: ["Asakusa", "Ueno"],
  Ueno: ["Asakusa", "Yanaka"],
  Shimokitazawa: ["Setagaya"],
  Setagaya: ["Shimokitazawa"],
  Ginza: [],
  Kichijoji: [],
  Gotokuji: [],
};

export function groupByProximity(spots: Spot[]): Map<string, Spot[]> {
  const groups = new Map<string, Spot[]>();
  for (const spot of spots) {
    const existing = groups.get(spot.neighborhood) || [];
    existing.push(spot);
    groups.set(spot.neighborhood, existing);
  }
  return groups;
}

export function clusterNeighborhoods(neighborhoods: string[]): string[][] {
  const visited = new Set<string>();
  const clusters: string[][] = [];

  for (const n of neighborhoods) {
    if (visited.has(n)) continue;
    const cluster: string[] = [];
    const queue = [n];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      if (!neighborhoods.includes(current)) continue;
      visited.add(current);
      cluster.push(current);
      for (const adj of ADJACENCY[current] || []) {
        if (!visited.has(adj) && neighborhoods.includes(adj)) {
          queue.push(adj);
        }
      }
    }
    if (cluster.length > 0) clusters.push(cluster);
  }
  return clusters;
}

export function optimizeRoute(spots: Spot[]): Spot[] {
  if (spots.length <= 2) return spots;
  // Group by neighborhood, then sort within each group by walk time (nearest station first)
  const byNeighborhood = groupByProximity(spots);
  const ordered: Spot[] = [];
  for (const [, group] of byNeighborhood) {
    ordered.push(...group.sort((a, b) => a.walkTime - b.walkTime));
  }
  return ordered;
}

function parseOpenHour(hours: string): number {
  const match = hours.match(/^(\d{2}):(\d{2})/);
  return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
}

export function splitMorningAfternoon(spots: Spot[]): { morning: Spot[]; afternoon: Spot[] } {
  const sorted = [...spots].sort((a, b) => parseOpenHour(a.hours) - parseOpenHour(b.hours));
  const mid = Math.ceil(sorted.length / 2);
  return { morning: sorted.slice(0, mid), afternoon: sorted.slice(mid) };
}

export function planDay(spots: Spot[], hours?: number): DayPlan {
  const optimized = optimizeRoute(spots);
  const neighborhoods = [...new Set(optimized.map((s) => s.neighborhood))];

  if (optimized.length > 10) {
    const { morning, afternoon } = splitMorningAfternoon(optimized);
    return {
      dayNumber: 1,
      neighborhoods,
      morning,
      afternoon,
      routeUrl: getMultiStopUrl(optimized),
      estimatedHours: hours || Math.ceil(optimized.length * 0.75),
    };
  }

  return {
    dayNumber: 1,
    neighborhoods,
    morning: optimized,
    afternoon: [],
    routeUrl: getMultiStopUrl(optimized),
    estimatedHours: hours || Math.ceil(optimized.length * 0.75),
  };
}

export function planMultiDay(spots: Spot[], days: number): MultiDayPlan {
  const neighborhoods = [...new Set(spots.map((s) => s.neighborhood))];
  const clusters = clusterNeighborhoods(neighborhoods);

  // Distribute clusters across days
  const daysPlans: DayPlan[] = [];
  const spotsPerDay = Math.ceil(spots.length / days);

  let dayNum = 1;
  let currentDaySpots: Spot[] = [];

  for (const cluster of clusters) {
    const clusterSpots = spots.filter((s) => cluster.includes(s.neighborhood));
    if (currentDaySpots.length + clusterSpots.length > spotsPerDay && currentDaySpots.length > 0) {
      daysPlans.push({ ...planDay(currentDaySpots), dayNumber: dayNum });
      dayNum++;
      currentDaySpots = [];
    }
    currentDaySpots.push(...clusterSpots);
  }

  if (currentDaySpots.length > 0) {
    daysPlans.push({ ...planDay(currentDaySpots), dayNumber: dayNum });
  }

  return { totalDays: daysPlans.length, days: daysPlans };
}
