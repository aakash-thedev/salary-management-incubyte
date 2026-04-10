# Trade-offs Document — Salary Management Tool

## 1. SQLite vs PostgreSQL

**Decision: PostgreSQL**

| Dimension | SQLite | PostgreSQL |
|---|---|---|
| Setup complexity | Zero — file-based, no server | Requires running service |
| Concurrent access | File-level locking, one writer at a time | Full MVCC, concurrent reads/writes |
| Deployment | Problematic on ephemeral containers (Render, Heroku) | Managed service available on Render |
| Dev/prod parity | Different behavior from production DB | Same engine everywhere |
| Advanced queries | Limited window functions | Full SQL feature set |

**Why PostgreSQL wins here:**
- The app will be deployed to Render, which provides managed PostgreSQL but does not persist SQLite files across deploys
- Dev/prod parity eliminates an entire class of bugs (e.g., SQLite's loose typing vs PostgreSQL's strict typing)
- Aggregation queries for salary insights benefit from PostgreSQL's query planner

**When SQLite would be better:**
- If this were a local-only tool with no deployment requirement
- If zero-dependency setup was the top priority (e.g., a CLI tool)

---

## 2. Next.js vs React + Vite

**Decision: React + Vite**

| Dimension | Next.js | React + Vite |
|---|---|---|
| SSR/SSG support | Built-in | Not available (client-only) |
| API routes | Built-in (competes with Rails) | None (clean separation) |
| Build speed | Slower (more compilation steps) | Very fast (esbuild) |
| Deployment | Needs Node runtime or Vercel edge | Static files to any CDN |
| Complexity | Higher (file-based routing, server components) | Lower (standard SPA) |

**Why React + Vite wins here:**
- We already have a Rails API backend. Next.js's server-side features would be redundant and create architectural confusion about where logic lives.
- This is a dashboard app — SEO doesn't matter, so SSR adds zero value.
- Vite's development experience (instant HMR, fast builds) is noticeably better.
- Static deployment to Vercel is simpler and cheaper than running a Node server.

**When Next.js would be better:**
- If there were no separate backend (Next.js API routes + Prisma)
- If SEO mattered (public-facing pages)
- If we needed SSR for performance on slow devices

---

## 3. Bulk Insert vs Individual Creates (Seed Script)

**Decision: Bulk insert with `insert_all`**

| Approach | 10,000 records | DB round trips |
|---|---|---|
| `Employee.create` in a loop | ~60-90 seconds | 10,000 |
| `Employee.insert_all` (batched) | ~2-5 seconds | 1-2 |

**Why bulk insert wins:**
- `insert_all` sends a single SQL INSERT with all rows, dramatically reducing network and transaction overhead
- The assessment explicitly states: "engineers run this script regularly, and performance of the script matters"
- 10-30x faster for 10,000 records

**Trade-off:**
- `insert_all` bypasses ActiveRecord validations and callbacks. This is acceptable for seeding because:
  - Seed data is generated programmatically (not user input), so we control its correctness
  - We add a database-level CHECK constraint on salary as a safety net
  - The speed gain is worth the trade-off for a seed script

---

## 4. Single `full_name` Field vs Separate `first_name` + `last_name`

**Decision: Single `full_name` field**

**Why:**
- The UI always displays the full name — never first or last independently
- Name splitting is culturally problematic (mononyms, multi-part surnames, prefixes)
- The seed script combines first + last names anyway, so storage as a single field is natural
- Searching by name works fine with `ILIKE '%query%'` on a single field

**Trade-off:**
- Sorting by last name becomes harder (would need to parse)
- In production, separate fields with a virtual `full_name` method might be preferred

---

## 5. API Versioning (`/api/v1/`)

**Decision: Version from day one**

**Why:**
- Near-zero implementation cost (just a namespace)
- Protects against breaking changes if the frontend and backend evolve at different paces
- Industry best practice for public-facing APIs

**Trade-off:**
- Slight URL verbosity (`/api/v1/employees` vs `/employees`)
- For a single-consumer API, versioning may seem premature — but the cost is negligible

---

## 6. Pagination Strategy: Offset-based vs Cursor-based

**Decision: Offset-based pagination (Kaminari)**

**Why:**
- Simpler to implement and understand
- Works well with 10,000 records — performance is not a concern at this scale
- Supports "jump to page N" UX pattern naturally
- Kaminari integrates seamlessly with ActiveRecord

**Trade-off:**
- Offset pagination has known performance issues at very large offsets (100K+ rows) — not relevant here
- Cursor-based would be better for infinite scroll or real-time feeds

---

## 7. Salary Stored as Decimal vs Integer (Cents)

**Decision: Decimal(12,2)**

**Why:**
- Directly represents the human-readable value (e.g., 75000.00)
- PostgreSQL's DECIMAL type has exact arithmetic — no floating-point issues
- Simpler for aggregations: `AVG(salary)` returns a human-readable number

**Trade-off:**
- Integer-cents approach (storing 7500000 for $75,000.00) is common in payment systems to avoid any rounding ambiguity
- For a read-heavy analytics tool (not a payment processor), decimal is cleaner and sufficient

---

## 8. Service Object vs Model Scope for Insights

**Decision: Dedicated `SalaryInsightsService` class**

**Why:**
- Keeps the Employee model focused on data integrity (validations, associations)
- Insights logic involves multiple aggregation queries — a service object provides a single, testable interface
- Controller stays thin: one call to the service, one render

**Trade-off:**
- Could use ActiveRecord scopes on the model instead, which is more "Rails-way"
- Service object is a better fit when the logic spans multiple queries and returns a composite result

---

## 9. Currency Display: USD Everywhere vs Local Currency per Country

**Decision: Local currency per country**

**Why:**
- An HR Manager reviewing Indian salaries thinks in INR, not USD. Showing $45,000 for an Indian employee is confusing — ₹26,00,000 is immediately meaningful.
- The seed data assigns realistic salary ranges in each country's local currency (India ₹4L–₹50L, Japan ¥4M–¥20M, etc.) so the numbers match real-world expectations.
- The insights API returns the primary currency for the selected country, and all frontend components format salaries accordingly.

**Trade-off:**
- Salary values across countries are not directly comparable (₹26L ≠ $26K). Multi-currency conversion is intentionally out of scope.
- If cross-country salary comparison is needed in the future, a conversion layer or "normalize to USD" toggle would be required.
