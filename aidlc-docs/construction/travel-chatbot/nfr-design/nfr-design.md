# NFR Design — travel-chatbot

## Security Patterns

### API Key Protection Pattern
```
Client (browser)
    |
    | POST /api/chat {message, history}  ← no keys in request
    v
Next.js API Route (server-side)
    |
    | Authorization: Bearer sk-ant-...   ← key from env var
    v
Claude API / Airtable API / Maps API
```
- All keys stored in Vercel Environment Variables
- `process.env.ANTHROPIC_API_KEY`, `process.env.AIRTABLE_API_KEY`, `process.env.GOOGLE_MAPS_API_KEY`
- Client bundle never imports or references these values

### Input Sanitization Middleware
```typescript
// middleware: validateChatInput
function validateChatInput(message: string): string {
  // 1. Trim and enforce max length (2000 chars)
  // 2. Strip control characters
  // 3. Log suspicious patterns (don't block — Claude handles gracefully)
  return sanitized;
}
```

### Rate Limiting Pattern
```typescript
// In-memory rate limiter per IP (resets on cold start — acceptable for serverless)
// Uses sliding window algorithm
// Applied as middleware on API routes

const rateLimits = {
  "/api/chat": { window: 60_000, max: 20 },
  "/api/spots:write": { window: 60_000, max: 10 },
  "/api/spots:read": { window: 60_000, max: 60 },
};
```

### CORS Configuration
```typescript
// next.config.js headers
headers: [
  { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE" },
]
```

---

## Performance Patterns

### Response Streaming
```typescript
// /api/chat uses streaming to show partial Claude responses
// Uses Vercel AI SDK streaming pattern
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

// Stream tokens to client as they arrive
// Frontend renders incrementally (typewriter effect)
```

### Airtable Cache Pattern
```typescript
// Simple in-memory cache with TTL
let cache: { data: Spot[]; timestamp: number } | null = null;
const TTL = 60_000; // 60 seconds

async function getSpots(): Promise<Spot[]> {
  if (cache && Date.now() - cache.timestamp < TTL) {
    return cache.data;
  }
  const data = await fetchFromAirtable();
  cache = { data, timestamp: Date.now() };
  return data;
}

function invalidateCache() {
  cache = null;
}
```

### Lazy Loading
```typescript
// MapView loaded dynamically (heavy Google Maps SDK)
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
```

---

## Reliability Patterns

### LLM Fallback
```typescript
async function handleChat(message, history) {
  try {
    return await callClaude(message, history); // timeout: 10s
  } catch (error) {
    return {
      text: "I'm having trouble connecting right now. You can still browse the list below!",
      fallbackMode: true,
      spots: await getSpots(), // serve from cache
    };
  }
}
```

### Airtable Retry with Backoff
```typescript
async function airtableRequest(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

---

## Testing Patterns

### Property-Based Tests (fast-check)
```typescript
// Example: itinerary clustering property
fc.assert(
  fc.property(fc.array(spotArbitrary, { minLength: 1 }), (spots) => {
    const plan = groupByProximity(spots);
    // Property: every input spot appears exactly once in output
    const allOutputSpots = plan.flatMap(g => g.spots);
    return allOutputSpots.length === spots.length;
  })
);
```

### Integration Test Pattern
```typescript
// Mock external APIs, test API route behavior
vi.mock("@anthropic-ai/sdk");
vi.mock("airtable");

test("POST /api/chat returns location cards", async () => {
  mockClaude.mockResolvedValue(/* structured response */);
  const res = await POST(mockRequest({ message: "coffee in Ginza" }));
  expect(res.locations).toHaveLength(2); // Turret + Glitch
});
```

---

## Project Structure (informed by NFR patterns)

```
travel-chatbot/
├── src/
│   ├── app/
│   │   ├── page.tsx              # ChatPage
│   │   ├── layout.tsx            # Root layout
│   │   └── api/
│   │       ├── chat/route.ts     # Chat endpoint (streaming)
│   │       ├── spots/route.ts    # CRUD endpoint
│   │       └── maps/route.ts     # Maps proxy
│   ├── components/
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   ├── LocationCard.tsx
│   │   ├── ItineraryView.tsx
│   │   ├── MapView.tsx
│   │   └── QuickActions.tsx
│   ├── lib/
│   │   ├── airtable.ts           # AirtableAdapter + cache
│   │   ├── claude.ts             # Claude integration
│   │   ├── maps.ts               # MapsService
│   │   ├── recommender.ts        # Recommendation logic
│   │   ├── planner.ts            # Itinerary planning
│   │   ├── list-manager.ts       # CRUD logic
│   │   └── rate-limit.ts         # Rate limiting middleware
│   └── types/
│       └── index.ts              # Domain entities
├── tests/
│   ├── unit/
│   │   ├── recommender.test.ts
│   │   ├── planner.test.ts
│   │   └── planner.property.test.ts  # PBT
│   └── integration/
│       ├── chat.test.ts
│       └── spots.test.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local                    # API keys (gitignored)
```
