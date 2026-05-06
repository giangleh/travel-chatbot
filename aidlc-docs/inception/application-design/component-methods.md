# Component Methods

## ChatUI (React Component)
```
sendMessage(text: string): void
renderMessage(message: Message): JSX
renderLocationCard(spot: Spot): JSX
renderQuickActions(suggestions: string[]): JSX
```

## MapView (React Component)
```
displayPins(spots: Spot[]): void
fitBounds(spots: Spot[]): void
openInfoWindow(spot: Spot): void
generateRouteUrl(spots: Spot[]): string
```

## ChatOrchestrator (API Route: /api/chat)
```
handleMessage(userMessage: string, history: Message[]): ChatResponse
buildSystemPrompt(masterList: Spot[]): string
detectIntent(userMessage: string): Intent
routeToHandler(intent: Intent, context: ChatContext): ChatResponse
```

## Recommender
```
recommend(filters: {neighborhood?: string, category?: string}): Spot[]
rankByRating(spots: Spot[]): Spot[]
generateFallback(query: string): Spot[]  // 3 external picks
formatCards(spots: Spot[]): LocationCard[]
```

## ItineraryPlanner
```
planDay(neighborhoods: string[], hours?: number): DayPlan
planMultiDay(duration: number, preferences?: Preferences): MultiDayPlan
groupByProximity(spots: Spot[]): NeighborhoodGroup[]
optimizeRoute(spots: Spot[]): Spot[]  // minimize transit
splitMorningAfternoon(spots: Spot[]): {morning: Spot[], afternoon: Spot[]}
```

## ListManager
```
addSpot(input: Partial<Spot>): {missing: string[]} | {preview: Spot}
confirmAdd(spot: Spot): Spot
updateSpot(name: string, fields: Partial<Spot>): Spot
removeSpot(name: string): {confirmation: string}
confirmRemove(name: string): void
detectDuplicate(name: string): Spot | null
```

## AirtableAdapter
```
fetchAll(): Spot[]  // cached
fetchByNeighborhood(neighborhood: string): Spot[]
create(spot: Spot): AirtableRecord
update(recordId: string, fields: Partial<Spot>): AirtableRecord
delete(recordId: string): void
invalidateCache(): void
```

## MapsService
```
getNavigateUrl(destination: Spot): string
getMultiStopUrl(spots: Spot[]): string
getEmbedUrl(spots: Spot[], zoom?: number): string
```
