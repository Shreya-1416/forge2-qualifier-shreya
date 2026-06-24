---

name: kanban-board-manager
description: Manage and maintain the Forge 2 Kanban Board application. Use this skill for tasks involving boards, task cards, drag-and-drop workflow, search functionality, task editing, statistics dashboard, and UI enhancements.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Kanban Board Manager Skill

## Purpose

Procedures and conventions for working on the Forge 2 Kanban Board project.

This application provides a modern task management system where users can create tasks, organize work, track progress, and manage workflow through a Kanban interface.

---

## Project Structure

```text
forge2-qualifier-shreya/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   └── KanbanController.php
│   │   └── Models/
│   │       ├── Board.php
│   │       ├── BoardList.php
│   │       └── Card.php
│   ├── database/migrations/
│   └── routes/api.php
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── skills/
│   └── status-report/
│       └── SKILL.md
│
├── slack-export/
├── ARCHITECTURE.md
├── agent-log.md
└── README.md
```

---

## Application Features

### Board Management

* Create boards
* Switch between boards
* Manage project-specific workflows
* Track task progress separately

### Task Management

* Create task cards
* Edit task information
* Delete cards
* Search tasks
* Update task details

### Workflow Management

The application supports three workflow stages:

```text
To Do
↓
Doing
↓
Done
```

Tasks can be moved between stages using drag-and-drop interactions.

---

## Frontend Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| React.js          | User Interface          |
| Vite              | Development Environment |
| JavaScript        | Application Logic       |
| CSS3              | Styling                 |
| React Hooks       | State Management        |
| @hello-pangea/dnd | Drag and Drop           |

---

## Backend Stack

| Technology     | Purpose             |
| -------------- | ------------------- |
| Laravel 12     | REST API            |
| PHP            | Backend Logic       |
| Eloquent ORM   | Database Operations |
| MySQL / SQLite | Data Storage        |

---

## API Endpoints

### Boards

```http
GET /api/boards
GET /api/seed
```

### Cards

```http
POST   /api/cards
PUT    /api/cards/{id}
DELETE /api/cards/{id}
PUT    /api/cards/{id}/move
```

---

## Models & Relationships

### Board

```text
Board
 └── HasMany BoardList
```

### BoardList

```text
BoardList
 ├── BelongsTo Board
 └── HasMany Card
```

### Card

```text
Card
 └── BelongsTo BoardList
```

---

## Common Development Tasks

### Start Backend

```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

Backend URL:

```text
http://localhost:8000
```

---

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Verification Checklist

Before submitting changes, verify:

* [ ] Board loads correctly
* [ ] Cards display properly
* [ ] Create card works
* [ ] Edit card works
* [ ] Delete card works
* [ ] Drag & drop works
* [ ] Search functionality works
* [ ] Statistics update correctly
* [ ] Responsive layout works
* [ ] API endpoints return valid responses

---

## UI Conventions

* Dark theme dashboard
* Glassmorphism-style panels
* Responsive card layout
* Interactive statistics section
* Search-first workflow
* Clean task organization

---

## Expected Outcome

The Kanban Board Manager skill provides a structured workflow system that enables efficient task tracking, board organization, progress monitoring, and project management through a modern web interface.
