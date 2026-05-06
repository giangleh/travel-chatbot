# Requirements Document — Travel Guide Chatbot ("Conan")

## Intent Analysis

| Field | Value |
|-------|-------|
| **User Request** | Build a chatbot that acts as a travel guide based on a curated list of spots and preferences |
| **Request Type** | New Project (Greenfield) |
| **Scope Estimate** | Multiple Components (frontend, backend API, data layer, LLM integration) |
| **Complexity Estimate** | Moderate — well-defined domain, multiple integrations |

---

## Functional Requirements

### FR-1: Conversational Travel Guide
- Chat interface powered by Anthropic Claude
- Persona: Expert Tokyo travel agent (active from first message)
- Responds to natural language queries about spots, neighborhoods, and itineraries

### FR-2: Master List Management
- Data stored in Airtable (101+ locations, 17 neighborhoods, 6 categories)
- Fields per entry: Name, Category, Hours, Rating, What to Try, Station, Walk Time, Neighborhood
- Categories: Bakery, Coffee, Camera, Eyewear, Jewelry, Sight

### FR-3: Real-Time List Editing via Chat
- Users can add spots conversationally ("add this to my list", "save this spot")
- Required fields prompted if missing: Name, Neighborhood, Category, Hours, Rating, What to Try
- Confirmation card shown before saving
- Duplicate detection with option to update existing entry
- Changes synced to Airtable immediately

### FR-4: Itinerary Planning
- Generate day plans based on user needs and proximity
- Group geographically proximate spots per day
- Optimize route order for transit efficiency
- Split into morning/afternoon if >10 stops
- Ask for trip duration if not provided

### FR-5: Proximity-Based Recommendations
- "I'm in [neighborhood]" triggers nearby recommendations
- Return ALL matching Master List entries first
- Fallback: exactly 3 external picks (highest rated) with same format

### FR-6: Google Maps Integration
- Embedded maps with real-time directions
- Multi-stop route links at top of multi-location responses
- Navigate links per location card
- Walk time from nearest station displayed

### FR-7: Location Card Format
- Name · Neighborhood · Category
- Rating · Hours · Walk time from station
- Place summary / what to try
- Photo link + Navigation link
- "On Master List" badge for list items

### FR-8: Multi-Platform Support
- Web app (primary, browser-based)
- Mobile app (future phase, React Native)
- Responsive design for mobile web as interim solution

### FR-9: Public-Facing Access
- Shared with external users
- Each user can have their own curated list
- No authentication required for browsing; auth required for list editing

---

## Non-Functional Requirements

### NFR-1: Performance
- Chat responses within 3 seconds (LLM latency acceptable)
- Map rendering within 1 second
- Airtable reads cached for fast repeated queries

### NFR-2: Security
- API keys (Airtable, Google Maps, Anthropic) never exposed client-side
- All API calls routed through serverless backend
- Input sanitization for LLM prompt injection prevention
- Rate limiting on public endpoints
- HTTPS everywhere

### NFR-3: Scalability
- Serverless architecture (scales to zero, handles traffic spikes)
- Airtable rate limits respected (5 requests/second)
- LLM API usage monitored and capped

### NFR-4: Deployment
- Vercel for web frontend + serverless API routes
- Zero-config CI/CD from Git repository
- Environment variables for all secrets

### NFR-5: Usability
- Mobile-first responsive design
- Chat interface intuitive (no onboarding needed)
- Map interactions smooth and familiar

### NFR-6: Reliability
- Graceful degradation if LLM unavailable (show list data without AI)
- Airtable connection retry logic
- Error messages user-friendly

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM Provider | Anthropic Claude | User preference |
| Data Store | Airtable | Easy editing, API access, no DB management |
| Frontend | Next.js (React) | SSR, API routes, Vercel-native |
| Deployment | Vercel | Free tier, serverless, CI/CD |
| Maps | Google Maps API | Embedded maps + directions |
| Mobile | React Native (Phase 2) | Code sharing with web |

---

## Out of Scope (Phase 1)
- Native mobile app (deferred to Phase 2)
- Offline support
- Multi-city support (Tokyo only for now)
- User accounts / authentication system (simplified for Phase 1)
- Payment processing
