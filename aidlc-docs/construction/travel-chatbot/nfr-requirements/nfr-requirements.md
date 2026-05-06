# NFR Requirements — travel-chatbot

## Security (ENFORCED — Security Baseline Extension)

### SEC-1: API Key Protection
- **Requirement**: All API keys (Anthropic, Airtable, Google Maps) must NEVER be exposed to the client
- **Implementation**: All external API calls routed through Next.js API routes (serverless functions)
- **Validation**: No API key appears in client-side bundle (verified via build inspection)

### SEC-2: Input Sanitization
- **Requirement**: User chat input must be sanitized before passing to LLM
- **Risk**: Prompt injection — user could attempt to override system prompt
- **Implementation**: Strip known injection patterns, enforce system prompt boundaries, validate input length (max 2000 chars)

### SEC-3: Rate Limiting
- **Requirement**: Public endpoints must be rate-limited to prevent abuse
- **Limits**:
  - `/api/chat`: 20 requests/minute per IP
  - `/api/spots` (write): 10 requests/minute per IP
  - `/api/spots` (read): 60 requests/minute per IP
- **Implementation**: Vercel Edge Middleware or in-memory rate limiter

### SEC-4: HTTPS
- **Requirement**: All traffic must be encrypted
- **Implementation**: Vercel provides HTTPS by default on all deployments

### SEC-5: CORS
- **Requirement**: API routes must only accept requests from the app's own domain
- **Implementation**: Configure CORS headers to restrict origin

---

## Performance

### PERF-1: Chat Response Time
- **Requirement**: End-to-end response within 5 seconds (Claude latency is 2-4s)
- **Implementation**: Stream Claude responses to show partial results immediately
- **Metric**: Time from send to first token displayed

### PERF-2: Airtable Caching
- **Requirement**: Master List reads must not hit Airtable on every request
- **Implementation**: In-memory cache with 60-second TTL. Invalidate on writes.
- **Metric**: Cache hit rate >95% during normal usage

### PERF-3: Initial Page Load
- **Requirement**: First meaningful paint within 2 seconds
- **Implementation**: Next.js SSR/SSG for shell, lazy-load map component
- **Metric**: Lighthouse performance score >80

### PERF-4: Map Rendering
- **Requirement**: Map with pins renders within 1 second after data available
- **Implementation**: Lazy-load Google Maps SDK, render pins incrementally

---

## Reliability

### REL-1: LLM Fallback
- **Requirement**: App remains functional if Claude API is down
- **Implementation**: Show error message + offer direct list browsing (filter by neighborhood/category)
- **Recovery**: Automatic retry on next user message

### REL-2: Airtable Retry
- **Requirement**: Transient Airtable failures don't crash the app
- **Implementation**: Retry with exponential backoff (max 3 attempts). Serve stale cache if all retries fail.

### REL-3: Error Messages
- **Requirement**: All errors shown to user must be friendly and actionable
- **Implementation**: Map technical errors to user-friendly messages. Never expose stack traces.

---

## Scalability

### SCALE-1: Serverless Auto-Scaling
- **Requirement**: Handle traffic spikes without manual intervention
- **Implementation**: Vercel serverless functions scale automatically

### SCALE-2: Airtable Rate Respect
- **Requirement**: Never exceed Airtable's 5 req/sec limit
- **Implementation**: Request queue with throttling. Cache reduces actual API calls.

---

## Testing (ENFORCED — Partial PBT Extension)

### TEST-1: Property-Based Testing Targets
- **Requirement**: PBT applied to pure algorithmic functions
- **Targets**:
  - Itinerary neighborhood clustering (property: all spots assigned, no duplicates)
  - Route optimization (property: output is permutation of input)
  - Recommendation filtering (property: results are subset of input, sorted correctly)
  - Spot validation (property: valid spots always pass, invalid always fail)

### TEST-2: Integration Testing
- **Requirement**: API routes tested with mocked external services
- **Targets**: /api/chat, /api/spots, /api/maps

### TEST-3: Component Testing
- **Requirement**: Frontend components tested for rendering and interaction
- **Targets**: LocationCard, ChatInput, QuickActions

---

## Tech Stack Selection

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR, API routes, Vercel-native |
| Language | TypeScript | Type safety for domain models |
| Styling | Tailwind CSS | Rapid UI development, mobile-first |
| LLM SDK | @anthropic-ai/sdk | Official Claude SDK |
| Maps | @vis.gl/react-google-maps | React wrapper for Maps JS API |
| Testing | Vitest + fast-check | Fast tests + PBT library |
| Linting | ESLint + Prettier | Code quality |
| Deployment | Vercel | Zero-config, free tier |
