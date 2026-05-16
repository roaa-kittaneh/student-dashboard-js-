# Student Management Dashboard

Full-stack student management application — **React + Vite + Tailwind** frontend with a **Flask + SQLite** API. JWT auth, protected routes, debounced search, server-side filters and pagination, dark mode, and toast notifications.

###project link
(https://student-dashboard-js.vercel.app)

###live demo
https://drive.google.com/drive/folders/1eLSkVbl5On73m3AY8wvEuNHq1_AICxn6?usp=sharing

### screenshots
<img width="1335" height="573" alt="Screenshot 2026-05-16 205413" src="https://github.com/user-attachments/assets/2e778509-29f7-4c04-b070-6753605990e8" />
<img width="1328" height="566" alt="Screenshot 2026-05-16 205422" src="https://github.com/user-attachments/assets/62fd267d-de0d-462f-8bb3-1b5096739421" />
<img width="1332" height="553" alt="Screenshot 2026-05-16 205450" src="https://github.com/user-attachments/assets/4f7e4ea3-f6ae-4bd8-aad1-1236db6c54ca" />
<img width="1324" height="552" alt="Screenshot 2026-05-16 205504" src="https://github.com/user-attachments/assets/6a54ba6a-b071-4312-b3ff-424f7f46d2fe" />
<img width="1341" height="584" alt="Screenshot 2026-05-16 205520" src="https://github.com/user-attachments/assets/707b20c2-cd59-46ff-8945-c30535c46afe" />
<img width="1334" height="566" alt="Screenshot 2026-05-16 205527" src="https://github.com/user-attachments/assets/97d4a319-1d34-4287-8d71-587748a6349e" />
<img width="558" height="536" alt="Screenshot 2026-05-16 205546" src="https://github.com/user-attachments/assets/6a993975-01f4-4a7b-a6fd-51adabf8334d" />
<img width="532" height="260" alt="image" src="https://github.com/user-attachments/assets/1abac7a5-d54b-4962-be66-98180061e517" />
<img width="784" height="526" alt="image" src="https://github.com/user-attachments/assets/e26c51b7-2c7f-4212-83e0-c6413f40658c" />

<img width="1365" height="168" alt="Screenshot 2026-05-16 205359" src="https://github.com/user-attachments/assets/42d9ab32-59ee-4e71-b971-5a6e065ef2b1" />
<img width="677" height="277" alt="Screenshot 2026-05-15 225256" src="https://github.com/user-attachments/assets/0ba7fef1-370f-4c2f-a2b5-5c2e51fb1adb" />
<img width="673" height="254" alt="Screenshot 2026-05-16 000303" src="https://github.com/user-attachments/assets/427f5aa4-ffea-432a-8ed8-0ad00bbf516d" />
<img width="993" height="418" alt="Screenshot 2026-05-16 014444" src="https://github.com/user-attachments/assets/2053913b-1461-4e57-b53b-863272eda2b7" />
<img width="1093" height="449" alt="image" src="https://github.com/user-attachments/assets/939ad306-fb7a-4096-a1c2-b8c17a532aaa" />









```
### Backend Wake-Up Delay

The backend is hosted on Render's free plan, so it may sleep after inactivity. The first request can be slow and may cause a temporary timeout. To wake the backend, visit:

```text
https://student-dashboard-js.onrender.com/api/health
After it returns {"status":"ok"}, refresh the frontend and try again.






## Setup instructions

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate     Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp  .env      
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




### Demo Credentials

```
admin@example.com
admin123
```




See `DEPLOYMENT.md` for production deployment.
