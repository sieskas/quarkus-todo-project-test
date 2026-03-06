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
