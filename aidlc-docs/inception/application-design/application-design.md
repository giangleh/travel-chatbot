# Application Design — Travel Guide Chatbot

## Architecture Overview

Next.js full-stack app deployed on Vercel. Frontend (React) communicates with serverless API routes that orchestrate Claude, Airtable, and Google Maps.

```
+------------------+     +------------------------+     +----------------+
|    Frontend      |     |    API Routes (Vercel)  |     |  External APIs |
|                  |     |                        |     |                |
|  ChatUI ---------|---->| ChatOrchestrator ------|---->| Claude API     |
|  MapView --------|---->| Spots API             |---->| Airtable API   |
|  QuickActions    |     | Maps API (proxy)      |---->| Google Maps    |
+------------------+     +------------------------+     +----------------+
                                    |
                          +---------+---------+
                          |         |         |
                     Recommender Planner ListManager
                          |         |         |
                          +----+----+---------+
                               |
                        AirtableAdapter (cached)
```

## Components (8)
1. **ChatUI** — Chat interface (messages, cards, quick actions)
2. **MapView** — Embedded Google Maps with pins and routes
3. **ChatOrchestrator** — Intent detection + handler dispatch
4. **Recommender** — Filter/rank spots, generate fallbacks
5. **ItineraryPlanner** — Day/multi-day plans, route optimization
6. **ListManager** — CRUD with validation and duplicate detection
7. **AirtableAdapter** — Data access with caching and rate limiting
8. **MapsService** — URL generation for navigation and embeds

## API Surface
- `POST /api/chat` — Main chat endpoint
- `GET/POST/PUT/DELETE /api/spots` — List CRUD
- `GET /api/maps/*` — Maps proxy (protects API key)

## Key Design Decisions
- **Conversation state**: Client-side (passed per request, no server sessions)
- **Caching**: In-memory cache for Airtable data (invalidated on writes)
- **LLM integration**: Claude receives full Master List as system context
- **Maps**: API key proxied through backend, never exposed to client
- **Single unit**: No microservices — all in one Next.js app
