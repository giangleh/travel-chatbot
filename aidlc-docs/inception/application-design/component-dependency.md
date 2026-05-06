# Component Dependencies

## Dependency Matrix

```
                ChatUI  MapView  ChatOrch  Recommender  Planner  ListMgr  Airtable  Maps
ChatUI            -       uses      calls       -          -        -        -        -
MapView           -        -         -          -          -        -        -       uses
ChatOrchestrator  -        -         -        calls      calls    calls    calls      -
Recommender       -        -         -          -          -        -       calls      -
ItineraryPlanner  -        -         -          -          -        -       calls    calls
ListManager       -        -         -          -          -        -       calls      -
AirtableAdapter   -        -         -          -          -        -        -         -
MapsService       -        -         -          -          -        -        -         -
```

## Data Flow

```
User Input
    |
    v
[ChatUI] --POST /api/chat--> [ChatOrchestrator]
                                    |
                        +-----------+-----------+
                        |           |           |
                        v           v           v
                 [Recommender] [Planner] [ListManager]
                        |           |           |
                        v           v           v
                    [AirtableAdapter]    [MapsService]
                        |                      |
                        v                      v
                    Airtable API        Google Maps API
```

## Communication Patterns
- **Frontend → Backend**: HTTP POST (chat messages), HTTP GET/POST/PUT/DELETE (spots CRUD)
- **Backend → External APIs**: HTTP REST (Airtable, Claude, Google Maps)
- **Caching**: AirtableAdapter caches full list in memory (invalidated on write)
- **State**: Conversation history maintained client-side (passed with each request)
