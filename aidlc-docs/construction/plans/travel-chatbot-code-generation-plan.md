# Code Generation Plan — travel-chatbot

## Unit Context
- **Unit**: travel-chatbot (single unit — full Next.js app)
- **Workspace Root**: /Users/giangleh/travel-chatbot
- **Stories Covered**: US-1.1, US-1.2, US-2.1, US-2.2, US-2.3, US-3.1, US-3.2, US-3.3, US-4.1, US-4.2, US-5.1, US-5.2, US-6.1, US-6.2
- **Tech Stack**: Next.js 14, TypeScript, Tailwind, Vercel AI SDK, fast-check, Vitest

## Code Generation Steps

### Step 1: Project Scaffolding
- [ ] Initialize Next.js 14 project with TypeScript and Tailwind
- [ ] Create package.json with all dependencies
- [ ] Create tsconfig.json, tailwind.config.ts, next.config.ts
- [ ] Create .env.local.example (template for API keys)
- [ ] Create .gitignore

### Step 2: Domain Types
- [ ] Create `src/types/index.ts` — Spot, Message, LocationCard, DayPlan, MultiDayPlan, Intent, MapData

### Step 3: Airtable Adapter (Data Layer)
- [ ] Create `src/lib/airtable.ts` — fetchAll (cached), create, update, delete, invalidateCache
- [ ] Implements: BR-10 (rate limiting), PERF-2 (caching), REL-2 (retry)

### Step 4: Recommender (Business Logic)
- [ ] Create `src/lib/recommender.ts` — recommend, rankByRating, formatCards
- [ ] Implements: BR-1 (priority), BR-2 (badge), US-2.1, US-2.2, US-2.3

### Step 5: Itinerary Planner (Business Logic)
- [ ] Create `src/lib/planner.ts` — planDay, planMultiDay, groupByProximity, optimizeRoute
- [ ] Implements: BR-3, BR-4, BR-5, BR-6, US-3.1, US-3.2, US-3.3

### Step 6: List Manager (Business Logic)
- [ ] Create `src/lib/list-manager.ts` — addSpot, updateSpot, removeSpot, detectDuplicate
- [ ] Implements: BR-7, BR-8, BR-9, US-5.1, US-5.2

### Step 7: Maps Service
- [ ] Create `src/lib/maps.ts` — getNavigateUrl, getMultiStopUrl, getEmbedUrl
- [ ] Implements: BR-13, US-4.1, US-4.2

### Step 8: Rate Limiting Middleware
- [ ] Create `src/lib/rate-limit.ts` — sliding window rate limiter
- [ ] Implements: SEC-3

### Step 9: Claude Integration
- [ ] Create `src/lib/claude.ts` — buildSystemPrompt, streamChat
- [ ] Implements: SEC-1, SEC-2, PERF-1 (streaming), US-1.1, US-1.2

### Step 10: API Route — Chat
- [ ] Create `src/app/api/chat/route.ts` — POST handler with streaming
- [ ] Implements: SEC-1, SEC-3, PERF-1, REL-1

### Step 11: API Route — Spots
- [ ] Create `src/app/api/spots/route.ts` — GET, POST, PUT, DELETE
- [ ] Implements: SEC-3, SEC-5

### Step 12: API Route — Maps Proxy
- [ ] Create `src/app/api/maps/route.ts` — GET proxy for Maps API
- [ ] Implements: SEC-1

### Step 13: Frontend — Layout & Page Shell
- [ ] Create `src/app/layout.tsx` — root layout with metadata
- [ ] Create `src/app/page.tsx` — ChatPage with state management
- [ ] Implements: US-6.1

### Step 14: Frontend — Chat Components
- [ ] Create `src/components/ChatMessages.tsx`
- [ ] Create `src/components/ChatInput.tsx`
- [ ] Create `src/components/LocationCard.tsx`
- [ ] Create `src/components/ItineraryView.tsx`
- [ ] Create `src/components/QuickActions.tsx`
- [ ] Implements: US-1.1, US-2.3, US-3.1, US-6.2

### Step 15: Frontend — Map Component
- [ ] Create `src/components/MapView.tsx` — dynamic import, pins, info windows
- [ ] Implements: US-4.1, US-4.2, PERF-4

### Step 16: Unit Tests — Business Logic
- [ ] Create `tests/unit/recommender.test.ts`
- [ ] Create `tests/unit/planner.test.ts`
- [ ] Create `tests/unit/list-manager.test.ts`

### Step 17: Property-Based Tests
- [ ] Create `tests/unit/planner.property.test.ts` — clustering and routing properties
- [ ] Create `tests/unit/recommender.property.test.ts` — filtering properties
- [ ] Implements: TEST-1

### Step 18: Integration Tests
- [ ] Create `tests/integration/chat.test.ts` — mocked Claude, test API route
- [ ] Create `tests/integration/spots.test.ts` — mocked Airtable, test CRUD
- [ ] Implements: TEST-2

### Step 19: Configuration & Deployment
- [ ] Create `vitest.config.ts`
- [ ] Create README.md with setup instructions
- [ ] Verify all files in correct locations

---

## Summary
- **19 steps** total
- **~25 files** to generate
- Covers all 14 user stories + all NFR requirements
- Tests: unit + property-based + integration
