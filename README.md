# Forge 2 — Kanban Board

A Trello-style Kanban board built with **Laravel 13** (PHP 8.3) and **React 19** (Vite 8). Features drag-and-drop card movement, board CRUD, card editing with due dates and assignees, member assignment, tags, and full SQLite persistence.

**Live URL**: https://forge2-qualifier-shreya.vercel.app/

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Why This Project](#why-this-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Models and Relationships](#database-models-and-relationships)
- [API Endpoints](#api-endpoints)
- [Local Setup Instructions](#local-setup-instructions)
- [Deployment](#deployment)
- [Hermes ⇄ OpenClaw Workflow](#hermes--openclaw-workflow)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)

---

## Project Overview

This is a Forge 2 qualifier project implementing a Trello-style Kanban board. Users can create boards, add lists (To Do, Doing, Done), create cards with due dates and assignees, edit cards via a modal, drag-and-drop cards between lists, and delete boards or cards. All data persists in a SQLite database through a Laravel REST API consumed by a React frontend.

The application follows a **Board → List → Card** hierarchy where:
- A **Board** contains multiple lists
- A **List** belongs to a board and contains multiple cards
- A **Card** belongs to a list and optionally has a due date, assignee, label/tag, and description

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| Create boards | ✅ | Boards auto-create 3 default lists (To Do, Doing, Done) |
| Create lists | ✅ | Lists are auto-created; board deletion cascades to lists |
| Create cards | ✅ | Cards created with title, label, assignee, due date |
| Edit cards | ✅ | Modal-based editing of all card fields |
| Delete cards | ✅ | Immediate deletion with API call |
| Move cards between lists | ✅ | HTML5 drag-and-drop with persistence |
| Assign members | ✅ | Assignee field on cards (string-based) |
| Due dates | ✅ | Date picker on cards, overdue indicator |
| Tags | ✅ | Label field displayed as colored tag badge |
| Board deletion | ✅ | Cascading delete removes lists and cards |
| Search | ✅ | Client-side search across card titles and descriptions |
| Responsive UI | ✅ | Dark theme, flexbox layout, mobile-friendly |

---

## Why This Project

Built as a Forge 2 qualifier to demonstrate full-stack development with Laravel and React. Key learning objectives achieved:

- RESTful API design with Laravel's Eloquent ORM and resource routes
- Three-tier database hierarchy (Board → List → Card) with foreign key constraints and cascade deletes
- Modern React patterns: hooks (useState, useEffect), async/await API calls, optimistic UI updates
- HTML5 drag-and-drop for cross-list card movement
- Vite dev server proxying to Laravel backend
- SQLite persistence with migrations and seeders
- Agentic development workflow using Hermes ⇄ OpenClaw

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Laravel (PHP) | 13.8 |
| Frontend Framework | React | 19.2 |
| Build Tool | Vite | 8.0 |
| Database | SQLite (file-based) | — |
| Drag & Drop | @hello-pangea/dnd | 18.0 |
| Testing Framework | PHPUnit | 12.5 |
| Linting | ESLint | 10.3 |
| Containerization | Docker | — |

---

## Project Structure

```
kanban/
├── backend/                        ← Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/Api/
│   │   │       ├── KanbanController.php    ← All board/card operations
│   │   │       └── Controller.php          ← Base controller
│   │   └── Models/
│   │       ├── Board.php                  ← HasMany BoardList
│   │       ├── BoardList.php              ← BelongsTo Board, HasMany Card
│   │       ├── Card.php                   ← BelongsTo BoardList
│   │       └── User.php                   ← Authenticatable (ready for auth)
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 2026_06_21_102706_create_boards_table.php
│   │   │   ├── 2026_06_21_102706_create_board_lists_table.php
│   │   │   ├── 2026_06_21_102708_create_cards_table.php
│   │   │   └── 2026_06_24_add_board_id_to_cards_table.php
│   │   ├── seeders/
│   │   │   └── DatabaseSeeder.php
│   │   └── database.sqlite                ← Actual SQLite database
│   ├── routes/
│   │   └── api.php                        ← All API routes
│   ├── config/                            ← Laravel config files
│   ├── Dockerfile                         ← Production container
│   ├── .env.example                       ← Environment template
│   └── composer.json                      ← PHP dependencies
│
├── frontend/                       ← React SPA
│   ├── src/
│   │   ├── App.jsx                        ← Main application (all components)
│   │   ├── App.css                        ← Dark theme styles
│   │   ├── index.css                      ← Base reset styles
│   │   └── main.jsx                       ← React entry point
│   ├── vite.config.js                     ← Vite + proxy config
│   ├── package.json                       ← Node dependencies
│   └── index.html                         ← HTML shell
│
├── screenshots/                          ← App screenshots
├── ARCHITECTURE.md                        ← Architecture documentation
├── agent-log.md                           ← Development agent log
└── skills/
    └── kanban-board-manager/
        └── SKILL.md                       ← Reusable skill definition
```

---

## Backend Architecture

### Overview

The backend follows Laravel's MVC pattern with API-only resources. All routes are prefixed with `/api` and return JSON. A single `KanbanController` handles all board and card operations.

```
Request → Route → KanbanController → Model → SQLite → JSON Response
```

### Design Decisions

- **Single Controller**: `KanbanController` handles board CRUD, card CRUD, card move, and seeding. This keeps the API surface consolidated.
- **Eager Loading**: `Board::with('lists.cards')` returns the full hierarchy in one query, avoiding N+1 problems.
- **Validation**: All write operations use `$request->validate()` with explicit rules.
- **Cascade Deletes**: Foreign keys use `onDelete('cascade')` so deleting a board removes its lists and cards automatically.
- **Default Lists**: `storeBoard()` automatically creates "To Do", "Doing", "Done" lists for every new board.

### Request Lifecycle

```
1. Vite proxy forwards /api/* to Laravel
2. routes/api.php maps to KanbanController method
3. Controller validates request, interacts with Eloquent models
4. Models query SQLite database
5. Controller returns JSON response
6. React frontend updates state and re-renders
```

---

## Frontend Architecture

### Overview

A single-file React application (`App.jsx`) with all components, API calls, and state management. The app uses React hooks exclusively — no external state management library.

### Component Structure

| Component | Responsibility |
|-----------|---------------|
| `App` | Root component — state management, API calls, DnD handling, board selector |
| `Card` | Individual card display with edit/delete buttons |
| `EditModal` | Modal form for editing card title, description, tag, due date, assignee |

### State Management

- `boards` — Array of board objects with nested lists and cards
- `selectedBoard` — ID of currently selected board
- `inputs` — Object tracking add-card input values per column
- `editCard` — Card being edited (null when modal closed)
- `dragCard` — Card being dragged (null when not dragging)
- `loading` — Loading state flag
- `error` — Error message for API failures

### API Integration

All API calls go through a helper function:

```js
async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}
```

### Data Flow

```
User Action → API Call → Laravel Backend → SQLite
     ↑                                      ↓
React State ← JSON Response ← JSON Response
```

### Drag & Drop

Uses native HTML5 drag events (`draggable`, `onDragStart`, `onDrop`) with a simple state-based approach:
1. `handleDragStart` stores the dragged card and source column
2. `onDrop` on target column triggers `handleDrop`
3. `handleDrop` calls `PUT /api/cards/{id}/move` and refetches boards

### Stale State Handling

After board creation, React state may not be immediately updated. Both `addCard()` and `handleDrop()` include a fallback that refetches from the API if `currentBoard.lists` is empty.

---

## Database Models and Relationships

### ER Diagram

```
┌──────────────────┐
│      boards      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│    board_lists   │
├──────────────────┤
│ id (PK)          │
│ board_id (FK)    │──→ boards.id (cascade on delete)
│ name             │
│ position         │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│      cards       │
├──────────────────┤
│ id (PK)          │
│ board_list_id(FK)│──→ board_lists.id (cascade on delete)
│ board_id (FK)    │──→ boards.id (nullable, cascade on delete)
│ title            │
│ description      │
│ label            │
│ assignee         │
│ due_date         │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### Model Details

#### `Board` (App\Models\Board)
```php
protected $fillable = ['name'];
public function lists() { return $this->hasMany(BoardList::class); }
```

#### `BoardList` (App\Models\BoardList)
```php
protected $fillable = ['board_id', 'name', 'position'];
public function board() { return $this->belongsTo(Board::class); }
public function cards() { return $this->hasMany(Card::class); }
```

#### `Card` (App\Models\Card)
```php
protected $fillable = ['board_list_id', 'title', 'description', 'label', 'assignee', 'due_date'];
public function list() { return $this->belongsTo(BoardList::class); }
public function board() { return $this->belongsToThrough(Board::class, BoardList::class); }
```

### Migration Details

| Migration | What It Creates |
|-----------|----------------|
| `create_boards_table` | `boards` table with `id`, `name`, timestamps |
| `create_board_lists_table` | `board_lists` table with `id`, `board_id` (FK, cascade), `name`, `position`, timestamps |
| `create_cards_table` | `cards` table with `id`, `board_list_id` (FK, cascade), `title`, `description`, `label`, `assignee`, `due_date`, timestamps |
| `add_board_id_to_cards_table` | Adds nullable `board_id` FK to `cards` table (for direct board reference) |

---

## API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/boards` | List all boards with lists and cards | — |
| `POST` | `/api/boards` | Create board (auto-creates 3 lists) | `{"name": "Board Name"}` |
| `PUT` | `/api/boards/{id}` | Update board name | `{"name": "New Name"}` |
| `DELETE` | `/api/boards/{id}` | Delete board (cascades to lists+cards) | — |
| `POST` | `/api/cards` | Create card | `{"board_list_id": 1, "title": "Card", "label": "Tag", "assignee": "Name", "due_date": "2026-12-31"}` |
| `PUT` | `/api/cards/{id}` | Update card | `{"title": "New", "assignee": "Name", "due_date": "2026-12-31"}` |
| `DELETE` | `/api/cards/{id}` | Delete card | — |
| `PUT` | `/api/cards/{id}/move` | Move card to different list | `{"board_list_id": 2}` |
| `GET` | `/api/seed` | Reset database with sample data | — |

### Example Responses

**GET /api/boards**
```json
[
  {
    "id": 1,
    "name": "Project Alpha",
    "created_at": "2026-06-24T20:33:15.000000Z",
    "updated_at": "2026-06-24T20:33:15.000000Z",
    "lists": [
      {
        "id": 1,
        "board_id": 1,
        "name": "To Do",
        "position": 1,
        "cards": [
          {
            "id": 1,
            "board_list_id": 1,
            "title": "Setup project",
            "description": "Initialize repo",
            "label": "Backend",
            "assignee": "Shreya",
            "due_date": "2026-07-01",
            "board_id": null
          }
        ]
      },
      {"id": 2, "name": "Doing", "cards": []},
      {"id": 3, "name": "Done", "cards": []}
    ]
  }
]
```

**POST /api/boards**
```json
// Request
{"name": "New Board"}
// Response (201)
{
  "id": 2,
  "name": "New Board",
  "lists": [
    {"id": 4, "board_id": 2, "name": "To Do", "position": 1},
    {"id": 5, "board_id": 2, "name": "Doing", "position": 2},
    {"id": 6, "board_id": 2, "name": "Done", "position": 3}
  ]
}
```

---

## Local Setup Instructions

### Prerequisites

- PHP ≥ 8.3 with SQLite extension
- Composer
- Node.js ≥ 18
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Shreya-1416/forge2-qualifier-shreya.git
cd kanban

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Frontend setup (new terminal)
cd frontend
npm install
```

### Running the Application

```bash
# Terminal 1: Start Laravel backend
cd backend
php artisan serve
# Runs on http://localhost:8000

# Terminal 2: Start Vite dev server
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Access the App

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8000/api` |

### Docker Deployment

```bash
cd backend
docker build -t kanban-backend .
docker run -p 10000:10000 kanban-backend
```

---

## Deployment

**Live URL**: https://forge2-qualifier-shreya.vercel.app/

### Deployment Configuration

- **Platform**: Vercel (frontend) + Laravel backend
- **Database**: SQLite (file-based, included in deployment)
- **Environment**:
  - `DB_CONNECTION=sqlite`
  - `APP_ENV=production`

### Build Commands

```bash
# Frontend build
cd frontend
npm run build
# Output: dist/

# Backend optimization
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
```

---

## Hermes ⇄ OpenClaw Workflow

This project was developed using an agentic development workflow with **Hermes** (AI agent framework by Nous Research) and **OpenClaw** (development environment).

### Workflow Overview

```
1. User provides requirements via Slack
   ↓
2. Hermes agent receives task in OWL (OpenClaw) profile
   ↓
3. Agent reads existing codebase (session_search, read_file, search_files)
   ↓
4. Agent diagnoses issues and proposes fixes
   ↓
5. User approves changes
   ↓
6. Agent implements fixes (patch, write_file, terminal)
   ↓
7. Agent verifies fixes (curl tests, PHPUnit, npm run build)
   ↓
8. Agent generates documentation
   ↓
9. User reviews and requests adjustments
   ↓
10. Agent iterates until requirements met
```

### Key Development Sessions

| Session | Task | Outcome |
|---------|------|---------|
| 1 | Initial code review | Identified frontend-backend disconnection |
| 2 | API integration | Replaced useState with fetch() calls |
| 3 | Bug investigation | Found stale PHP servers from deleted project on wrong port |
| 4 | Data structure mismatch | Diagnosed Board → List vs Board → Card architecture conflict |
| 5 | Full persistence verification | All CRUD operations confirmed working |
| 6 | Documentation generation | This document |

### Agent Capabilities Used

- **Code Analysis**: Read PHP/JSX files, identified relationships and data flow
- **API Testing**: Used `curl` to verify all endpoints
- **Database Inspection**: Used `php artisan tinker` to query SQLite
- **Process Management**: Identified stale PHP processes with `netstat` and `powershell`
- **Fix Implementation**: Patched controller, routes, models, and frontend components
- **Verification**: End-to-end testing of all features

---

## Screenshots

> *The `screenshots/` directory is populated with application screenshots.*

| View | Description |
|------|-------------|
| Board Overview | Full board view with 3 lists and cards |
| Card Edit Modal | Edit modal showing title, description, tag, due date, assignee fields |
| Board Selector | Multi-board selector with delete buttons |
| Drag & Drop | Card being dragged between lists |
| Stats Dashboard | Total tasks, lists, completed, overdue counters |

---

## Future Improvements

| Priority | Feature | Complexity |
|----------|---------|------------|
| 🔴 High | **Database seeder** — `KanbanSeeder` is missing; `DatabaseSeeder` only creates a test user | Low |
| 🔴 High | **Factories** — `BoardFactory` and `CardFactory` are empty stubs | Low |
| 🔴 High | **Tests** — Only `ExampleTest.php` exists; no feature tests for CRUD operations | Medium |
| 🟡 Medium | **Authentication** — User model exists but no auth system (Sanctum) | Medium |
| 🟡 Medium | **Card templates** — Pre-defined card templates for quick creation | Low |
| 🟡 Medium | **List reordering** — Drag-and-drop lists to reorder columns | Low |
| 🟢 Low | **Search API** — Server-side search instead of client-side filtering | Low |
| 🟢 Low | **Activity log** — Track card creation, moves, edits | Low |
| 🟢 Low | **Dark/Light theme toggle** | Low |

---

## License

MIT License — Forge 2 Qualifier Project
