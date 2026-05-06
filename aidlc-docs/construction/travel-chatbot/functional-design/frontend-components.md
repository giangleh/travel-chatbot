# Frontend Components

## Component Hierarchy

```
App
├── ChatPage (main page)
│   ├── ChatMessages
│   │   ├── UserMessage
│   │   ├── AssistantMessage
│   │   │   ├── LocationCard (repeated)
│   │   │   └── ItineraryView
│   │   └── LoadingIndicator
│   ├── MapView
│   │   └── MapPin (repeated)
│   ├── QuickActions
│   └── ChatInput
```

## Component Definitions

### ChatPage
- **State**: messages[], isLoading, mapSpots[]
- **Behavior**: Manages chat flow, calls /api/chat, updates state
- **Layout**: Split view on desktop (chat left, map right). Stacked on mobile (chat top, map toggle).

### ChatMessages
- **Props**: messages: Message[]
- **Behavior**: Scrollable message list, auto-scrolls to bottom on new message

### LocationCard
- **Props**: spot: Spot, isOnMasterList: boolean, navigateUrl: string
- **Displays**: Name · Neighborhood · Category, Rating, Hours, Walk time, What to try, Navigate link, Photo link, Badge (if on list)

### ItineraryView
- **Props**: plan: DayPlan | MultiDayPlan
- **Displays**: Day headers, morning/afternoon sections, route link at top, spot cards in order

### MapView
- **Props**: spots: Spot[], routeUrl?: string
- **Behavior**: Renders Google Map embed, places pins, auto-fits bounds, shows info windows on tap

### QuickActions
- **Props**: suggestions: string[]
- **Behavior**: Renders tappable buttons. On tap, sends text as if user typed it.

### ChatInput
- **Props**: onSend: (text: string) => void, disabled: boolean
- **Behavior**: Text input + send button. Disabled while loading. Enter key sends.

## API Integration Points
- ChatPage → `POST /api/chat` (send message, receive response)
- ChatPage → `GET /api/spots` (initial list load for map)
- MapView → Google Maps JavaScript API (client-side embed)
- LocationCard → Google Maps URLs (navigate links, photo search links)
