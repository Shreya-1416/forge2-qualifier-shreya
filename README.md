# Forge 2 Kanban Board

A modern full-stack Kanban Board application built with Laravel and React. The application helps users organize tasks, track workflow progress, manage project boards, and visualize productivity through an interactive drag-and-drop interface.

---

# Features

## Board Management

* Create multiple boards
* Switch between boards
* Organize project-specific tasks
* Track workflow separately for each board

## Task Management

* Create new task cards
* Edit task details
* Delete cards
* Search tasks instantly
* Assign labels and metadata

## Workflow Tracking

* To Do
* Doing
* Done

Tasks can be moved between stages using drag-and-drop functionality.

## Dashboard

* Total Tasks Counter
* Board Statistics
* Search & Filter Tasks
* Modern Dark Theme Interface
* Responsive Layout

---

# Tech Stack

## Frontend

| Technology        | Purpose           |
| ----------------- | ----------------- |
| React.js          | User Interface    |
| Vite              | Build Tool        |
| JavaScript        | Application Logic |
| CSS3              | Styling           |
| @hello-pangea/dnd | Drag & Drop       |

## Backend

| Technology   | Purpose             |
| ------------ | ------------------- |
| Laravel      | REST API            |
| PHP          | Backend Logic       |
| Eloquent ORM | Database Operations |

## Database

| Technology |
| ---------- |
| SQLite     |

---

# Live Demo

Frontend:

```text
https://forge2-qualifier-shreya.vercel.app/
```

Backend API:

```text
https://forge2-qualifier-shreya.onrender.com/api
```

---

# API Endpoints

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| GET    | /api/boards          | Get all boards   |
| GET    | /api/seed            | Seed sample data |
| POST   | /api/cards           | Create card      |
| PUT    | /api/cards/{id}      | Update card      |
| DELETE | /api/cards/{id}      | Delete card      |
| PUT    | /api/cards/{id}/move | Move card        |

---

# Project Structure

```text
forge2-qualifier-shreya/
├── backend/
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
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── skills/
├── slack-export/
├── ARCHITECTURE.md
├── agent-log.md
└── README.md
```

---

# Database Models

| Model     | Purpose                |
| --------- | ---------------------- |
| Board     | Main project container |
| BoardList | Workflow column        |
| Card      | Task item              |

Relationships:

```text
Board
 └── HasMany BoardList

BoardList
 └── HasMany Card

Card
 └── BelongsTo BoardList
```

---

# Local Setup

## Backend

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

## Frontend

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

# Current Functionality Checklist

* ✅ Create Cards
* ✅ Edit Cards
* ✅ Delete Cards
* ✅ Search Tasks
* ✅ Drag & Drop Workflow
* ✅ Board Statistics
* ✅ Responsive UI
* ✅ Multi-Board Support (Frontend)
* ✅ Persistent Card Movement

---

# Live URL

