# RESQLINK — Emergency Response Intelligence Network

Hackathon-ready Next.js/React/TypeScript emergency-response platform. The application is intentionally demo-safe: simulated operational data is explicitly labelled and no browser-only feature claims access to real emergency infrastructure.

## Deploy

### Vercel
Import the repository/project. Vercel detects Next.js automatically.

Build command: `npm run build`

### Netlify
`netlify.toml` is included.

Build command: `npm run build`
Publish directory: `.next`

## Optional environment variables

`NEXT_PUBLIC_MAP_TILE_URL` — optional Leaflet tile template.
`OPENAI_API_KEY` — optional server-only key for AI triage.
`OPENAI_MODEL` — optional model name.

Never expose `OPENAI_API_KEY` to the browser.

## Demo flow

1. Splash initializes the response network.
2. Citizen Home opens with live-style operational map.
3. Tap any map point for nearby service intelligence.
4. Open Get Help → use Demo → Analyze emergency → review → confirm.
5. My Requests tracks TRIAGED/ASSIGNED/EN ROUTE/ON SCENE/COMPLETED.
6. Responder role can update assignment status.
7. Shelters provide capacity and external Google Maps directions.
8. Family supports add/check-in flows.
9. Resources support rapid and custom requests.
10. SOS creates a critical request and can open the device emergency dialer after confirmation.
11. Offline Mesh demonstrates store-and-forward behaviour.
12. Survival Mode reduces motion and prioritises essential workflows.
13. Command mode exposes incident, responder, shelter, hospital, AI, simulation, recovery and audit modules.

## Trust labels

Use `SIMULATED`, `USER-REPORTED`, `VERIFIED`, `AI GENERATED`, `OFFLINE`, and `SYNCING` labels whenever the source or state requires it. Simulation data must never be presented as live government data.

## Command Centre modules 16–21

The command role now includes the full final six operational modules requested:

16. **Evacuation & Safe Routes** — route selection, risk, ETA, receiving capacity, accessibility and corridor activation.
17. **Citizen 360** — privacy-scoped citizen operational profile, safety state, request history, responder and secure communications.
18. **Geofencing** — selectable operational zones, incident/shelter/responder counts and automatic command rules.
19. **Dispatch & Routing** — responder candidates, distance, ETA, assignment and route preview.
20. **Situation Intelligence** — correlated incidents, facilities, resources, routes and timeline signals.
21. **Emergency Playbooks** — structured Flood, Fire, Cyclone, Earthquake and Missing Person response checklists with completion state.

These are wired into the existing command navigation and use the existing ResQLink visual system and map component rather than creating a separate mock application.

### Deployment

- Vercel/Next.js structure is retained.
- No `node_modules` is included in the ZIP; Vercel installs dependencies from `package.json`.
- Supabase remains optional through the existing environment variables and schema.
- Existing local/offline persistence and API routes are preserved.
