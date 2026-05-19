# Climate-Disease Risk Analyzer
### Tool 1 | AIVONEX Technologies
<img width="1600" height="743" alt="WhatsApp Image 2026-05-19 at 3 25 19 PM" src="https://github.com/user-attachments/assets/a485c062-9c7a-435a-b192-6b1f777ced11" />
<img width="1600" height="709" alt="WhatsApp Image 2026-05-19 at 3 25 51 PM" src="https://github.com/user-attachments/assets/5d189513-7ba2-4886-9f3a-b10dfbbff725" />
<img width="1600" height="732" alt="WhatsApp Image 2026-05-19 at 3 26 19 PM" src="https://github.com/user-attachments/assets/02720f47-6aa4-40e3-99e5-f81f319b2965" />
<img width="1600" height="750" alt="WhatsApp Image 2026-05-19 at 3 38 44 PM" src="https://github.com/user-attachments/assets/c88c3d62-0161-4d69-a19e-fec988bbee9b" />

A professional AI-powered tool that analyzes district climate data and disease surveillance to predict outbreak risks 2–8 weeks in advance.

---

## Quick Start

### Step 1 — Get a Groq API Key (free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up and create an API key
3. Copy the key (starts with `gsk_...`)

### Step 2 — Set up the backend

```bash
cd backend
pip install -r requirements.txt
```

Open `backend/.env` and paste your key:
```
GROQ_API_KEY=gsk_your_actual_key_here
```

Start the API:
```bash
python run.py
```

### Step 3 — Set up the frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the app
Go to **http://localhost:5173** in your browser.

---

## How to use

**Option A — Upload CSV**
Upload a spreadsheet with district climate + disease data. See `frontend/public/sample_data.csv` for the expected format.

**Option B — Fill the Form**
Manually enter readings for any number of districts.

**Option C — Describe in Words**
Type a plain-language description like:
> "In Multan last week, temperature was 42°C, humidity 72%, 312 dengue cases up from 98 last year. What's the risk?"

You can also enter your Groq API key directly in the UI (top-right button) instead of the .env file.

---

## CSV Format

| Column | Description |
|--------|-------------|
| `district` | District name (e.g. Multan) |
| `date` | YYYY-MM-DD |
| `temperature_avg` | Average temperature in °C |
| `rainfall_mm` | Total rainfall in mm |
| `humidity_pct` | Humidity percentage |
| `disease_cases` | Reported cases this period |
| `disease_type` | dengue / malaria / diarrheal / respiratory / heat |
| `prev_year_cases` | Cases same period last year (optional) |
| `flood_level` | none / low / moderate / high (optional) |
| `aqi` | Air quality index (optional) |

---

## Tech Stack

- **Frontend**: React + Vite + Recharts
- **Backend**: Python Flask + Flask-CORS
- **AI**: Groq API — Llama 3.3 70B Versatile
- **Fonts**: Syne (display) + DM Sans (body) + DM Mono
- **Theme**: Dark, professional — CHILD-SAFE Pakistan brand colors

---

## Project Structure

```
childsafe/
├── backend/
│   ├── app.py           — Flask API with Groq integration
│   ├── run.py           — Startup script
│   ├── requirements.txt
│   └── .env             — Your Groq API key goes here
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── index.css     — Design system & global styles
    │   └── components/
    │       ├── Header.jsx
    │       ├── LandingScreen.jsx
    │       ├── AnalyzeScreen.jsx
    │       └── ResultsScreen.jsx
    ├── public/
    │   └── sample_data.csv
    └── package.json
```

---

* | Climate-Health IoT-Linked Disease Surveillance | AIVONEX Technologies*
