# Application Components

## Component 1: ChatUI
**Purpose**: User-facing chat interface
**Responsibilities**:
- Render message history (user + AI messages)
- Capture user input and send to backend
- Display location cards with rich formatting
- Render quick-action suggestion buttons
- Show loading/error states

## Component 2: MapView
**Purpose**: Embedded Google Maps display
**Responsibilities**:
- Render map with location pins
- Auto-zoom to fit displayed spots
- Show info windows on pin tap
- Generate and display multi-stop route links

## Component 3: ChatOrchestrator (API Route)
**Purpose**: Backend service coordinating chat flow
**Responsibilities**:
- Receive user messages from ChatUI
- Build LLM prompt with system context + Master List data
- Call Claude API and parse response
- Detect intent (recommend, plan itinerary, add/remove spot)
- Route to appropriate handler (Recommender, Planner, ListManager)
- Return formatted response to frontend

## Component 4: Recommender
**Purpose**: Location recommendation logic
**Responsibilities**:
- Filter Master List by neighborhood, category, or both
- Rank results by rating
- Generate external fallback recommendations (3 picks) when no list matches
- Format location cards with all required fields

## Component 5: ItineraryPlanner
**Purpose**: Day/multi-day itinerary generation
**Responsibilities**:
- Group spots by neighborhood proximity
- Order stops to minimize transit time
- Split into morning/afternoon if >10 stops
- Respect opening hours constraints
- Generate per-day Google Maps route links

## Component 6: ListManager
**Purpose**: CRUD operations on Master List via Airtable
**Responsibilities**:
- Add new spots (validate required fields, detect duplicates)
- Update existing spots
- Remove spots (with confirmation)
- Sync changes to Airtable immediately

## Component 7: AirtableAdapter
**Purpose**: Data access layer for Airtable API
**Responsibilities**:
- Fetch all records (with caching)
- Create/update/delete records
- Handle rate limiting (5 req/sec)
- Transform Airtable records to app domain model

## Component 8: MapsService
**Purpose**: Google Maps API integration
**Responsibilities**:
- Generate navigation links (single + multi-stop)
- Provide embed URLs for MapView component
- Calculate walk times between spots (if needed beyond static data)
