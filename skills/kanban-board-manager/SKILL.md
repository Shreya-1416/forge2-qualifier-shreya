---
name: kanban-board-manager
description: Manage a Trello-style Kanban board with Laravel + React. Create boards, lists, cards. CRUD operations, drag-and-drop, persistence.
---

# Kanban Board Manager

## Trigger Conditions

- User wants to create, read, update, or delete boards, lists, or cards
- User wants to move cards between lists
- User wants to manage due dates, assignees, or tags on cards
- User wants to configure or debug the Kanban board application

## Project Context

This skill manages the Forge 2 Kanban Board project located at `C:\forge2\kanban`.

**Architecture**: Laravel 13 (API) + React 19 (SPA) + SQLite (database)
**Data Hierarchy**: Board → BoardList → Card
**Frontend Entry**: `frontend/src/App.jsx` (single-file SPA)
**Backend Controller**: `backend/app/Http/Controllers/Api/KanbanController.php`

## Key Entities

### Board
- Table: `boards` (id, name, created_at, updated_at)
- Relationship: `HasMany BoardList`
- Auto-creates 3 default lists on creation: "To Do", "Doing", "Done"

### BoardList
- Table: `board_lists` (id, board_id FK, name, position, timestamps)
- Relationship: `BelongsTo Board`, `HasMany Card`
- Foreign key: `board_id → boards.id` (cascade on delete)

### Card
- Table: `cards` (id, board_list_id FK, board_id FK nullable, title, description, label, assignee, due_date, timestamps)
- Relationship: `BelongsTo BoardList`, `BelongsToThrough Board`
- Foreign key: `board_list_id → board_lists.id` (cascade on delete)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | List all boards with nested lists & cards |
| POST | `/api/boards` | Create board (auto-creates 3 default lists) |
| PUT | `/api/boards/{id}` | Rename board |
| DELETE | `/api/boards/{id}` | Delete board (cascades to lists & cards) |
| POST | `/api/cards` | Create card (requires `board_list_id`) |
| PUT | `/api/cards/{id}` | Update card fields |
| DELETE | `/api/cards/{id}` | Delete card |
| PUT | `/api/cards/{id}/move` | Move card to different list (`board_list_id`) |
| GET | `/api/seed` | Reset database with sample data |

## Common Operations

### Create a Board
```bash
curl -X POST http://localhost:8000/api/boards \
  -H "Content-Type: application/json" \
  -d '{"name": "Project Name"}'
```
Response includes the board with 3 auto-created lists.

### Create a Card
```bash
curl -X POST http://localhost:8000/api/cards \
  -H "Content-Type: application/json" \
  -d '{"board_list_id": 1, "title": "Task", "label": "Backend", "assignee": "Name", "due_date": "2026-12-31"}'
```

### Move a Card
```bash
curl -X PUT http://localhost:8000/api/cards/1/move \
  -H "Content-Type: application/json" \
  -d '{"board_list_id": 2}'
```

### Delete a Board
```bash
curl -X DELETE http://localhost:8000/api/boards/1
```
This cascades: board → lists → cards all removed.

## Troubleshooting

### "List 'To Do' not found" Error
**Cause**: Frontend state is stale after board creation.
**Fix**: The `addCard()` function in `App.jsx` includes a fallback that refetches from API if `currentBoard.lists` is empty.

### Port Conflicts
**Symptom**: API returns wrong data structure (e.g., `cards` directly on boards instead of `lists`).
**Cause**: Multiple PHP servers running on different ports from different projects.
**Fix**: Kill stale processes and ensure the correct Laravel server is running on port 8000.

### Database Missing Records
**Symptom**: `board_lists` table is empty or missing default lists.
**Cause**: Migration not run or seeder not executed.
**Fix**: Run `php artisan migrate:fresh` then restart the server.

## Project Files

```
kanban/
├── backend/
│   ├── app/Http/Controllers/Api/KanbanController.php
│   ├── app/Models/{Board,BoardList,Card,User}.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── database/database.sqlite
├── frontend/
│   ├── src/App.jsx
│   ├── src/App.css
│   └── vite.config.js
└── README.md
```

## Setup Commands
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

cd ../frontend
npm install
npm run dev
```
