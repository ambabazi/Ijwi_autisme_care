# Ijwi Autism Care

Early autism screening platform for Rwanda — built for the Software Engineering course at African Leadership University.

**Live URL:** (https://ijwi-autisme-care.onrender.com/)      
**Author:** Agnes Mbabazi  
**Institution:** African Leadership University  
**Version:** 1.0

---

## What it does

Ijwi digitises the Rwanda Biomedical Centre STED (Simplified Tool for Early Detection) screening tool, making it accessible to parents and community health workers across Rwanda — including rural areas. It provides:

- Mobile-friendly STED developmental screening (ages 0–72 months)
- Automatic referral generation when 3 or more milestones are not met
- Traffic light results (green / orange / red)
- Child progress tracking
- Awareness content in Kinyarwanda and English
- Role-based access for parents, community health workers, and health officers

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Authentication | JWT + bcryptjs |
| Frontend | HTML, CSS, Vanilla JS |
| Testing | Jest + Supertest |
| Deployment | Render |

---

## Local setup — step by step

### Prerequisites
- Node.js v20 or higher
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ijwi-autism-care.git
cd ijwi-autism-care
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Create environment file
```bash
touch .env
```

Add this to `.env`:
```
PORT=3000
JWT_SECRET=any_secret_string_you_choose
NODE_ENV=development
```

### 4. Start the server
```bash
npm run dev
```

### 5. Open the app

Visit `http://localhost:3000` in your browser.

### 6. Run tests
```bash
npm test
```

Expected: 13 tests passing across 3 test suites.

---

## Project structure
```
ijwi-autism-care/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── database/
│   │   ├── db.js              # SQLite connection
│   │   └── schema.sql         # All table definitions
│   ├── routes/                # API route definitions
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth + validation
│   └── tests/                 # Jest test suites
├── frontend/
│   ├── index.html             # Landing page
│   ├── login.html
│   ├── register.html
│   ├── register-child.html
│   ├── dashboard.html
│   ├── screening.html
│   ├── results.html
│   ├── awareness.html
│   ├── test-plan.html
│   ├── css/styles.css
│   └── js/
│       ├── api.js             # Fetch wrapper + auth helpers
│       ├── auth.js            # Nav rendering
│       ├── register.js        # Shared form utilities
│       └── screening.js       # STED screening engine
├── SPRINT_LOG.md              # Agile sprint documentation
├── render.yaml                # Deployment config
└── README.md
```

---

## Agile development

This project was built using Agile methodology across 5 sprints:

| Sprint | Focus | Duration |
|---|---|---|
| 1 | Project setup, folder structure, database schema | Day 1 |
| 2 | Backend API, authentication, screening logic, tests | Day 2 |
| 3 | Full frontend UI — all 8 screens | Day 3 |
| 4 | Testing — 13 automated + 22 manual test cases | Day 4 |
| 5 | Deployment to Render, README, submission | Day 5 |

Full sprint log with acceptance criteria: see `SPRINT_LOG.md`

---

## Referral logic

The system shall automatically generate a referral note when **3 or more** milestone responses are marked "No" in a single screening session.

- 0 No → 🟢 Pass — developing well
- 1–2 No → 🟡 Monitor — schedule follow-up
- 3+ No → 🔴 Refer — referral note auto-generated

---

## Disclaimer

Ijwi is a screening tool for early detection only. It is **not** an official medical diagnosis. A qualified healthcare professional must confirm any result.
