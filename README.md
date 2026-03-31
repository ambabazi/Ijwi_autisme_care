#  Ijwi Autism Care

> Early autism screening platform for Rwanda — digitising the RBC STED tool for parents and community health workers across all 30 districts.

**Live URL:** https://ijwi-autism.ambabazi.tech  
**Author:** Agnes Mbabazi  
**Institution:** African Leadership University  
**Course:** Introduction to Software Engineering  
**Version:** 1.0 — 2026

---

## What Is This?

Ijwi Autism Care is a web-based platform that digitises Rwanda's Simplified Tool for Early Detection (STED), developed by the Rwanda Biomedical Centre (RBC). It allows parents and community health workers to screen children aged 0–72 months for developmental delays — without travelling to Kigali or paying for a specialist.

When a child misses 3 or more developmental milestones, the system automatically generates a referral note that the family can take to their nearest health centre.

---

## The Problem

In Rwanda, autism is frequently misattributed to spiritual causes or bad parenting, leading families to hide their children rather than seek care. Infrastructure gaps — especially in rural areas — mean that even families who want professional help face:

- No local screening tools
- High cost for specialist assessment
- A shortage of trained professionals outside Kigali
- Cultural stigma preventing early disclosure

**Sources:**
- University of Minnesota (2023). *Identifying Autism in Rwanda.* https://ici.umn.edu/news/identifying-autism-in-rwanda
- UNDP Rwanda (2024). *Don't despair, perhaps it's a different ability.* https://www.undp.org/rwanda/blog/dont-despair-perhaps-its-different-ability

---

## Features

| Feature | Description |
|---|---|
| Mobile STED Screening | Age-appropriate milestone questions for 6 age bands (0–72 months) |
| Traffic Light Results | Pass / Monitor / Refer result with clear explanation |
| Auto Referral Notes | Generated automatically when 3+ milestones are missed |
| Child Registration | Full child and guardian record with mandatory consent gate |
| District Dashboard | Health officers see national stats and referral rates by district |
| Awareness Content | Bilingual content (Kinyarwanda + English) reducing stigma |
| Role-Based Access | Parent / CHW / Health Officer / Admin views |
| Print Referral | One-click print of the referral note to take to health centre |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js v20, Express.js |
| Database | PostgreSQL (Neon cloud) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Testing | Jest + Supertest (13 automated tests) |
| Deployment | Render.com |
| Domain | ambabazi.tech (subdomain: ijwi-autism.ambabazi.tech) |

---

## Project Structure

```
ijwi-autism-care/
├── backend/
│   ├── server.js                   # Express entry point
│   ├── .env                        # Environment variables (not committed)
│   ├── database/
│   │   ├── db.js                   # PostgreSQL connection pool
│   │   └── schema.sql              # All 5 table definitions
│   ├── routes/
│   │   ├── auth.js                 # /api/auth — register, login, profile
│   │   ├── children.js             # /api/children — CRUD for child records
│   │   ├── screenings.js           # /api/screenings — submit, stats
│   │   └── referrals.js            # /api/referrals — fetch referrals
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile logic
│   │   ├── childrenController.js   # Child registration logic
│   │   └── screeningController.js  # Screening engine + referral logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect() + requireRole()
│   │   └── validate.js             # Input validation
│   └── tests/
│       ├── auth.test.js            # 5 auth tests
│       ├── children.test.js        # 5 children tests
│       └── screening.test.js       # 3 referral threshold tests
├── frontend/
│   ├── index.html                  # Landing page
│   ├── login.html                  # Login form
│   ├── register.html               # Account creation
│   ├── register-child.html         # Child registration (role-aware)
│   ├── dashboard.html              # Role-based dashboard
│   ├── screening.html              # STED milestone screening
│   ├── results.html                # Traffic light results + referral
│   ├── awareness.html              # Bilingual autism education
│   ├── test-plan.html              # 22-case manual test plan
│   ├── css/styles.css              # All styling
│   └── js/
│       ├── api.js                  # Fetch wrapper + auth state
│       ├── auth.js                 # Dynamic navigation bar
│       ├── register.js             # Shared form utilities + districts
│       └── screening.js            # STED engine (age groups + questions)
├── render.yaml                     # Render.com deployment config
├── SPRINT_LOG.md                   # Agile sprint history
└── README.md
```

---

## Local Setup — Step by Step

### Prerequisites

| Tool | Version | How to check |
|---|---|---|
| Node.js | v20 or higher | `node -v` |
| npm | v10 or higher | `npm -v` |
| Git | any | `git --version` |

### Linux / macOS

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ijwi-autism-care.git
cd ijwi-autism-care

# 2. Install backend dependencies
cd backend
npm install

# 3. Create environment file
touch .env
```

Add this to `.env`:

```
PORT=3000
JWT_SECRET=any_secret_string_you_choose
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Replace `DATABASE_URL` with your Neon connection string (see Database Setup below).

```bash
# 4. Start the development server
npm run dev

# Expected output:
# Database schema ready
# Ijwi server running on http://localhost:3000
```

### Windows (PowerShell as Administrator)

```powershell
# Install Node.js from https://nodejs.org (LTS version)
# Install Git from https://git-scm.com/download/win

git clone https://github.com/YOUR_USERNAME/ijwi-autism-care.git
cd ijwi-autism-care/backend
npm install

# Create .env file
New-Item .env -ItemType File
# Open in Notepad and paste the environment variables above

npm run dev
```

---

## Database Setup (Neon — Free)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project named `ijwi-autism-care`
3. Click **Connection string** → change dropdown to **Node.js**
4. Copy the connection string
5. Paste it as `DATABASE_URL=...` in your `.env` file

