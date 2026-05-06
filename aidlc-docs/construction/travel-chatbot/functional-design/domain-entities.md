# Domain Entities

## Spot
The core domain entity representing a curated location.

```typescript
interface Spot {
  id: string;              // Airtable record ID
  name: string;            // e.g. "Turret Coffee"
  neighborhood: string;    // e.g. "Ginza"
  category: Category;      // enum
  hours: string;           // e.g. "07:00-18:00"
  rating: number;          // 1.0 - 5.0
  whatToTry: string;       // e.g. "Turret Latte"
  station: string;         // nearest station name
  walkTime: number;        // minutes from station
}

type Category = "Bakery" | "Coffee" | "Camera" | "Eyewear" | "Jewelry" | "Sight";
```

## Message
A chat message in the conversation.

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
  locationCards?: LocationCard[];
  mapData?: MapData;
  quickActions?: string[];
}
```

## LocationCard
Formatted display of a Spot in chat responses.

```typescript
interface LocationCard {
  spot: Spot;
  isOnMasterList: boolean;
  navigateUrl: string;
  photoSearchUrl: string;
}
```

## DayPlan
A single day's itinerary.

```typescript
interface DayPlan {
  dayNumber: number;
  neighborhoods: string[];
  morning: Spot[];
  afternoon: Spot[];
  routeUrl: string;
  estimatedHours: number;
}
```

## MultiDayPlan
Full trip itinerary.

```typescript
interface MultiDayPlan {
  totalDays: number;
  days: DayPlan[];
}
```

## Intent
Detected user intent from chat message.

```typescript
type Intent =
  | { type: "recommend"; neighborhood?: string; category?: string }
  | { type: "plan_day"; neighborhoods: string[]; hours?: number }
  | { type: "plan_trip"; days: number; preferences?: string }
  | { type: "add_spot"; partialSpot: Partial<Spot> }
  | { type: "update_spot"; name: string; fields: Partial<Spot> }
  | { type: "remove_spot"; name: string }
  | { type: "general_chat"; message: string };
```

## MapData
Data passed to MapView for rendering.

```typescript
interface MapData {
  pins: Array<{ spot: Spot; lat: number; lng: number }>;
  routeUrl?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}
```
