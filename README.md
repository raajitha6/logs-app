# 📚 Chronicle

*A personal reading tracker — like Letterboxd, but for books.*

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20progress-yellow)

---

## ✨ Features

- 🔍 Search books via the Open Library API, or add one manually
- ⭐ Log ratings, written reviews, and the date you read a book
- 📖 A readlist for what's next, with one-click "mark as read"
- 🗓️ Diary view grouped by month and day
- 🌗 Light / dark mode

## 🛠️ Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| Book data | Open Library API |

## 🚀 Running locally

**Backend**
```bash
cd backend
.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```
→ `http://127.0.0.1:8000` (docs at `/docs`)

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
→ `http://localhost:5173`

Requires a local PostgreSQL database and a `backend/.env` with your own `DATABASE_URL`.

## 🗺️ Roadmap

- [x] Sprint 0 — stack & setup
- [x] Sprint 1 — local MVP (CRUD, no backend)
- [x] Sprint 2 — FastAPI + PostgreSQL
- [x] Sprint 3 — auth & profiles
- [ ] Sprint 4 — social features
- [ ] Sprint 5 — deployment

---

*Built as a full-stack learning project.*
