# Student Management Dashboard

Full-stack student management application — **React + Vite + Tailwind** frontend with a **Flask + SQLite** API. JWT auth, protected routes, debounced search, server-side filters and pagination, dark mode, and toast notifications.

## Architecture

```
student-dashboard/
├── backend/                  # Flask API (auth + students CRUD)
│   ├── app.py                # App factory + seeding
│   ├── config.py             # Env-driven config
│   ├── models.py             # SQLAlchemy: User, Student
│   ├── auth.py               # JWT issue + require_auth decorator
│   ├── routes_auth.py        # POST /api/auth/login
│   ├── routes_students.py    # CRUD + search/filter/paginate
│   ├── wsgi.py               # Gunicorn entrypoint
│   └── requirements.txt
└── frontend/                 # Vite + React 18
    └── src/
        ├── api/              # axios client + endpoint wrappers
        ├── components/       # Button, Input, Modal, Toast, Table, Form…
        ├── context/          # Auth, Theme (dark mode), Toast
        ├── hooks/            # useAuth, useStudents, useDebounce, useTheme, useToast
        ├── pages/            # Login, Overview, Students, Add, Edit
        ├── routes/AppRoutes.jsx
        ├── utils/validators.js
        ├── App.jsx
        └── main.jsx
```

## Setup instructions

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate     Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # then edit secrets
python app.py              # http://localhost:5000
```

Seed runs idempotently on first boot — admin user + 5 demo students.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                # http://localhost:5173
```

Vite proxies `/api` -> `http://localhost:5000`, so CORS doesn't trip you up locally.

## Environment variables

### Backend

Create `backend/.env` for local overrides:

```env
SECRET_KEY=dev-secret-change-me
JWT_SECRET=dev-jwt-secret-change-me
JWT_EXPIRES_HOURS=12
DATABASE_URL=sqlite:///students.db
CORS_ORIGINS=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Frontend

Create `frontend/.env` if the API is not served through the default Vite proxy:

```env
VITE_API_URL=/api
```

### Demo Credentials

```
admin@example.com
admin123
```

## API Reference

| Method | Endpoint                       | Auth | Notes                                     |
|--------|--------------------------------|------|-------------------------------------------|
| POST   | `/api/auth/login`              | —    | Returns `{ token, user }`                 |
| GET    | `/api/students`                | JWT  | Query: `q`, `department`, `status`, `page`, `pageSize` |
| GET    | `/api/students/:id`            | JWT  |                                           |
| POST   | `/api/students`                | JWT  | Body uses camelCase (`firstName` etc.)    |
| PUT    | `/api/students/:id`            | JWT  | Partial update supported                  |
| DELETE | `/api/students/:id`            | JWT  |                                           |
| GET    | `/api/students/meta/departments` | JWT | Distinct list for filter dropdown        |
| GET    | `/api/health`                  | —    | Liveness probe                            |

### Student payload

```json
{
  "id": 1,
  "firstName": "Ahmad",
  "lastName": "Saleh",
  "email": "ahmad@example.com",
  "age": 21,
  "department": "Engineering",
  "status": "active"
}
```

`status` ∈ `active | inactive | graduated`.

## Engineering Notes

- **JWT** stored in `localStorage` and injected by an axios request interceptor. A response interceptor broadcasts an `auth:unauthorized` event on `401`, which the `AuthContext` listens to for global logout — clean decoupling.
- **`useStudents`** owns server pagination, filters, and CRUD invalidation. A monotonically increasing `reqId` ref discards stale responses when filters change mid-flight.
- **`useDebounce`** keeps search keystrokes from flooding the API.
- **Validation** is double-layered: client-side (`validators.js`) for UX, server-side (`_validate_payload`) as the source of truth.
- **Email uniqueness** at the DB layer; `IntegrityError` is mapped to `409 email_already_exists`.
- **Dark mode** via Tailwind's `class` strategy + `ThemeContext`, with `prefers-color-scheme` fallback.
- **Bcrypt** password hashing.

See `DEPLOYMENT.md` for production deployment.
