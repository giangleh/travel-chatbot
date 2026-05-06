# Requirements Verification Questions

Based on your existing "Conan" chatbot context (101 locations, 17 neighborhoods, 6 categories), I have a solid understanding of the WHAT. These questions focus on the HOW — technical implementation decisions.

---

## Question 1
What platform should this chatbot run on?

A) Web app (browser-based, deployable to Vercel/Netlify/etc.)
B) Mobile app (React Native or native iOS/Android)
C) Messaging integration (Telegram, WhatsApp, LINE, etc.)
D) CLI / terminal-based tool
E) Progressive Web App (installable, works offline)
X) Other (please describe after [Answer]: tag below)

[Answer]: A, B — Both web app and mobile app 

## Question 2
What AI/LLM should power the chatbot's conversational ability?

A) OpenAI (GPT-4o / GPT-4o-mini)
B) Anthropic (Claude)
C) AWS Bedrock (Claude, Titan, or other models)
D) Local/open-source model (Ollama, LLaMA, etc.)
E) No LLM — rule-based matching only (keyword/filter logic)
X) Other (please describe after [Answer]: tag below)

[Answer]: B — Anthropic (Claude)

## Question 3
Where should the curated spots data (your Master List) be stored?

A) Static JSON/CSV file bundled with the app (simplest, no backend needed)
B) Google Sheets / Airtable (easy to edit, API access)
C) Database (PostgreSQL, DynamoDB, etc.)
D) Google Drive file (as in your current Conan context)
E) Embedded in the LLM system prompt as context
X) Other (please describe after [Answer]: tag below)

[Answer]: B — Airtable 

## Question 4
Should the chatbot support real-time editing of the Master List (add/remove spots) during the trip?

A) Yes — I want to add/remove spots conversationally ("add this to my list")
B) Yes — but through a separate admin UI, not chat
C) No — the list is fixed before the trip; read-only during travel
X) Other (please describe after [Answer]: tag below)

[Answer]: A — Yes, real-time editing via conversational interface

## Question 5
What's the primary use case during the trip?

A) "I'm in [neighborhood], what should I do nearby?" — proximity-based recommendations
B) "Plan my day" — full day itinerary generation with route optimization
C) "Find me a [category] spot" — category-based filtering
D) All of the above equally
X) Other (please describe after [Answer]: tag below)

[Answer]: X — Itinerary planning based on user needs and proximity (combination of A and B) 

## Question 6
Should the chatbot work offline (no internet required)?

A) Yes — must work fully offline (important for international travel)
B) Partially — core data offline, but LLM features need internet
C) No — internet connection assumed (Wi-Fi/data plan available)
X) Other (please describe after [Answer]: tag below)

[Answer]: C — No offline support needed; internet connection assumed 

## Question 7
How many users will use this?

A) Just me (personal project)
B) Me and a few travel companions (2-5 people)
C) Public-facing app for anyone to use with their own lists
X) Other (please describe after [Answer]: tag below)

[Answer]: C — Shared with external users (public-facing) 

## Question 8
What's your deployment preference?

A) Free tier / minimal cost (Vercel free, Cloudflare Workers, etc.)
B) AWS (Lambda, API Gateway, DynamoDB — leveraging your Amazon experience)
C) Self-hosted (Docker, VPS)
D) Don't care — whatever works best for the use case
X) Other (please describe after [Answer]: tag below)

[Answer]: X — Requesting recommendation. **AI Recommendation**: Option A (Vercel/Netlify free tier) for the web frontend + serverless API routes. Given this is a public-facing app with Airtable as the data layer and embedded maps, a Vercel deployment gives you zero-config CI/CD, generous free tier (100GB bandwidth, serverless functions), and excellent Next.js/React support for both web and a future React Native mobile companion. No need for heavy AWS infrastructure when Airtable handles persistence and the LLM provider handles AI compute. 

## Question 9
Do you want Google Maps integration for navigation/routing?

A) Yes — embedded maps and real-time directions
B) Yes — but just generate Google Maps links (like your current Conan context does)
C) No — text-based directions only
X) Other (please describe after [Answer]: tag below)

[Answer]: A — Embedded maps with real-time directions 

## Question 10: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]: X — Requesting recommendation. **AI Recommendation**: Option A (enforce security rules). Since this is a public-facing app shared with external users, you need: API key protection (Airtable, Maps, LLM keys must never be exposed client-side), input sanitization (user chat input goes to an LLM — prompt injection risk), rate limiting (prevent abuse from public access), and HTTPS everywhere. Security rules should be blocking constraints for a public app handling user interactions. 

## Question 11: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints
B) Partial — enforce PBT rules only for pure functions and serialization round-trips
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers)
X) Other (please describe after [Answer]: tag below)

[Answer]: X — Unsure. **AI Recommendation**: Option B (partial PBT). This app has pure functions worth testing with PBT (itinerary scoring/ranking logic, proximity calculations, data transformations between Airtable and app models), but the UI layer and LLM integration are better served by integration tests. Full PBT enforcement would be overkill; partial gives you confidence in the algorithmic core without slowing down UI development. 
