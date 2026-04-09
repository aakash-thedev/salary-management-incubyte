# Planning Document — Salary Management Tool

## What Are We Building?

A web-based salary management tool that allows an HR Manager to manage employee records and gain salary insights across a 10,000-employee organization. The tool provides CRUD operations for employee data and an analytics dashboard for salary-related metrics segmented by country and job title.

## Who Is the User?

**Persona: HR Manager**

- Responsible for managing employee records across multiple countries
- Needs quick access to salary benchmarks for hiring decisions and compensation reviews
- Regularly adds/updates employee data as the organization grows
- Needs to spot salary discrepancies across regions and roles
- Values clarity, speed, and accuracy — not interested in complex BI tooling

## What Problem Does This Solve?

Without this tool, the HR Manager would rely on spreadsheets or fragmented systems to:
- Track 10,000 employees across countries — error-prone and slow
- Manually compute salary statistics — tedious and inaccurate
- Compare salaries across roles and regions — requires pivot tables and formulas

This tool centralizes employee data with instant access to key salary metrics, enabling faster and more informed decisions about compensation, hiring, and budgeting.

## Features In Scope

### Employee Management
- **Add Employee** — Form with full name, job title, department, country, salary, currency, employment type, hire date
- **View Employees** — Paginated table with search (by name) and filter (by country)
- **Edit Employee** — Pre-filled form to update any field
- **Delete Employee** — Confirmation dialog before removal

### Salary Insights Dashboard
- **Country-level aggregations** — Min, max, and average salary for a selected country
- **Job title breakdown** — Average salary for a specific job title within a country
- **Headcount by country** — Total number of employees per country
- **Top earners** — Top 5 highest-paid employees in a country
- **Additional metrics** — Salary distribution by employment type, department headcount

### Seed Data
- Script to populate 10,000 employees using `first_names.txt` × `last_names.txt`
- Bulk insert for performance (target: <10 seconds)
- Idempotent — safe to run repeatedly

### Deployment
- Backend deployed to Render (Rails API + PostgreSQL)
- Frontend deployed to Vercel (React static build)
- Video demo of the working application

## What Is Intentionally Out of Scope (and Why)

| Feature | Reason |
|---|---|
| **Authentication / Authorization** | Adds complexity without demonstrating core skills. The assessment focuses on CRUD, insights, and code quality — not auth flows. |
| **Role-based access control** | Same as above. Would be a Phase 2 concern in production. |
| **Multi-currency conversion** | Salary is stored with a currency field, but live conversion adds external API dependency and complexity beyond scope. |
| **Employee profile photos / documents** | File upload is orthogonal to the salary management problem. |
| **Audit logging / change history** | Valuable in production but not core to demonstrating engineering quality here. |
| **Export to CSV/PDF** | Useful for HR but not a differentiating feature for this assessment. |
| **Email notifications** | No workflow triggers needed for a management dashboard. |
| **Real-time updates (WebSockets)** | Overkill for a single-user HR tool. Standard request-response is sufficient. |

## Success Criteria

1. An HR Manager can add, view, edit, and delete employees through the UI
2. Salary insights update dynamically when a country or job title is selected
3. The seed script loads 10,000 employees in under 10 seconds
4. All core business logic is covered by fast, deterministic unit tests
5. The application is deployed and accessible via public URLs
6. Commit history tells a clear story of incremental development
