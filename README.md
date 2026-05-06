# Conan — Tokyo Travel Guide Chatbot

AI-powered travel guide for curated Tokyo spots. Chat with Conan to discover bakeries, coffee shops, camera stores, eyewear boutiques, and sights across 17 neighborhoods.

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your API keys in .env.local

# Run development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `AIRTABLE_API_KEY` | Airtable personal access token |
| `AIRTABLE_BASE_ID` | Airtable base ID |
| `AIRTABLE_TABLE_NAME` | Table name (default: "Master List") |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key (server-side) |
| `NEXT_PUBLIC_APP_URL` | App URL for CORS |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (client-side embed) |
| `NEXT_PUBLIC_GOOGLE_MAPS_ID` | Google Maps Map ID |

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run test      # Run tests
npm run lint      # Lint code
```

## Architecture

- **Next.js 14** (App Router) on Vercel
- **Claude** (Anthropic) for conversational AI
- **Airtable** for Master List storage
- **Google Maps** for embedded maps and navigation
- **Tailwind CSS** for styling

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # Chat endpoint (streaming)
│   ├── api/spots/route.ts   # CRUD endpoint
│   ├── api/maps/route.ts    # Maps proxy
│   ├── layout.tsx
│   └── page.tsx             # Main chat page
├── components/
│   ├── ChatMessages.tsx
│   ├── ChatInput.tsx
│   ├── LocationCard.tsx
│   ├── ItineraryView.tsx
│   ├── MapView.tsx
│   └── QuickActions.tsx
├── lib/
│   ├── airtable.ts          # Data layer (cached)
│   ├── claude.ts            # LLM integration
│   ├── maps.ts              # Maps URL generation
│   ├── recommender.ts       # Recommendation logic
│   ├── planner.ts           # Itinerary planning
│   ├── list-manager.ts      # CRUD logic
│   └── rate-limit.ts        # Rate limiting
└── types/
    └── index.ts             # Domain types
```
