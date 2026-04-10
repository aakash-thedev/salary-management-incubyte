# Incubyte Salary Management Platform

A full-stack salary management tool built as a technical assessment for **Incubyte**. Designed for HR Managers to manage 10,000+ employee records and gain salary insights across a global workforce.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://salary-management-incubyte.vercel.app |
| Backend API | https://salary-management-api-2upj.onrender.com |

---

## Features

### Employee Management
- Paginated table of 10,000+ employees (25 per page) with server-side filtering
- Search by name, filter by country and employment type — all filters compose together
- Add, edit, and delete employees via a validated form with a confirmation dialog
- **Employee detail page** — individual salary benchmarks comparing against country average and role average (% above/below), tenure badge, and full profile

### Salary Insights Dashboard
- Country selector — all metrics update to the selected country's **local currency**
- Key stats: min, max, average, and median salary (SQL-computed via `PERCENTILE_CONT`)
- Employment type breakdown — headcount, % share, and average salary per type
- Department summary — headcount and average salary per department
- Job title breakdown — inline row selection (click a row to inspect avg salary — zero API calls)
- Top 5 highest earners in the selected country

### First-Time Experience
- **Branded landing page** — Incubyte hero with animated feature cards and a "Get Started" CTA
- **Loading transition** — 3-step animated loader on first entry to the dashboard
- **One-time onboarding** — 4-step guided tooltip tour teaching navigation, employee detail, filters, and the Add Employee button. Saved to `localStorage` — never repeats.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Ruby on Rails 8 (API-only mode) |
| Database | PostgreSQL |
| Backend tests | RSpec + FactoryBot |
| Frontend | React 19 + TypeScript (strict) |
| Build tool | Vite |
| UI | Tailwind CSS v4 + ShadCN UI |
| Server state | TanStack React Query |
| HTTP client | Axios |
| Icons | Lucide React |

---

## Testing Approach

> **TDD was strictly followed on the backend.** Every feature was driven by the RED → GREEN → REFACTOR cycle using RSpec. No production code was written before a failing test existed.
>
> **The frontend followed component-driven development with manual verification.** Given the nature of UI development and the assessment timeline, React components were built and verified visually using the Vite dev server rather than through an upfront test-first workflow. This is an intentional trade-off, not an oversight.

### Backend Test Coverage

```
58 examples, 0 failures
```

Tests cover:
- Model validations (required fields, salary > 0, employment type enum)
- `SalaryInsightsService` — all aggregation methods (stats, median, employment type breakdown, department summary, top earners, primary currency)
- Request specs — full API surface: pagination, filtering (country, employment type, search, combined), CRUD, comparison data, 404 handling
- Countries and job titles endpoints

Run tests:
```bash
cd backend
bundle exec rspec
```

---

## Local Development Setup

### Prerequisites

- Ruby 3.3+
- Node.js 20+
- PostgreSQL 14+

### Backend

```bash
cd backend

# Install dependencies
bundle install

# Create and migrate the database
rails db:create db:migrate

# Seed 10,000 employees (~2–5 seconds via bulk insert)
rails db:seed

# Start the API server on port 3000
rails server
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server on port 5173
npm run dev
```

The frontend expects the Rails API at `http://localhost:3000`. This is configured in `frontend/src/services/api.ts`.

---

## API Reference

All endpoints are under `/api/v1/`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees` | Paginated list. Params: `page`, `country`, `employment_type`, `search` |
| `POST` | `/employees` | Create employee |
| `GET` | `/employees/:id` | Employee + salary comparison data |
| `PUT` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `GET` | `/employees/countries` | Distinct country list (sorted) |
| `GET` | `/employees/job_titles` | Distinct job title list (sorted) |
| `GET` | `/insights?country=India` | Salary insights for a country |

### Sample Insights Response

```json
{
  "country": "India",
  "currency": "INR",
  "headcount": 834,
  "avg_salary": 2450000.0,
  "min_salary": 420000.0,
  "max_salary": 4980000.0,
  "median_salary": 2310000.0,
  "employment_type_breakdown": [...],
  "department_summary": [...],
  "top_earners": [...],
  "salary_by_job_title": [...]
}
```

---

## Database Schema

```sql
CREATE TABLE employees (
  id              BIGSERIAL PRIMARY KEY,
  full_name       VARCHAR NOT NULL,
  job_title       VARCHAR NOT NULL,
  department      VARCHAR,
  country         VARCHAR NOT NULL,
  salary          DECIMAL(12,2) NOT NULL CHECK (salary > 0),
  currency        VARCHAR DEFAULT 'USD',
  employment_type VARCHAR DEFAULT 'full_time',
  hired_on        DATE,
  created_at      TIMESTAMP NOT NULL,
  updated_at      TIMESTAMP NOT NULL
);

