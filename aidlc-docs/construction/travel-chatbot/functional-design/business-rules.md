# Business Rules

## BR-1: Recommendation Priority
- **Rule**: Master List entries ALWAYS appear before external recommendations
- **Condition**: When user asks for spots in a neighborhood/category
- **Logic**: Return ALL matching Master List entries first, sorted by rating DESC. If zero matches, return exactly 3 external picks (highest rated from general knowledge).

## BR-2: Master List Badge
- **Rule**: Display "This is on Giang's Master List." badge only for Master List entries
- **Condition**: Every location card displayed
- **Logic**: `if (spot.id exists in Airtable) → show badge; else → no badge`

## BR-3: Itinerary Neighborhood Clustering
- **Rule**: Group spots by neighborhood to minimize transit time
- **Condition**: When generating day plans or multi-day itineraries
- **Logic**:
  1. Identify all neighborhoods containing requested spots
  2. Cluster adjacent neighborhoods (use predefined adjacency map)
  3. Assign clusters to days (max 3 neighborhoods per day)
  4. Within a day, order spots by walking proximity within each neighborhood

## BR-4: Neighborhood Adjacency Map
```
Shibuya ↔ Daikanyama ↔ Nakameguro ↔ Meguro
Shibuya ↔ Harajuku ↔ Omotesando ↔ Aoyama
Shinjuku ↔ Nakano
Asakusa ↔ Yanaka ↔ Ueno
Shimokitazawa ↔ Setagaya
Kichijoji (standalone — far west)
Ginza (standalone — central)
Gotokuji (standalone)
```

## BR-5: Opening Hours Constraint
- **Rule**: Never recommend a spot for a time outside its operating hours
- **Condition**: When building itineraries with time slots
- **Logic**: Parse hours string (HH:MM-HH:MM). If planned visit time < open or > close, move spot to valid time slot or exclude with explanation.

## BR-6: Morning/Afternoon Split
- **Rule**: Split itinerary into morning/afternoon when >10 stops
- **Condition**: Day plan has more than 10 spots
- **Logic**: First half = morning (sorted by opening time ASC), second half = afternoon. Generate separate route links for each half.

## BR-7: Add Spot Validation
- **Rule**: All required fields must be present before saving
- **Required fields**: name, neighborhood, category, hours, rating, whatToTry, station, walkTime
- **Logic**: If any field missing → prompt user for it. Show preview card → require explicit "yes" confirmation → save to Airtable.

## BR-8: Duplicate Detection
- **Rule**: Prevent duplicate entries in Master List
- **Condition**: When adding a new spot
- **Logic**: Case-insensitive name match within same neighborhood. If duplicate found → offer to update existing entry instead of creating new one.

## BR-9: Destructive Action Confirmation
- **Rule**: Always confirm before removing a spot
- **Condition**: User says "remove X" or "delete X"
- **Logic**: Show spot details → ask "Are you sure you want to remove [Name] from the list?" → only delete on explicit "yes".

## BR-10: Rate Limiting (Airtable)
- **Rule**: Respect Airtable's 5 requests/second limit
- **Condition**: All Airtable API calls
- **Logic**: Use in-memory cache for reads (TTL: 60 seconds). Batch writes if multiple changes in quick succession. Queue requests if rate limit approached.

## BR-11: Fallback on LLM Failure
- **Rule**: App remains usable if Claude API is unavailable
- **Condition**: Claude API returns error or timeout (>10s)
- **Logic**: Show error message + offer to browse list directly (filter by neighborhood/category without AI). List browsing works without LLM.

## BR-12: Context Auto-Detection
- **Rule**: AI detects planning vs. trip context without explicit mode switching
- **Condition**: Every user message
- **Logic**: If message mentions future tense / "plan" / multi-day → planning context. If message mentions "nearby" / "I'm at" / "right now" → trip context. Adjust response format accordingly (planning = detailed day layouts; trip = quick actionable cards).

## BR-13: Route Link Generation
- **Rule**: Multi-stop route link appears at top of every multi-location response
- **Condition**: Response contains 2+ spots
- **Logic**: Generate Google Maps directions URL with spots as waypoints in optimized order. If >10 stops, split into 2 route links (morning/afternoon).