The schema creates all 5 tables automatically on first run.

---

## Running Tests

```bash
cd backend
npm test
```

Expected output:

```
PASS tests/auth.test.js
  Auth API
    ✓ POST /api/auth/register — should create a new user
    ✓ POST /api/auth/register — should reject duplicate email
    ✓ POST /api/auth/login — should login with correct credentials
    ✓ POST /api/auth/login — should reject wrong password
    ✓ POST /api/auth/register — should reject missing fields

PASS tests/children.test.js
  Children API
    ✓ POST /api/children — should register a child with consent
    ✓ POST /api/children — should reject missing consent
    ✓ GET /api/children — should return list of children
    ✓ GET /api/children — should reject unauthenticated request
    ✓ POST /api/children — should reject child older than 72 months

PASS tests/screening.test.js
  Screening referral threshold logic
    ✓ Should return status "pass" when 0 No responses
    ✓ Should return status "monitor" when 2 No responses
    ✓ Should auto-generate referral when 3+ No responses

Test Suites: 3 passed
Tests:       13 passed
```

---

## API Endpoints

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Create new account |
| POST | `/api/auth/login` | None | Login, receive JWT |
| GET | `/api/auth/profile` | Required | Get current user profile |

**Register request body:**
```json
{
  "name": "Agnes Mbabazi",
  "email": "agnes@example.com",
  "password": "password123",
  "role": "parent",
  "district": "Gasabo"
}
```

**Login request body:**
```json
{ "email": "agnes@example.com", "password": "password123" }
```

**Response (both):**
```json
{ "token": "eyJ...", "role": "parent", "name": "Agnes Mbabazi" }
```

---

### Children

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/children` | Required | Any | Register a child |
| GET | `/api/children` | Required | Any | Get own children |
| GET | `/api/children/all` | Required | health_officer, admin | Get all children |
| GET | `/api/children/:id` | Required | Any | Get one child |

**Register child request body:**
```json
{
  "full_name": "Jean Pierre",
  "gender": "male",
  "date_of_birth": "2023-06-15",
  "district": "Musanze",
  "consent_given": true,
  "guardian_name": "Marie Claire",
  "guardian_phone": "0788123456",
  "guardian_relationship": "mother"
}
```

---

### Screenings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/screenings` | Required | Submit a screening |
| GET | `/api/screenings/stats` | health_officer, admin | National statistics |
| GET | `/api/screenings/child/:id` | Required | Screenings for one child |
| GET | `/api/screenings/:id` | Required | Screening detail |

**Submit screening request body:**
```json
{
  "child_id": 1,
  "responses": [
    { "milestone_id": "M_7_1", "domain": "Motor", "response": 1 },
    { "milestone_id": "M_7_2", "domain": "Social", "response": 0 },
    { "milestone_id": "M_7_3", "domain": "Communication", "response": 0 },
    { "milestone_id": "M_7_4", "domain": "Cognitive", "response": 0 }
  ]
}
```

**Response:**
```json
{
  "screening_id": 4,
  "status": "refer",
  "no_count": 3,
  "age_in_months": 9,
  "referral": {
    "id": 2,
    "note": "REFERRAL NOTE — Ijwi Autism Care\nChild: Jean Pierre..."
  }
}
```

**Referral threshold:**
- `0 No` → `pass` (green) — no referral
- `1–2 No` → `monitor` (orange) — no referral
- `3+ No` → `refer` (red) — referral auto-generated

---

### Referrals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/referrals` | Required | Own referrals (or all for officers) |
| GET | `/api/referrals/:id` | Required | One referral |

---

## Agile Sprint Log

| Sprint | Goal | Key Output |
|---|---|---|
| 1 | Foundation | Folder structure, PostgreSQL schema, Git, .env |
| 2 | Backend API | Auth, children, screening, referral — 13 tests passing |
| 3 | Frontend | All 8 screens connected to live API |
| 4 | Testing | 13 automated + 22 manual test cases |
| 5 | Deployment | Live on Render, custom domain, README |

Full details: see `SPRINT_LOG.md`

---

## Roles and What They See

| Role | Dashboard | Can Register Children | Sees All Children |
|---|---|---|---|
| Parent | Own children + referrals | Yes (as guardian) | No |
| CHW | Screened children + referral table | Yes (records guardian separately) | No |
| Health Officer | National stats + district referral rates | No | Yes |
| Admin | National stats + all data | Yes | Yes |

---

## Screening Age Bands

| Age Band | Questions | Domains Covered |
|---|---|---|
| 0–6 months | 7 | Motor, Social, Communication, Sensory |
| 7–12 months | 9 | Motor, Social, Communication, Cognitive |
| 13–24 months | 10 | Motor, Social, Communication, Cognitive |
| 25–36 months | 10 | Motor, Social, Communication, Cognitive |
| 37–60 months | 11 | Motor, Social, Communication, Cognitive |
| 61–72 months | 12 | Motor, Social, Communication, Cognitive, Sensory |

---

## Deployment (Render)

The app is deployed using `render.yaml`. Render reads this file and auto-deploys on every `git push`.

```yaml
services:
  - type: web
    name: ijwi-autism-care
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
```

The `DATABASE_URL` is set manually in the Render dashboard environment variables (pointing to Neon PostgreSQL).

---

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds) — never stored in plain text
- JWT tokens expire after 7 days
- All child data requires guardian consent (`consent_given = 1`) before being stored
- All API calls use HTTPS in production
- Role-based access control enforced on every protected route

---

## Disclaimer

Ijwi Autism Care is a **screening tool for early detection only**. It is **not** an official medical diagnosis. All results must be confirmed by a qualified healthcare professional.