CREATE INDEX idx_employees_country          ON employees(country);
CREATE INDEX idx_employees_job_title        ON employees(job_title);
CREATE INDEX idx_employees_country_job_title ON employees(country, job_title);
```

---

## Seed Data

The seed script (`backend/db/seeds.rb`) generates 10,000 employees using name lists from `first_names.txt` and `last_names.txt`, distributed across 12 countries with **realistic local-currency salary ranges**:

| Country | Currency | Salary Range |
|---|---|---|
| United States | USD | $50K – $200K |
| India | INR | ₹4L – ₹50L |
| United Kingdom | GBP | £28K – £120K |
| Germany | EUR | €38K – €150K |
| Japan | JPY | ¥4M – ¥20M |
| South Korea | KRW | ₩35M – ₩150M |
| Canada | CAD | CA$50K – CA$200K |
| Australia | AUD | A$55K – A$220K |
| Singapore | SGD | S$48K – S$200K |
| France | EUR | €32K – €130K |
| Netherlands | EUR | €35K – €140K |
| Brazil | BRL | R$48K – R$480K |

Seeding uses `insert_all` for bulk performance — 10,000 records in ~2–5 seconds.

---

## Project Structure

```
salary-management-incubyte/
├── backend/                    # Rails API
│   ├── app/
│   │   ├── controllers/api/v1/ # Employees + Insights controllers
│   │   ├── models/             # Employee model + validations
│   │   └── services/           # SalaryInsightsService
│   ├── db/
│   │   ├── migrate/            # Schema migrations
│   │   └── seeds.rb            # 10K employee seed script
│   └── spec/                   # RSpec tests (58 examples)
│
├── frontend/                   # React + Vite SPA
│   └── src/
│       ├── components/         # EmployeeTable, EmployeeForm, InsightCards, etc.
│       ├── hooks/              # useEmployees, useInsights (React Query)
│       ├── pages/              # LandingPage, EmployeesPage, EmployeeDetailPage, InsightsPage
│       ├── services/           # api.ts (Axios)
│       └── types/              # TypeScript interfaces
│
└── docs/
    ├── PLANNING.md             # Product scope and feature decisions
    ├── ARCHITECTURE.md         # System design and technology choices
    ├── TRADEOFFS.md            # Key trade-off decisions with reasoning
    └── AI_USAGE.md             # How AI assistance was used in this project
```

---

## Key Engineering Decisions

1. **All salary aggregations run at the database level** (SQL `AVG`, `MIN`, `MAX`, `PERCENTILE_CONT`) — not in Ruby. Critical for performance with large datasets.

2. **Service object pattern** — `SalaryInsightsService` encapsulates all analytics logic, keeping the controller thin and the service unit-testable.

3. **Local currency per country** — The insights API detects the primary currency for the selected country and all frontend components format accordingly. An Indian HR Manager sees ₹ — not $.

4. **Inline job title selection** — Instead of a top-level dropdown that refetches the API on every change, clicking a job title row highlights it client-side. Zero extra network requests.

5. **Semantic HTML for navigation** — Employee names in the table use `<Link>` (anchor elements) rather than `<button>` with `onClick`, enabling right-click, cmd+click, and proper screen-reader semantics.

For full reasoning on each decision, see [`docs/TRADEOFFS.md`](docs/TRADEOFFS.md).

---

## Commit History

The commit history is intentionally structured to tell a clear story of incremental development, following conventional commit conventions:

- `test:` — failing spec written first (TDD red phase)
- `feat:` — feature implementation (green phase)
- `refactor:` — improvements without behavior change
- `fix:` — bug fixes
- `docs:` — documentation updates
- `chore:` — configuration and tooling

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/PLANNING.md`](docs/PLANNING.md) | Feature scope, user persona, success criteria |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System design, schema, API, tech stack rationale |
| [`docs/TRADEOFFS.md`](docs/TRADEOFFS.md) | 9 key trade-off decisions with explicit reasoning |
| [`docs/AI_USAGE.md`](docs/AI_USAGE.md) | Transparent breakdown of how AI assistance was used |
