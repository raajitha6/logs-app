# Personal reading tracker app

A full-stack app for logging books you've read, rating and reviewing them, and keeping a readlist for what's next — built as a learning project to go from a local, in-browser prototype to a properly deployed full-stack application.

Inspired by Letterboxd, but for books.

## What it does

- Search for a book via the Open Library API, or add one manually
- Log a book with a star rating, written review, and the date you read it
- Keep a separate readlist for books you want to read, with a one-click "mark as read" to move it into your diary
- Browse your diary grouped by month and day, or switch your readlist between a grid and list view
- Light/dark mode

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **Database:** PostgreSQL, via SQLAlchemy + Alembic for migrations
- **Other:** Open Library API for book search and cover art

## Why this stack

Built to strengthen a Python/FastAPI/REST foundation while learning React and modern frontend patterns, as part of an Agile-style, sprint-based build:

- Sprint 0: requirements, stack decision, environment setup
- Sprint 1: a working local MVP (CRUD, no database — React state + localStorage)
- Sprint 2: a real database layer (this part — FastAPI + PostgreSQL replacing localStorage)
- Sprint 3+: auth, profiles, social features, and deployment

## Running it locally

**Backend**
```bash
cd backend
.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000` (interactive docs at `/docs`).

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

You'll need a local PostgreSQL database and a `backend/.env` file with your own `DATABASE_URL` (see `database.py`).

## Status

Actively in progress — currently wiring the frontend to the real backend (Sprint 2).