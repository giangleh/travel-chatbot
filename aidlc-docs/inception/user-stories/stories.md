# User Stories

Organized by feature area. Each story includes detailed acceptance criteria with edge cases.

---

## Feature Area 1: Chat Interface

### US-1.1: Basic Conversation
**As a** traveler, **I want to** ask natural language questions about Tokyo spots **so that** I get relevant recommendations without learning a specific syntax.

**Acceptance Criteria:**
1. Given I type a message, When I send it, Then I receive a response within 3 seconds
2. Given I ask "where should I get coffee?", When the AI responds, Then it returns Master List coffee spots with full card format (name, neighborhood, rating, hours, walk time, what to try)
3. Given I ask a vague question like "what's good?", When the AI responds, Then it asks a clarifying follow-up (neighborhood? category? time available?)
4. Given I ask something unrelated to travel ("what's 2+2?"), When the AI responds, Then it politely redirects to travel topics while still being helpful
5. Given the LLM API is unavailable, When I send a message, Then I see a friendly error with option to browse the list directly

### US-1.2: Conversation Context
**As a** traveler, **I want** the chatbot to remember what we discussed earlier in the session **so that** I don't have to repeat myself.

**Acceptance Criteria:**
1. Given I said "I'm in Shibuya", When I later ask "any bakeries?", Then it returns Shibuya bakeries without me re-stating the neighborhood
2. Given I said "I don't like sweet things", When recommendations are made, Then bakery suggestions emphasize savory options (e.g., curry bread over pastries)
3. Given a new browser session, When I start chatting, Then conversation history from previous sessions is not retained (stateless between sessions)
4. Given a long conversation (>20 messages), When I ask a new question, Then the AI still has context from earlier in the session

---

## Feature Area 2: Recommendations & Discovery

### US-2.1: Neighborhood-Based Recommendations
**As a** traveler, **I want to** ask "what's near me" or "what's in [neighborhood]" **so that** I discover spots within walking distance.

**Acceptance Criteria:**
1. Given I say "I'm in Daikanyama", When the AI responds, Then ALL Daikanyama Master List entries are returned (7 spots)
2. Given a neighborhood with no Master List entries, When I ask about it, Then the AI provides 3 external recommendations in the same card format (no badge)
3. Given I specify a category ("coffee in Nakameguro"), When the AI responds, Then only coffee spots in Nakameguro are returned
4. Given multiple spots are returned, When displayed, Then they are ordered by rating (highest first)
5. Given results are shown, When I view them, Then each card includes a Navigate link to Google Maps

### US-2.2: Category-Based Filtering
**As a** traveler, **I want to** filter spots by category **so that** I find exactly what I'm looking for.

**Acceptance Criteria:**
1. Given I ask "show me all eyewear shops", When the AI responds, Then all Eyewear category entries across all neighborhoods are returned
2. Given I ask "camera shops near Shinjuku", When the AI responds, Then it returns Shinjuku camera shops first, then nearby neighborhoods (Nakano)
3. Given a category with no results in the specified area, When the AI responds, Then it suggests the nearest neighborhood that has that category
4. Given I use informal language ("where to get glasses"), When the AI responds, Then it correctly maps to the Eyewear category

### US-2.3: Master List Badge
**As a** traveler, **I want to** clearly see which spots are on the curated list vs. external suggestions **so that** I know which are personally vetted.

**Acceptance Criteria:**
1. Given a spot is on the Master List, When displayed, Then it shows "This is on Giang's Master List." badge
2. Given a spot is an external recommendation, When displayed, Then no badge is shown
3. Given a mixed response (list + external), When displayed, Then Master List items appear first, followed by external picks

---

## Feature Area 3: Itinerary Planning

### US-3.1: Day Plan Generation
**As a** planner, **I want to** ask "plan my day in [area]" **so that** I get an optimized route through nearby spots.

**Acceptance Criteria:**
1. Given I ask "plan my day in Shibuya/Daikanyama", When the AI responds, Then it groups spots by proximity and orders them for minimal transit time
2. Given >10 spots in the plan, When the AI responds, Then it splits into morning and afternoon sections
3. Given a day plan is generated, When displayed, Then a multi-stop Google Maps route link appears at the top
4. Given I don't specify duration, When the AI responds, Then it asks how many hours I have available
5. Given spots have opening hours, When planning, Then the AI respects hours (no suggesting a 9AM spot that opens at 11AM)

### US-3.2: Multi-Day Itinerary
**As a** planner, **I want to** say "I have 5 days in Tokyo" **so that** I get a full trip plan grouped by neighborhood proximity.

**Acceptance Criteria:**
1. Given I specify trip duration, When the AI responds, Then it distributes neighborhoods across days to minimize cross-city transit
2. Given adjacent neighborhoods (Shibuya → Daikanyama → Nakameguro), When planning, Then they are grouped on the same day
3. Given a multi-day plan, When displayed, Then each day has its own route link
4. Given I have preferences ("no mornings before 10"), When planning, Then the AI respects time constraints
5. Given the plan is generated, When I ask to modify ("swap day 2 and 3"), Then the AI adjusts accordingly

### US-3.3: Transit Optimization
**As a** traveler, **I want** routes optimized for minimal travel time **so that** I spend more time at spots and less time commuting.

