# expo-todo-app

A React Native task manager built with Expo, following a clean layered architecture with adapter pattern, domain model, and full mock support for offline development.

---

## Features

- Create, toggle, and delete tasks
- Filter by status (All / Active / Completed) and sort
- Full-text search
- Weather widget (OpenWeatherMap) showing a random city
- Multilingual UI: English, French, Spanish
- Toast notifications for all user actions
- Mock mode — runs fully offline, no backend required

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Expo SDK 54 / React Native 0.81 |
| Language | TypeScript |
| Data fetching | TanStack React Query v5 |
| i18n | i18next + react-i18next |
| Unit tests | Jest + Testing Library |
| E2E tests | Maestro |
| CI/CD builds | EAS Build |

---

## Architecture

```
src/
├── domain/
│   ├── models/         # Pure domain entities (Todo)
│   └── mappers/        # DTO ↔ domain mapping
│
├── services/           # Domain use cases (TodoService, TodoFilterService)
│
├── outcall/            # External API adapters (anti-corruption layer)
│   ├── taskmanager/
│   │   ├── api/generated/   # Auto-generated OpenAPI client
│   │   ├── TodoAdapter.ts   # Interface + real implementation
│   │   ├── mocks/           # MockTodoAdapter (faker)
│   │   └── index.ts         # Toggle real/mock via env
│   └── weather/
│       ├── WeatherAdapter.ts  # Interface + real implementation (OWM)
│       ├── mocks/             # MockWeatherAdapter
│       └── index.ts           # Toggle real/mock via env
│
├── hooks/              # React Query hooks (useTodos, useTodoMutations, useWeather…)
├── contexts/           # React contexts (TodoContext, NotificationContext)
├── screens/            # Top-level screen components
├── components/
│   ├── todo/           # TodoItem, AddTodoForm, TodoFilters, EmptyState
│   └── ui/             # WeatherWidget, LanguageSelector, NotificationToast
└── localization/
    ├── i18n.ts
    └── translations/   # en.json, fr.json, es.json
```

### Data flow

```
Screen
  └── Context (TodoContext)
        ├── useTodos          → TodoService → ITodoAdapter → API / Mock
        ├── useTodoMutations  → TodoService → ITodoAdapter → API / Mock
        └── useTodoFilters    → TodoFilterService (pure, no I/O)

WeatherWidget
  └── useWeather → IWeatherAdapter → OpenWeatherMap API / Mock
```

### Adapter pattern

Every external dependency (backend API, weather API) is hidden behind an interface. The `index.ts` of each outcall module selects the real or mock implementation based on environment variables, with no change to the rest of the app.

```
IWeatherAdapter
  ├── WeatherAdapter     (real — OpenWeatherMap data/2.5)
  └── MockWeatherAdapter (offline — predefined city data)

ITodoAdapter
  ├── TodoAdapter        (real — generated OpenAPI client)
  └── MockTodoAdapter    (offline — in-memory store with faker)
```

---

## Environment

Variables are loaded via `dotenv-cli` in cascade. Later files override earlier ones.

| File | Purpose | Committed |
|---|---|---|
| `.env` | Base defaults (URLs, shared config) | ✅ |
| `.env.mock` | Mock profile flags | ✅ |
| `.env.dev` | Local dev overrides (IP, ports) | ✅ |
| `.env.local` | Secrets (API keys) | ❌ gitignored |

### Required secrets — `.env.local`

```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_key_here
```

### Available variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_ENV` | Environment label shown in app version (local / test / staging…) |
| `EXPO_PUBLIC_TASK_MANAGER_API_URL` | Backend base URL |
| `EXPO_PUBLIC_TASK_MANAGER_MOCK_ENABLED` | Enable todo mock adapter |
| `EXPO_PUBLIC_OPENWEATHER_API_URL` | OpenWeatherMap base URL |
| `EXPO_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `EXPO_PUBLIC_WEATHER_MOCK_ENABLED` | Enable weather mock adapter |

---

## Getting started

```bash
npm install
```

Create `.env.local` with your secrets:

```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_key_here
```

### Run in mock mode (no backend required)

```bash
npm run start:mock
```

### Run against local backend

```bash
npm run start:local
```

---

## Scripts

| Script | Description |
|---|---|
| `start:mock` | iOS simulator, all mocks enabled |
| `start:local` | iOS/Android/Web, real backend |
| `ios:local` | iOS simulator, real backend |
| `android:local` | Android emulator, real backend |
| `web:local` | Web browser, real backend |
| `test` | Unit tests |
| `test:watch` | Unit tests in watch mode |
| `test:coverage` | Unit tests with coverage |
| `test:e2e` | All Maestro E2E flows |
| `test:e2e:smoke` | Maestro smoke flows only |
| `generate` | Regenerate API client from OpenAPI spec |

---

## Tests

### Unit tests (Jest)

```bash
npm test
npm run test:coverage
```

Coverage collected from `src/services/`, `src/domain/`, `src/outcall/` (excluding generated code).

### E2E tests (Maestro)

Requires the Expo dev server running (`npm run start:mock`) and iOS Simulator open.

```bash
npm run test:e2e:smoke
```

Flows in `.maestro/flows/`:

| Flow | Description |
|---|---|
| `00_launch` | App launches successfully |
| `01_todo_list` | Todo list and filters are visible |
| `02_add_todo` | Create a new task |
| `03_toggle_todo` | Toggle task completion |
| `04_delete_todo` | Delete a task |
| `05_filters` | Filter by All / Active / Completed |
| `06_search` | Search with no results |
| `07_language` | Switch language EN ↔ FR |

---

## EAS Build profiles

Defined in `eas.json`:

| Profile | Backend | Mock |
|---|---|---|
| `dev` | Local IP | No |
| `dev-mock` | Local IP | Yes |
| `qa` | QA server | No |
| `qa-mock` | QA server | Yes |
| `test` | localhost | Yes |
| `staging` | Staging server | No |
| `production` | Production API | No |

```bash
eas build --profile qa-mock --platform ios
```

---

## Generate API client

Requires the backend running on `localhost:8080`:

```bash
npm run generate
```

This fetches the OpenAPI spec and regenerates `src/outcall/taskmanager/api/generated/`.
