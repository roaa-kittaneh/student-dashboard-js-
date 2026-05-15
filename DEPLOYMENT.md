# Deployment — Frontend on Vercel, Backend on Render

The frontend and backend deploy independently. The frontend's `VITE_API_URL` must point at the deployed Render URL, and the backend's `CORS_ORIGINS` must allow the Vercel domain. Deploy the **backend first**, then plug its URL into the frontend.

---

## 1. Backend → Render

### 1.1 Prepare the repo

Keep `backend/` as a directory inside your monorepo, or push it as its own repo. Ensure `requirements.txt` and `wsgi.py` exist (they do).

> **SQLite caveat**: Render's free tier filesystem is **ephemeral** — every redeploy wipes the DB. For real apps, swap to managed Postgres. For a school project it's fine, but read §1.5.

### 1.2 Create the service

1. Sign in to <https://render.com> → **New +** → **Web Service**.
2. Connect your GitHub repo (grant access to the repository).
3. Configure:
   - **Name**: `student-dashboard-api`
   - **Region**: closest to your users.
   - **Branch**: `main`
   - **Root Directory**: `backend` (if monorepo).
   - **Runtime**: `Python 3`.
   - **Build Command**:
     ```
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```
     gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 60
     ```
   - **Instance Type**: Free (or Starter for always-on).

### 1.3 Environment variables (Render dashboard → Environment)

Generate strong secrets first:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

| Key                | Example value                                      |
|--------------------|----------------------------------------------------|
| `SECRET_KEY`       | *(64-char hex from the command above)*             |
| `JWT_SECRET`       | *(another 64-char hex — different from SECRET_KEY)*|
| `JWT_EXPIRES_HOURS`| `12`                                               |
| `DATABASE_URL`     | `sqlite:////var/data/students.db` (see §1.5) or your Postgres URL |
| `CORS_ORIGINS`     | `https://<your-app>.vercel.app` (add custom domains comma-separated) |
| `ADMIN_EMAIL`      | `admin@example.com`                                |
| `ADMIN_PASSWORD`   | *(rotate this — never ship `admin123` to prod)*    |
| `PYTHON_VERSION`   | `3.11.9`                                           |

### 1.4 Deploy

Click **Create Web Service**. First build takes ~3–5 min. When it's live:
```bash
curl https://<your-api>.onrender.com/api/health
# → {"status":"ok"}
```
Copy this base URL — you'll paste it into Vercel next.

### 1.5 (Optional) Persistent SQLite via Render Disk

If you must stick with SQLite:
1. In the service → **Disks** → **Add Disk**.
2. Name: `data`, Mount path: `/var/data`, Size: `1 GB`.
3. Set `DATABASE_URL=sqlite:////var/data/students.db`.

Better long-term: provision a free Render Postgres, set `DATABASE_URL=postgresql://...`, and add `psycopg2-binary` to `requirements.txt`. SQLAlchemy will switch dialects without code changes.

### 1.6 Free tier cold starts
The free instance sleeps after ~15 min of inactivity, adding ~30 s to the first request. Upgrade to Starter, or hit `/api/health` from an uptime monitor (UptimeRobot, Better Stack) every 5 min.

---

## 2. Frontend → Vercel

### 2.1 Create the project

1. <https://vercel.com> → **Add New → Project** → import the same GitHub repo.
2. Configure:
   - **Root Directory**: `frontend`.
   - **Framework Preset**: **Vite** (auto-detected).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
   - **Install Command**: `npm install` (default).

### 2.2 Environment variables

Project → **Settings → Environment Variables**:

| Key             | Value                                          | Environments              |
|-----------------|------------------------------------------------|---------------------------|
| `VITE_API_URL`  | `https://<your-api>.onrender.com/api`          | Production, Preview, Dev  |

Vite inlines `VITE_*` vars at build time — any change requires a **redeploy**, not just a runtime restart.

### 2.3 SPA rewrites (React Router)

Create `frontend/vercel.json` so deep links (`/dashboard/students/3/edit`) don't 404 on hard refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### 2.4 Deploy

Push to `main` → Vercel builds and assigns `https://<your-app>.vercel.app`. Verify:
1. Hit the URL — login screen loads.
2. Open DevTools → Network → log in. The request goes to your Render URL, status `200`.
3. If you see `CORS error`: go back to Render and add the exact Vercel origin to `CORS_ORIGINS`, redeploy.

### 2.5 Custom domain

Project → **Domains** → add `studentops.yourdomain.com` and follow the DNS instructions. Add the new origin to Render's `CORS_ORIGINS` and redeploy.

---

## 3. Post-deploy security checklist

- [ ] Rotated `ADMIN_PASSWORD` to a strong unique value.
- [ ] `JWT_SECRET` and `SECRET_KEY` are 32+ byte hex, **different** values.
- [ ] `CORS_ORIGINS` lists only your real frontend origins — no wildcards.
- [ ] Render service is on **HTTPS** (default).
- [ ] If using SQLite + Render Disk, you've taken at least one manual backup.
- [ ] Frontend `VITE_API_URL` uses **https://**, never http.

## 4. CI smoke test (optional)

A minimal GitHub Action that hits both endpoints after deploy:

```yaml
name: smoke
on: { workflow_dispatch: {} }
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS https://<api>.onrender.com/api/health
      - run: curl -fsS https://<app>.vercel.app | grep -q "<title>"
```

---

## 5. Common failure modes

| Symptom                                          | Cause                                  | Fix                                                                 |
|--------------------------------------------------|----------------------------------------|---------------------------------------------------------------------|
| Login button spins, console shows CORS error     | `CORS_ORIGINS` missing Vercel origin   | Add it, redeploy backend.                                           |
| `401 invalid_or_expired_token` after 12h         | JWT expired                            | Log in again; or raise `JWT_EXPIRES_HOURS`.                         |
| Data gone after each Render redeploy             | SQLite on ephemeral disk               | Use Render Disk (§1.5) or move to Postgres.                         |
| Hard refresh on `/dashboard/students` → 404      | Missing SPA rewrite                    | Add `frontend/vercel.json` (§2.3) and redeploy.                     |
| Frontend stuck on old `VITE_API_URL`             | Env var changed but no rebuild         | Vercel → Deployments → **Redeploy**.                                |
| Render service randomly slow                     | Free-tier cold start                   | Upgrade to Starter or ping `/api/health` periodically.              |
