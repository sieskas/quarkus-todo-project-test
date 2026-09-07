# Todo App — Monorepo

Full-stack task management application.

| Project | Stack | Path |
|---|---|---|
| **Backend** | Quarkus, Java 17, Gradle | `./` (root) |
| **Frontend Web** | React 19, Vite, TypeScript | `./todo-app/` |
| **Frontend Mobile** | React Native, Expo | `./expo-todo-app/` |

---

## Prerequisites

- Java 17
- Node.js 20+
- Gradle

---

## Project Structure

```
./
  src/                        # Quarkus backend
    main/java/com/example/
      api/v1/controllers/     # REST controllers
      api/v1/dto/             # Request / Response DTOs
      service/                # Business logic
      domain/                 # JPA entities
      outcall/repository/     # Panache repositories
    main/resources/
      application.yml         # Config (H2, CORS, Swagger)
  todo-app/                   # React Vite frontend
  expo-todo-app/              # Expo mobile frontend
```

---

## Backend (Quarkus)

### Tech Stack

- Quarkus + Gradle, Java 17
- Hibernate ORM Panache (PanacheRepository)
- H2 in-memory database (dev)
- RESTEasy Jackson, SmallRye OpenAPI (Swagger always on)
- Lombok, Jakarta EE (CDI, JAX-RS, Persistence)
- API versioning: `/api/v1/`

### Run

```bash
./gradlew quarkusDev
```

| URL | Description |
|---|---|
| `http://localhost:8080/api/v1/todos` | REST API |
| `http://localhost:8080/q/swagger-ui` | Swagger UI |
| `http://localhost:8080/q/openapi` | OpenAPI spec |

### Test

```bash
./gradlew test
```

---

## Frontend Web (todo-app)

### Tech Stack

- React 19, TypeScript, Vite 6, TailwindCSS v4
- @tanstack/react-query v5, react-i18next (en, fr, es)
- Vitest (unit), Playwright (E2E)

### Run

```bash
cd todo-app
npm install

npm run dev        # requires backend on :8080
npm run dev:mock   # fully offline, no backend needed
```

### Test

```bash
# Unit tests (Vitest)
npm test

# E2E tests (Playwright — starts mock server automatically)
npm run test:e2e
npm run test:e2e:headed   # live browser
npm run test:e2e:ui       # Playwright UI + trace viewer
```

See [`todo-app/README.md`](./todo-app/README.md) for full documentation.

---

## Frontend Mobile (expo-todo-app)

### Tech Stack

- React Native, Expo, TypeScript
- @tanstack/react-query v5, react-i18next (en, fr, es)
- Jest + @testing-library/react-native
- Maestro (E2E flows)

### Run

```bash
cd expo-todo-app
npm install

npx expo start               # requires backend
npx expo start --env mock    # fully offline
```

See [`expo-todo-app/README.md`](./expo-todo-app/README.md) for full documentation.

---

## Generate API client

The frontend clients are generated from the Quarkus OpenAPI spec.
Requires the backend to be running on `:8080`.

```bash
# Web
cd todo-app && npm run generate-api

# Mobile
cd expo-todo-app && npm run generate-api
```

---

## Architecture Overview

```
Browser / Mobile
      │
      ▼
  outcall/          ← adapter layer (real or mock, selected via env)
      │
  services/         ← domain services (business rules, stats, filters)
      │
  hooks/            ← React Query (fetch, mutations, optimistic updates)
      │
  contexts/         ← React Context (TodoContext, NotificationContext)
      │
  pages / screens   ← UI
```

Both frontends share the same architecture: outcall adapters, domain services, hooks, and contexts — mirrored between web and mobile.

## Local WSL development

Use Java 17 for the backend. With the local JDK installed under ~/dev/tools/jdk17:

~~~bash
export JAVA_HOME="$HOME/dev/tools/jdk17"
export PATH="$JAVA_HOME/bin:$HOME/.local/node/bin:$PATH"
./gradlew quarkusDev
~~~

In a second terminal, start the web app against the real API with simulated weather (no weather API key needed):

~~~bash
cd todo-app
npm ci
VITE_TASK_MANAGER_MOCK_ENABLED=false VITE_WEATHER_MOCK_ENABLED=true npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
~~~

Open http://localhost:5173. The API and Swagger UI are on http://localhost:8080/api/v1/todos and http://localhost:8080/q/swagger-ui.
The H2 database is in memory; local tasks are reset when the backend restarts.

On Ubuntu 26.04, the pinned Playwright version does not recognize the OS yet. Its Ubuntu 24.04 Chromium build was verified locally.
Stop the web server before running these tests so Playwright starts its own mock server:

~~~bash
cd todo-app
PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 npx playwright install chromium
npm run test:e2e
~~~

## Weather integration

Web and Expo call `GET /api/v1/weather?lat=45.5&lon=-73.6` on the Quarkus API.
Set `WEATHER_API_KEY` on the **backend only** (environment variable or root .env).
Never configure a weather key in VITE_ or EXPO_PUBLIC_ variables.
Without a key the endpoint returns 503. Invalid coordinates return 400;
provider failures, timeouts and malformed responses return 502.
The backend uses OpenWeatherMap, with a five-second request timeout.
Client mock adapters still support offline development.
The backend integration tests use a local HTTP stub and need no real API key.
Shared caching and rate limiting remain future work before wider public use.

## Public demo under /demo-todo/

The root Dockerfile builds Vite and embeds its static files in Quarkus.
Both the browser application and API are served by port 8080:
- /demo-todo/ : application
- /demo-todo/api/v1/todos : task API
- /demo-todo/api/v1/weather : weather API

In Dokploy, build Dockerfile from the repository root and route
www.romain-godard.com with path /demo-todo to port 8080. Do not strip the path.
Keep the existing portfolio route unchanged. Use the existing custom TLS certificate.
Set WEATHER_API_KEY in the application runtime environment only.
The demo database is H2 in memory and is reset whenever this application restarts.

The public Docker demo uses simulated weather (VITE_WEATHER_MOCK_ENABLED=true). No weather API key is needed or deployed. Task operations use the real Quarkus API and H2.

### Daily demo reset (Dokploy Schedule)

Dokploy's native Schedule **Todo daily reset** runs at midnight with timezone
`America/Toronto` (same civil time as New York, including DST).
Type: **Dokploy Server**; enabled; daily cron: `0 0 * * *`.

Script field (also versioned in `deploy/restart-todo-demo.sh`):
```sh
docker service update --force --detach=false app-generate-1080p-circuit-rd13m8
```

This recreates only Todo's Docker Swarm task, resetting in-memory H2 data.
Expect a brief demo interruption. The VM, Dokploy and portfolio remain running.
Weather is simulated; no provider key is needed.
Manage, disable or manually run it from Dokploy's Schedules and inspect its logs.
No systemd timer or host cron is installed.
If the Dokploy application is recreated, update the service name in the schedule
and this script.
