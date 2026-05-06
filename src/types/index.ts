export type Category = "Bakery" | "Coffee" | "Camera" | "Eyewear" | "Jewelry" | "Sight";

export interface Spot {
  id: string;
  name: string;
  neighborhood: string;
  category: Category;
  hours: string;
  rating: number;
  whatToTry: string;
  station: string;
  walkTime: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  locationCards?: LocationCard[];
  mapData?: MapData;
  quickActions?: string[];
}

export interface LocationCard {
  spot: Spot;
  isOnMasterList: boolean;
  navigateUrl: string;
  photoSearchUrl: string;
}

export interface DayPlan {
  dayNumber: number;
  neighborhoods: string[];
  morning: Spot[];
  afternoon: Spot[];
  routeUrl: string;
  estimatedHours: number;
}

export interface MultiDayPlan {
  totalDays: number;
  days: DayPlan[];
}

export type Intent =
  | { type: "recommend"; neighborhood?: string; category?: string }
  | { type: "plan_day"; neighborhoods: string[]; hours?: number }
  | { type: "plan_trip"; days: number; preferences?: string }
  | { type: "add_spot"; partialSpot: Partial<Spot> }
  | { type: "update_spot"; name: string; fields: Partial<Spot> }
  | { type: "remove_spot"; name: string }
  | { type: "general_chat" };

export interface MapData {
  pins: Array<{ spot: Spot; lat?: number; lng?: number }>;
  routeUrl?: string;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  text: string;
  locationCards?: LocationCard[];
  mapData?: MapData;
  quickActions?: string[];
}
