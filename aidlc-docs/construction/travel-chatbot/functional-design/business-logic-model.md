# Business Logic Model

## 1. Chat Orchestration Flow

```
User Message
    |
    v
[Build Claude Prompt]
  - System: persona + rules + full Master List as context
  - History: last N messages
  - User: current message
    |
    v
[Claude Response] → parse for structured output
    |
    +--→ Contains recommendations? → format as LocationCards
    +--→ Contains itinerary? → format as DayPlan with route
    +--→ Contains add/update/remove? → execute ListManager action
    +--→ General conversation? → return text response
    |
    v
[Attach MapData if locations present]
    |
    v
[Attach QuickActions based on context]
    |
    v
Response to Frontend
```

## 2. Recommendation Algorithm

```
Input: {neighborhood?, category?, freeText?}

1. Filter Master List:
   - If neighborhood specified → filter by neighborhood
   - If category specified → filter by category
   - If both → intersection

2. Sort: rating DESC

3. If results.length > 0:
   - Return all matches with Master List badge
   - Attach route link if 2+ results

4. If results.length === 0:
   - Claude generates 3 external picks (highest rated from knowledge)
   - Format identically but without badge
   - Note: "These are not on your Master List"
```

## 3. Itinerary Planning Algorithm

```
Input: {days: number, preferences?: string}

1. Get all Master List spots
2. Group by neighborhood
3. Build adjacency clusters (BR-4)
4. Distribute clusters across days:
   - Max 3 neighborhoods per day
   - Adjacent neighborhoods on same day
   - Balance spot count per day
5. For each day:
   a. Order neighborhoods by transit logic (start central, move outward)
   b. Within neighborhood, order by:
      - Opening hours (early openers first)
      - Walking proximity (minimize backtracking)
   c. If >10 spots → split morning/afternoon (BR-6)
   d. Generate route URL per section
6. Return MultiDayPlan
```

## 4. List Management Flow

### Add Spot
```
Input: user says "add [name]" or "save this spot"

1. Extract partial spot data from message
2. Check required fields (BR-7)
3. If missing fields → ask user for each missing field
4. Check duplicates (BR-8) → if found, offer update
5. Show preview card → await confirmation
6. On confirm → AirtableAdapter.create(spot)
7. Invalidate cache
8. Confirm with "Added [name] to your Master List"
```

### Remove Spot
```
Input: user says "remove [name]"

1. Find spot by name (fuzzy match)
2. If ambiguous → show options, ask which one
3. Show spot details (BR-9)
4. Ask for explicit confirmation
5. On confirm → AirtableAdapter.delete(recordId)
6. Invalidate cache
7. Confirm with "Removed [name] from your Master List"
```

## 5. Claude System Prompt Structure

```
You are Conan, an expert Tokyo travel agent.

RULES:
- [All requirements from Conan_Master_Context]
- Format responses as structured JSON when recommending/planning
- For general chat, respond naturally

MASTER LIST (101 spots):
[Full list injected as structured data]

NEIGHBORHOODS: [list with adjacency info]
CATEGORIES: Bakery, Coffee, Camera, Eyewear, Jewelry, Sight

Respond with JSON structure:
{
  "text": "conversational response",
  "locations": [...spots referenced],
  "quickActions": ["suggested follow-ups"],
  "action": null | {type: "add"|"update"|"remove", data: {...}}
}
```

## 6. Frontend State Management

```
Client State:
- messages: Message[]          // conversation history
- isLoading: boolean           // waiting for API response
- mapSpots: Spot[]             // currently displayed on map
- inputValue: string           // chat input field

No server-side session. Full history sent with each /api/chat request.
Trim to last 20 messages if history exceeds limit.
```
