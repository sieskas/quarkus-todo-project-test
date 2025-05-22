# Todo App

A modern task management application built with **Quarkus** (backend) and **React + Vite** (frontend).

---

## Prerequisites

- Java 17
- Node.js (latest LTS version recommended)
- Gradle

---

## Project Structure

```bash
./           # Backend (Quarkus)
./todo-app   # Frontend (React + Vite)
```

---

## Getting Started

### Backend (Quarkus)

Start the Quarkus server with hot reload:

```bash
gradle quarkusDev
```

The API will be available at:  
[http://localhost:8080](http://localhost:8080)

---

### Frontend (React + Vite)

Navigate to the frontend directory:

```bash
cd todo-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:  
[http://localhost:5173](http://localhost:5173)

---

## API Client Generation

The frontend uses **automatically generated API clients** based on the **OpenAPI specification** provided by Quarkus.

### To regenerate the API client:

1. Ensure the backend server is running.
2. Run the following command from the `todo-app` directory:

```bash
npx openapi-typescript-codegen \
  --input "http://127.0.0.1:8080/q/openapi" \
  --output src/api/generated \
  --client axios
```

---

## Architecture

### Backend

- **Quarkus** RESTful API
- **JPA** for data persistence

### Frontend

- **React** with **TypeScript**
- **TanStack Query** for data fetching and mutations
- **React Context** for state management
- **TypeScript** for type safety
- **Custom notification system**

---
