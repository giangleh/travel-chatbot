# Services

## Service 1: Chat API Service (/api/chat)
**Type**: Next.js API Route (serverless function)
**Orchestration Pattern**: Request → Intent Detection → Handler Dispatch → Response

**Flow**:
1. Receive POST with `{message, history}`
2. Fetch Master List from AirtableAdapter (cached)
3. Build Claude system prompt with list context
4. Call Claude API with user message + history
5. Parse Claude response for structured actions (recommend, plan, add/remove)
6. If action detected → execute via Recommender/Planner/ListManager
7. Return formatted response with location cards + map data

## Service 2: List API Service (/api/spots)
**Type**: Next.js API Route (serverless function)
**Orchestration Pattern**: REST CRUD

**Endpoints**:
- `GET /api/spots` — fetch all spots (cached)
- `POST /api/spots` — add new spot
- `PUT /api/spots/:id` — update spot
- `DELETE /api/spots/:id` — remove spot

## Service 3: Maps API Service (/api/maps)
**Type**: Next.js API Route (serverless function)
**Purpose**: Proxy Google Maps API calls to protect API key

**Endpoints**:
- `GET /api/maps/embed?spots=...` — return embed configuration
- `GET /api/maps/directions?from=...&to=...` — proxy directions request