**Acceptance Criteria:**
1. Given multiple spots in one neighborhood, When routing, Then walking order minimizes backtracking
2. Given spots across neighborhoods, When routing, Then the order follows logical train line connections
3. Given a route is generated, When displayed, Then walk time between consecutive stops is shown
4. Given I'm at a specific spot, When I ask "what's next?", Then the nearest unvisited spot is suggested

---

## Feature Area 4: Google Maps Integration

### US-4.1: Embedded Map Display
**As a** traveler, **I want to** see spots on an embedded map **so that** I can visually understand where things are.

**Acceptance Criteria:**
1. Given recommendations are shown, When I view the response, Then an embedded map displays pins for all recommended spots
2. Given I tap a pin, When the info window opens, Then it shows the spot name, category, and rating
3. Given multiple neighborhoods are shown, When viewing the map, Then the map auto-zooms to fit all pins
4. Given I'm on mobile, When viewing the map, Then it's touch-friendly and responsive

### US-4.2: Navigation Links
**As a** traveler, **I want** one-tap navigation to any spot **so that** I can immediately start walking there.

**Acceptance Criteria:**
1. Given a spot card is displayed, When I tap "Navigate →", Then Google Maps opens with walking directions from my current location
2. Given a multi-stop route link, When I tap it, Then Google Maps opens with all stops in order
3. Given I'm on mobile, When I tap navigate, Then it opens in the Google Maps app (not browser)
4. Given I'm on desktop, When I click navigate, Then it opens Google Maps in a new tab

---

## Feature Area 5: List Management

### US-5.1: Add Spot via Chat
**As a** curator, **I want to** say "add this spot to my list" **so that** I can save new discoveries without leaving the chat.

**Acceptance Criteria:**
1. Given I say "add Cafe XYZ to my list", When the AI processes it, Then it prompts for missing required fields (Category, Hours, Rating, What to Try, Neighborhood, Station, Walk Time)
2. Given all fields are provided, When confirming, Then a preview card is shown for approval before saving
3. Given I confirm, When saved, Then the spot is immediately written to Airtable
4. Given the spot already exists, When I try to add it, Then the AI offers to update the existing entry instead
5. Given I provide partial info ("add that coffee place we just visited"), When the AI processes it, Then it asks for the specific name and details

### US-5.2: Remove/Update Spot via Chat
**As a** curator, **I want to** update or remove spots conversationally **so that** I keep the list accurate.

**Acceptance Criteria:**
1. Given I say "remove Cafe XYZ from the list", When confirmed, Then the entry is deleted from Airtable
2. Given I say "update hours for Turret Coffee to 8:00-17:00", When confirmed, Then the Airtable record is updated
3. Given I reference a spot ambiguously ("update that coffee place in Ginza"), When the AI processes it, Then it asks which specific spot (lists Ginza coffee options)
4. Given a destructive action (remove), When processing, Then the AI always asks for explicit confirmation before executing

---

## Feature Area 6: UI/UX

### US-6.1: Mobile-First Responsive Design
**As a** traveler, **I want** the app to work perfectly on my phone **so that** I can use it while walking around Tokyo.

**Acceptance Criteria:**
1. Given I open the app on mobile, When viewing, Then the chat interface fills the screen with easy thumb-reach input
2. Given a map is displayed on mobile, When interacting, Then pinch-to-zoom and pan work smoothly
3. Given a long response with multiple cards, When scrolling, Then performance remains smooth (no jank)
4. Given I'm on desktop, When viewing, Then the layout adapts to use available space (wider cards, side-by-side map)

### US-6.2: Quick Actions
**As a** traveler, **I want** suggested quick-action buttons **so that** I can get common answers with one tap.

**Acceptance Criteria:**
1. Given I open the app, When the chat loads, Then I see suggested prompts ("Plan my day", "Coffee nearby", "What's in Shibuya?")
2. Given the AI detects my context (e.g., mentioned a neighborhood), When responding, Then relevant follow-up buttons appear ("Show on map", "More in this area", "Plan a route")
3. Given I tap a quick action, When processed, Then it behaves identically to typing the same message

---

## Story-Persona Mapping

| Story | Traveler (Alex) | Planner (Sam) | Curator (Giang) |
|-------|:-:|:-:|:-:|
| US-1.1 Basic Conversation | ✅ | ✅ | ✅ |
| US-1.2 Conversation Context | ✅ | ✅ | ✅ |
| US-2.1 Neighborhood Recs | ✅ | ✅ | |
| US-2.2 Category Filtering | ✅ | ✅ | |
| US-2.3 Master List Badge | ✅ | ✅ | ✅ |
| US-3.1 Day Plan | ✅ | ✅ | |
| US-3.2 Multi-Day Itinerary | | ✅ | |
| US-3.3 Transit Optimization | ✅ | ✅ | |
| US-4.1 Embedded Map | ✅ | ✅ | |
| US-4.2 Navigation Links | ✅ | | |
| US-5.1 Add Spot | | | ✅ |
| US-5.2 Remove/Update Spot | | | ✅ |
| US-6.1 Mobile-First | ✅ | | |
| US-6.2 Quick Actions | ✅ | ✅ | |
