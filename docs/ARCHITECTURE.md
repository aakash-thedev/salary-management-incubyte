# Architecture Document — Salary Management Tool

## System Overview

```
┌──────────────────┐         HTTP/JSON          ┌──────────────────┐
│                  │  ◄─────────────────────►    │                  │
│  React Frontend  │       /api/v1/*             │  Rails API       │
│  (Vercel)        │                             │  (Render)        │
│                  │                             │                  │
└──────────────────┘                             └────────┬─────────┘
                                                          │
                                                          │ ActiveRecord
                                                          │
                                                 ┌────────▼─────────┐
                                                 │                  │
                                                 │  PostgreSQL      │
                                                 │  (Render)        │
                                                 │                  │
                                                 └──────────────────┘
```

## Technology Choices

### Why Rails API-Only for Backend?

- **Convention over configuration** — Rails provides a well-defined structure out of the box: models, controllers, migrations, seeds, and test scaffolding. This reduces decision fatigue and speeds up development.
- **API-only mode** — Strips out unnecessary middleware (views, asset pipeline, cookies) resulting in a leaner, faster application purpose-built for JSON APIs.
- **ActiveRecord** — Provides a powerful query interface that maps cleanly to SQL aggregations needed for salary insights. No ORM impedance mismatch.
- **RSpec ecosystem** — Mature testing framework with FactoryBot, request specs, and a strong convention for TDD workflows.
- **Rapid development** — For a 10K-employee CRUD + analytics tool, Rails gives us production-quality scaffolding faster than most alternatives.

### Why PostgreSQL Over SQLite?

- **Concurrent access** — SQLite uses file-level locking. PostgreSQL handles concurrent reads/writes without contention, which matters for a deployed multi-request application.
- **Production parity** — Using the same database in development, test, and production eliminates "works on my machine" issues. SQLite in dev → PostgreSQL in prod is a known source of subtle bugs.
- **Advanced aggregations** — PostgreSQL supports window functions, CTEs, and advanced statistical functions that may be useful for salary analytics.
- **Deployment readiness** — Render provides managed PostgreSQL out of the box. SQLite requires file system persistence which is problematic on ephemeral containers.
- **Scale** — While 10K rows is trivial for either database, PostgreSQL's query planner and indexing are designed for larger datasets, making the architecture future-proof.

### Why React + Vite Over Next.js?

- **Separation of concerns** — A pure React SPA communicating with a Rails API keeps frontend and backend fully decoupled. Next.js blurs this boundary with server-side rendering and API routes that would overlap with our Rails backend.
- **Deployment simplicity** — React + Vite builds to static files that deploy trivially to Vercel's CDN. No server-side runtime needed on the frontend.
- **Vite's speed** — Hot module replacement (HMR) is near-instant compared to Create React App. Build times are significantly faster.
- **Right-sized for the problem** — We don't need SSR, ISR, or server components. This is a dashboard application where client-side rendering is perfectly appropriate.
- **TypeScript first** — Vite's React-TS template provides strict TypeScript configuration out of the box.

### Frontend-Backend Communication

- All API calls go through a centralized `api.ts` service layer using **Axios**
- **React Query (@tanstack/react-query)** manages server state — caching, refetching, optimistic updates, and loading/error states
- API is versioned under `/api/v1/` for forward compatibility
- CORS is configured on the Rails backend to allow requests from the Vercel frontend origin
- All responses follow a consistent JSON structure

## Database Schema

```sql
CREATE TABLE employees (
  id            BIGSERIAL PRIMARY KEY,
  full_name     VARCHAR NOT NULL,
  job_title     VARCHAR NOT NULL,
  department    VARCHAR,
  country       VARCHAR NOT NULL,
  salary        DECIMAL(12,2) NOT NULL CHECK (salary > 0),
  currency      VARCHAR DEFAULT 'USD',
  employment_type VARCHAR DEFAULT 'full_time',
  hired_on      DATE,
  created_at    TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP NOT NULL
);

-- Indexes for query performance
CREATE INDEX idx_employees_country ON employees(country);
CREATE INDEX idx_employees_job_title ON employees(job_title);
CREATE INDEX idx_employees_country_job_title ON employees(country, job_title);
```

### Field-by-Field Reasoning

| Field | Type | Rationale |
|---|---|---|
| `full_name` | string, required | Primary identifier. Single field (not first/last) because display always uses full name and some cultures don't split neatly into first/last. |
| `job_title` | string, required | Core to salary analysis — the main axis for comparing compensation within a country. |
| `department` | string, optional | Useful for organizational grouping and future analytics. Optional because not all orgs structure by department. |
| `country` | string, required | Primary dimension for salary insights. Stored as full country name for readability (not ISO code). |
| `salary` | decimal(12,2), required | Stored as annual salary with 2 decimal places. Decimal avoids floating-point rounding issues with currency. |
| `currency` | string, default USD | Acknowledges multi-currency reality. Defaults to USD for simplicity since conversion is out of scope. |
| `employment_type` | string, default full_time | Distinguishes full-time, part-time, and contract workers — important context for salary comparisons. |
| `hired_on` | date, optional | Enables tenure-based analysis. Optional because historical data may not have exact hire dates. |

## API Design

```
GET    /api/v1/employees          — List employees (paginated, filterable)
POST   /api/v1/employees          — Create employee
GET    /api/v1/employees/:id      — Show employee
PUT    /api/v1/employees/:id      — Update employee
DELETE /api/v1/employees/:id      — Delete employee
GET    /api/v1/insights           — Salary insights (by country, optional job_title)
GET    /api/v1/employees/countries — List distinct countries (for dropdowns)
GET    /api/v1/employees/job_titles — List distinct job titles (for dropdowns)
```

## Key Architectural Decisions

1. **Service object for insights** — `SalaryInsightsService` encapsulates all aggregation logic in a single testable class, keeping the controller thin.
2. **Database-level aggregations** — All min/max/avg/count calculations use SQL, not Ruby. This is critical for performance with 10K+ rows.
3. **Pagination with Kaminari** — 25 employees per page. The API returns pagination metadata (total count, total pages, current page) in the response.
4. **Composite index on (country, job_title)** — Optimizes the most common query pattern: salary stats for a job title within a country.
