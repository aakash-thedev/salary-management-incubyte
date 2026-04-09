# AI Usage Document — Salary Management Tool

## Tools Used

- **Claude Code (Anthropic)** — Primary AI coding assistant used throughout the project

## How AI Was Used

### 1. Planning & Architecture (Phase 0–1)

**What I did:**
- Defined the product requirements, user persona, and scope boundaries
- Chose the tech stack based on the assessment requirements and my experience
- Decided the database schema fields and their rationale

**What AI helped with:**
- Structuring the documentation (PLANNING.md, ARCHITECTURE.md, TRADEOFFS.md)
- Articulating trade-off reasoning in a clear, tabular format
- Ensuring comprehensive coverage of architectural decisions

**My decision, not AI's:**
- Tech stack selection (Rails + PostgreSQL + React + Vite)
- Schema design — fields were chosen based on what an HR Manager actually needs
- What's in scope vs. out of scope

### 2. TDD Workflow (Phases 3–5)

**What I did:**
- Defined what test cases should exist (based on business requirements)
- Decided on the testing strategy (model specs → service specs → request specs)
- Reviewed all generated tests for correctness and edge cases

**What AI helped with:**
- Writing the RSpec test syntax (describe/context/it blocks)
- Generating FactoryBot factory definitions
- Suggesting edge cases I may have missed

**My decision, not AI's:**
- Which behaviors to test (tied directly to business requirements)
- Test organization and naming conventions
- When a test was "good enough" vs. needed more cases

### 3. Implementation Code (Phases 3–6)

**What AI helped with:**
- Generating boilerplate (model validations, controller actions, routes)
- Writing the bulk insert logic for the seed script
- Implementing pagination and filtering

**My decision, not AI's:**
- Using `insert_all` over `create` for seeding (performance decision)
- Database-level aggregations over Ruby computation (architecture decision)
- API response structure and error handling patterns

### 4. Frontend Development (Phases 7–9)

**What AI helped with:**
- Component scaffolding with TypeScript types
- ShadCN UI component integration
- React Query hook patterns for data fetching

**My decision, not AI's:**
- Page layout and user flow design
- Which ShadCN components to use where
- State management approach (React Query for server state, local state for forms)

### 5. Deployment (Phase 10)

**What AI helped with:**
- Render configuration (render.yaml, build commands)
- Vercel environment variable setup

**My decision, not AI's:**
- Platform selection (Render for Rails, Vercel for React)
- Environment separation strategy

## Principles for AI Usage

1. **AI accelerates, it doesn't decide** — I chose the architecture, scope, and approach. AI helped execute those decisions faster.

2. **Every line was reviewed** — No AI output was committed without reading and understanding it. Several suggestions were modified or rejected.

3. **TDD discipline was human-driven** — The decision of "what to test" came from understanding the business requirements, not from asking AI "what should I test."

4. **AI is best at boilerplate** — Repetitive patterns (controller actions, form components, factory definitions) are where AI saved the most time without sacrificing quality.

5. **AI is worst at judgment calls** — Trade-offs, scope decisions, and architectural choices require human context that AI doesn't have about the specific assessment goals.
