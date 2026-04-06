---
description: Unified workflow orchestrator. Chains ECC agents, gstack skills, and hooks into end-to-end development workflows with language-aware routing.
---

# Orchestrate — Unified Workflow

End-to-end development workflow that automatically selects the right agents, skills, and reviewers based on the task and your stack.

## Usage

`/orchestrate [workflow] [description]`

## Workflows

### feature
Full feature lifecycle — plan, implement, test, review, QA, ship.

### bugfix
Investigate, fix, test, review.

### refactor
Architect, restructure, test, review.

### security
Security audit with deep review.

### hotfix
Fast-track fix with minimal ceremony — fix, test, review, ship.

### qa
QA-only pass on the current branch.

### project
Full v1 build — blueprint the entire project, then execute each feature autonomously in dependency order.

### custom
`/orchestrate custom "agent1,agent2,..." "description"`

---

## Progress Tracking

This workflow uses a visual breadcrumb trail in the status line. At each step, run:

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> <stepIndex> running
```

Where `stepIndex` maps to the workflow's pipeline position (0-indexed):
- **feature:**  0=Plan, 1=Impl, 2=Review, 3=PreLand, 4=QA, 5=Ship
- **bugfix:**   0=Plan, 1=Impl, 2=Review, 3=PreLand, 4=Ship
- **refactor:** 0=Plan, 1=Arch, 2=Review, 3=PreLand, 4=Ship
- **security:** 0=Plan, 1=SecRev, 2=CodeRev, 3=PreLand
- **hotfix:**   0=Impl, 1=Review, 2=PreLand, 3=Ship
- **qa:**       0=PreLand, 1=QA
- **custom:**   0=Agents, 1=PreLand, 2=Ship
- **project:**  0=Blueprint, 1=EngReview, 2=Scaffold, 3=Features, 4=Integrate, 5=QA, 6=Ship

**You MUST call this at the start of every step.** The status line shows:
```
osamabedier:~/project main* ctx:73% opus-4.6 14:30  [feature: ✓Plan ✓Build ▸Review ·PreLand ·QA ·Ship] 33%
```

When the workflow completes (or is abandoned), clear the state:
```bash
node ~/.claude/scripts/orchestrate-progress.js clear
```

---

## Execution

When the user runs `/orchestrate [workflow] [description]`:

### Step 0: Detect Context

1. **Detect language/framework** from the project:
   - Check for `tsconfig.json`, `package.json` → TypeScript/JavaScript
   - Check for `pyproject.toml`, `setup.py`, `requirements.txt` → Python
   - Check for `go.mod` → Go
   - Check for `Cargo.toml` → Rust
   - Check for `pom.xml`, `build.gradle` → Java/Kotlin
   - Check for `Package.swift`, `*.xcodeproj` → Swift
   - Check for `CMakeLists.txt` → C++
   - Check for `composer.json` → PHP/Laravel
   - Check for `cpanfile`, `Makefile.PL` → Perl
   - Multiple detected = polyglot project, note all

2. **Detect if on a branch** (`git branch --show-current`). If on `main`, create a feature branch from the description.

3. **Check for existing tests** (test directories, test files) to decide TDD approach.

4. **Store context** for handoff:
   ```
   CONTEXT:
     Languages: [detected]
     Branch: [current]
     Has Tests: [yes/no]
     Task: [user description]
   ```

### Step 1: Plan (all workflows except `qa` and `hotfix`)

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 0 running
```

Invoke the **planner** agent with the task description and detected context.

The planner must output:
- Implementation steps
- Files to create/modify
- Dependencies and risks
- Estimated complexity (simple / moderate / complex)

**Ask the user to confirm the plan before proceeding.**

Output: `HANDOFF: planner -> implement`

### Step 2: Implement

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 1 running
```

Based on workflow type:

**feature / bugfix / hotfix:**
Invoke **tdd-guide** agent with the plan. TDD guide:
- Writes tests first (using language-appropriate test framework)
- Implements minimal code to pass
- Runs tests to verify

**refactor:**
Invoke **architect** agent first for structural design, then implement.

**security:**
Skip — security workflow starts at review.

Output: `HANDOFF: implement -> review`

### Step 3: Review (parallel)

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 2 running
```

Run these reviews **in parallel** (single message, multiple agents):

**Always run:**
- **Language-specific reviewer** (auto-selected):
  | Language | Reviewer Agent |
  |----------|---------------|
  | TypeScript/JS | `typescript-reviewer` |
  | Python | `python-reviewer` |
  | Go | `go-reviewer` |
  | Rust | `rust-reviewer` |
  | Java | `java-reviewer` |
  | Kotlin | `kotlin-reviewer` |
  | C++ | `cpp-reviewer` |
  | Swift | (use `code-reviewer` with Swift context) |
  | PHP | (use `code-reviewer` with Laravel context) |
  | Perl | (use `code-reviewer` with Perl context) |
  | Polyglot | `code-reviewer` (general) |

**Run if applicable:**
- **security-reviewer** — if the task touches auth, user input, API endpoints, payments, PII, or secrets
- **database-reviewer** — if the task touches SQL, migrations, schemas, or ORMs
- **performance-optimizer** — if the task is performance-related or touches hot paths

Merge all reviewer findings into a single review summary.

**If reviewers find CRITICAL issues:** fix them before proceeding. Re-run only the reviewer that flagged the issue.

Output: `HANDOFF: review -> pre-landing`

### Step 4: Pre-Landing Review (gstack)

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 3 running
```

Run `/review` (gstack skill). This is the structural safety review that catches what agents miss:
- SQL safety (no raw queries)
- LLM trust boundary violations
- Conditional side effects
- Secrets in diff
- Missing error handling

**If `/review` flags CRITICAL issues:** fix and re-run.

Output: `HANDOFF: pre-landing -> qa` (feature/bugfix) or `HANDOFF: pre-landing -> ship` (hotfix)

### Step 5: QA (feature and qa workflows only)

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 4 running
```

Run `/qa` (gstack skill) for interactive QA if the project has a running frontend or API:
- For web apps: `/browse` the running app, test the new feature
- For APIs: test endpoints with curl or the test suite
- For CLI tools: run the tool with test inputs

Skip if the project has no runnable interface (library, SDK, etc.)

Output: `HANDOFF: qa -> ship`

### Step 6: Ship (all workflows except qa and security)

```bash
node ~/.claude/scripts/orchestrate-progress.js set <workflow> 5 running
```

Run `/ship` (gstack skill). This is fully automated:
- Merge origin/main
- Run full test suite
- Bump VERSION
- Update CHANGELOG
- Commit, push, create PR

**Do NOT ask for confirmation** — `/ship` handles its own safety checks.

Output: PR URL

---

## Project Workflow (v1 Builds)

When the user runs `/orchestrate project "description"`, this executes a full autonomous project build. This is the only workflow that spans multiple features and branches.

### Project Step 0: Blueprint (Spec-First)

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 0 running
```

This step generates a complete specification BEFORE any code is written. Code implements specs, not the reverse.

**0a. Intake** — Read the user's description. Identify gaps, ambiguities, or decisions that will materially affect architecture. Ask **at most 10** clarifying questions. Wait for answers. Do not proceed until answered.

**0b. Generate spec documents** in `docs/`:

| File | Purpose |
|------|---------|
| `PRODUCT_BRIEF.md` | Problem, users, flows, success criteria, non-negotiables |
| `ARCHITECTURE.md` | System architecture, service boundaries, tech stack, data flow (mermaid diagrams) |
| `DATA_MODEL.md` | All entities, fields, relationships, modeling notes |
| `API_CONTRACTS.md` | Every endpoint: method, path, request/response TypeScript types, error cases |
| `USER_FLOWS.md` | Step-by-step flows with acceptance criteria per step |
| `SPRINT_PLAN.md` | Ordered sprints with goals, user stories, backend/frontend tasks |
| `GUARDRAILS.md` | Rules agents must follow; things they must never do |
| `TEST_STRATEGY.md` | What gets tested, how, acceptance criteria per sprint |
| `DECISION_LOG.md` | Empty template — agents append decisions as they work |
| `OPEN_QUESTIONS.md` | Anything unresolved after intake |

**Rules for spec generation:**
- Do NOT write application code yet
- Every spec must trace back to the user's description or clarifying answers
- Do NOT invent features — if something seems needed but wasn't requested, add to OPEN_QUESTIONS.md
- Include mermaid diagrams for architecture and data relationships
- API contracts must include TypeScript types for all request/response bodies

**0c. Design system selection** — If the project has UI components and no `DESIGN.md` exists in the project root:
1. Run `/design-reference pick` to recommend design systems matching the project type
2. If the user selects one, run `/design-reference apply <brand>` to copy it to the project root
3. The selected design system becomes the visual reference for all frontend agents — no further prompt needed

**0d. Run `/blueprint`** on the completed specs to produce a step-by-step execution plan with dependency graph, parallel detection, and cold-start context briefs.

**Source of truth hierarchy** (when specs conflict):
1. User's description + clarifying answers (intent is supreme)
2. GUARDRAILS.md (hard rules)
3. PRODUCT_BRIEF.md (synthesized spec)
4. API_CONTRACTS.md (typed interfaces)
5. DATA_MODEL.md → ARCHITECTURE.md → SPRINT_PLAN.md
6. Code (lowest — change code to match specs, never the reverse)

**Present the specs and blueprint to the user. Do NOT proceed without explicit approval.**

### Project Step 1: Engineering Review

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 1 running
```

Run `/plan-eng-review` on the specs and blueprint. This validates:
- Architecture decisions and data flow
- Edge cases the specs missed
- Test coverage strategy
- Performance considerations
- Dependency risks
- Contract completeness (every endpoint typed, every entity modeled)

If the review identifies issues, update the relevant spec docs before proceeding.

Optionally run `/plan-ceo-review` if the user wants product-level scope validation, or `/ux` if the project has UI components.

### Project Step 2: Scaffold & Contracts

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 2 running
```

Build the project skeleton from the specs — no business logic yet:

1. **Create repo structure** per `ARCHITECTURE.md`
2. **Implement shared types/interfaces** from `API_CONTRACTS.md` (TypeScript types, Zod schemas, or language equivalent)
3. **Create database schema and migrations** from `DATA_MODEL.md`
4. **Set up test infrastructure** per `TEST_STRATEGY.md`
5. **Create mock/stub API endpoints** — return correct response shapes with no logic
6. **Verify the project builds** and all stubs pass type-checking

Use the **architect** agent for structural decisions and **tdd-guide** for test infrastructure.

Commit scaffold to `main`. All feature agents will build against these contracts.

**Critical rule**: Backend and frontend agents never negotiate API shapes directly during development — they both implement against `API_CONTRACTS.md`. If an agent needs to change a contract, it updates the spec first and notifies dependent agents via `DECISION_LOG.md`.

### Project Step 3: Features (the bulk of the build)

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 3 running
```

Execute each remaining blueprint step as an autonomous feature build. For each step:

1. **Read the step's context brief** from the plan file (designed for cold-start execution)
2. **Create a feature branch** from the step name
3. **Execute the step** as `/orchestrate feature` — full pipeline: plan → tdd → review → pre-landing → ship

**Parallelism**: When the blueprint marks steps as parallelizable (no shared files or output dependencies):
- Launch parallel steps simultaneously using Agent tool with `isolation: "worktree"` and `model: "sonnet"`
- Each agent gets its step's self-contained context brief
- Wait for all parallel steps to complete before moving to dependent steps

**Sequencing**: For serial steps (dependencies exist):
- Execute one at a time
- Each step's PR gets merged to main before the next step starts
- Run `git pull origin main` before starting each new step

**Between steps**, show progress:
```
PROJECT PROGRESS
================
Step 1/8: ✓ Project scaffold (merged)
Step 2/8: ✓ Database schema + migrations (merged)
Step 3/8: ✓ Auth service (merged)        |  parallel
Step 4/8: ✓ User profile API (merged)    |  group
Step 5/8: ▸ Payment integration (building...)
Step 6/8: · Notification system (waiting for 5)
Step 7/8: · Admin dashboard (waiting for 3,4,5)
Step 8/8: · E2E tests + polish (waiting for all)
```

**Error handling**: If a step fails (build error, review rejection, test failure):
1. Attempt to fix using the standard build error recovery
2. If unfixable after 3 retries, pause and ask the user
3. Use `/bookmark save "project-step-N"` so work can resume later
4. Skip the step if user approves and it's not blocking downstream steps

### Project Step 4: Integration

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 4 running
```

After all feature steps are merged:

1. **Pull the latest main** with all merged PRs
2. **Run the full test suite** — all unit, integration, and E2E tests
3. **Run `/contract-check`** if OpenAPI specs exist — verify all endpoints match
4. **Fix integration issues** — type mismatches, import conflicts, missing wiring
5. **Run `/refactor-clean`** via the **refactor-cleaner** agent — remove dead code, unused imports, duplicate logic introduced across parallel steps
6. **Update documentation** via the **doc-updater** agent — sync README, codemaps, API docs

Commit integration fixes as a single PR.

### Project Step 5: QA

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 5 running
```

Full project QA pass:

1. **Run `/qa`** (gstack) in full mode — systematic exploration of every major flow
2. **Run `/ios-qa`** if the project has iOS components
3. **Run `/e2e`** to generate and run end-to-end test journeys for critical paths
4. **Run `/security-scan`** (ECC AgentShield) for config and injection vulnerabilities
5. **Run `/audit`** for dependency vulnerabilities

If QA finds issues, fix them and re-run the specific failing check.

### Project Step 6: Ship

```bash
node ~/.claude/scripts/orchestrate-progress.js set project 6 running
```

1. **Run `/review`** (gstack) — final pre-landing structural review on the full diff
2. **Run `/ship`** (gstack) — version bump, changelog, push, create PR
3. **Run `/save-session`** to persist full project context
4. **Run `/learn`** to extract reusable patterns from the build
5. **Suggest `/retro`** for team retrospective on the build

Output the final project report:

```
PROJECT REPORT
==============
Project: [description]
Blueprint: [plan file path]
Steps completed: [N/N]
Branches merged: [N]
Total PRs: [N]

FEATURES BUILT
--------------
1. [step name] — PR #[N] (merged)
2. [step name] — PR #[N] (merged)
...

TEST RESULTS
------------
Unit: [pass/fail]
Integration: [pass/fail]
E2E: [pass/fail]
Coverage: [%]

SECURITY
--------
AgentShield: [findings]
Dependency audit: [findings]

FINAL PR
--------
[PR URL]

VERDICT: [SHIPPED / NEEDS WORK]
```

After the report, clear progress:
```bash
node ~/.claude/scripts/orchestrate-progress.js clear
```

### Resuming a Project Build

If a project build is interrupted (session ends, context runs out, user pauses):

1. Progress is saved in the blueprint plan file (steps are marked complete/pending)
2. Run `/orchestrate project resume` to continue from the last completed step
3. The step's self-contained context brief means no prior session context is needed
4. Run `/bookmark resume` if a bookmark was saved

---

## Workflow Pipelines Summary

```
feature:  plan → tdd → review (parallel) → /review → /qa → /ship
bugfix:   plan → tdd → review (parallel) → /review → /ship
refactor: plan → architect → review (parallel) → /review → /ship
security: plan → security-reviewer → code-reviewer → /review
hotfix:   tdd → review → /review → /ship
qa:       /review → /qa
custom:   [user-defined agents] → /review → /ship
project:  /blueprint → /plan-eng-review → scaffold → [features...] → integrate → /qa + /e2e → /ship
```

---

## Handoff Document Format

Between steps, maintain a running handoff:

```markdown
## HANDOFF: [step] -> [next-step]

### Context
[What was done in this step]

### Findings
[Key discoveries, decisions, or issues]

### Files Modified
[List of files touched with brief description]

### Open Issues
[Unresolved items for next step — EMPTY if none]

### Recommendation
[PROCEED / FIX NEEDED / BLOCKED]
```

---

## Final Report

After the workflow completes, output:

```
ORCHESTRATION REPORT
====================
Workflow: [type]
Task: [description]
Languages: [detected]
Branch: [name]
Pipeline: [steps executed]

SUMMARY
-------
[One paragraph: what was built/fixed, key decisions]

STEP RESULTS
------------
Plan:           [summary or SKIPPED]
Implementation: [summary — tests written, code changed]
Code Review:    [reviewer used, findings count by severity]
Pre-Landing:    [/review result — PASS or issues found]
QA:             [/qa result or SKIPPED]
Ship:           [PR URL or SKIPPED]

FILES CHANGED
-------------
[git diff --stat output]

TEST RESULTS
------------
[pass/fail count, coverage if available]

OPEN ITEMS
----------
[Any unresolved questions or follow-up work]

VERDICT: [SHIPPED / NEEDS WORK / BLOCKED]
```

After outputting the final report, clear the progress tracker:
```bash
node ~/.claude/scripts/orchestrate-progress.js clear
```

---

## Build Error Recovery

If at any point a build fails during the workflow:

1. **Detect the language** from the error
2. **Invoke the right build resolver**:
   | Language | Resolver Agent |
   |----------|---------------|
   | TypeScript/JS | `build-error-resolver` |
   | Python/PyTorch | `pytorch-build-resolver` |
   | Go | `go-build-resolver` |
   | Rust | `rust-build-resolver` |
   | Java | `java-build-resolver` |
   | Kotlin | `kotlin-build-resolver` |
   | C++ | `cpp-build-resolver` |
3. **Re-run the failing step** after the fix
4. **Max 3 retries** before escalating to the user

---

## Parallel Execution for Complex Features

When the planner identifies independent workstreams (e.g., backend + frontend + tests), use worktree isolation:

```
/orchestrate feature "Add payment processing"
```

If planner says "backend API and frontend form are independent":
- Launch both in parallel via Agent tool with `isolation: "worktree"` and `model: "sonnet"`
- Merge worktrees after both complete
- Run review on the merged result

---

## Arguments

$ARGUMENTS:
- `feature <description>` — Full lifecycle: plan through ship
- `bugfix <description>` — Fix through ship
- `refactor <description>` — Restructure through ship
- `security <description>` — Deep security audit
- `hotfix <description>` — Fast-track: fix, review, ship
- `qa [description]` — QA-only pass on current branch
- `project <description>` — Full v1 build: blueprint → features → integrate → ship
- `project resume` — Resume an interrupted project build from last checkpoint
- `custom "<agents>" "<description>"` — Custom agent chain then review and ship

---

## Conditional Capabilities

These activate automatically when the context warrants them. You do NOT need to remember them.

### During Step 0 (Detect Context) — auto-enrich the plan

| Condition | Action |
|-----------|--------|
| Task mentions API contracts, OpenAPI, or spec drift | Run `/contract-check` before planning |
| Task is a large feature (planner says "complex") | Suggest `/plan-eng-review` after the plan for architecture validation |
| Task mentions product direction, scope, or strategy | Suggest `/plan-ceo-review` for scope challenge |
| Task has UX implications (new screens, flows, forms) | If no `DESIGN.md` in project root, run `/design-reference pick` to select a design system. Then suggest `/ux` review after planning, before implementation |

### During Step 2 (Implement) — auto-select the right approach

| Condition | Action |
|-----------|--------|
| Planner identified E2E test needs | Invoke **e2e-runner** agent alongside tdd-guide |
| Task is a refactor with dead code | Invoke **refactor-cleaner** agent in the Arch step |
| Unfamiliar library or API encountered | Invoke **docs-lookup** agent (uses Context7 MCP) for current docs |
| Planner identified docs/codemap updates needed | Queue **doc-updater** agent for after implementation |

### During Step 3 (Review) — auto-add specialist reviewers

| Condition | Action |
|-----------|--------|
| Flutter/Dart files changed | Add **flutter-reviewer** to parallel review |
| Healthcare/clinical/PHI code touched | Add **healthcare-reviewer** to parallel review |
| Database migrations or SQL in diff | Add **database-reviewer** (always, not just "if applicable") |

### During Step 5 (QA) — auto-select QA method

| Condition | Action |
|-----------|--------|
| Web app with running frontend | `/browse` the app, then `/qa` full mode |
| iOS app with simulator | `/ios-qa` instead of `/qa` |
| API-only project | Run E2E tests via **e2e-runner** agent |
| Authenticated pages | Run `/setup-browser-cookies` before `/qa` |

### After Step 6 (Ship) — post-ship automation

| Condition | Action |
|-----------|--------|
| Always after ship | Run `/save-session` to persist session state |
| Always after ship | Run `/learn` to extract reusable patterns from this session |
| Complex feature shipped | Suggest `/retro` for team retrospective |
| Dependencies were added/changed | Run `/audit` for vulnerability scan |

### User can invoke anytime during orchestration

These commands are always available. If the user runs them mid-workflow, honor them and resume:

| Command | What it does |
|---------|-------------|
| `/bookmark save` | Save orchestration progress for later resume |
| `/bookmark resume` | Resume a previously saved orchestration |
| `/aside "question"` | Answer a side question without losing workflow context |
| `/eval` | Run evaluation against test cases |
| `/verify` | Run verification loop on current changes |
| `/test-coverage` | Check test coverage metrics |
| `/context-budget` | Check how much context window remains |
| `/model-route` | Suggest optimal model for current step |
| `/research "topic"` | Deep research via gstack when you need external info |
| `/pmf-review` | Product-market fit check (for product features) |

---

## Examples

```
/orchestrate feature "Add Stripe webhook handling for subscription events"
/orchestrate bugfix "Users getting 500 on /api/profile when avatar is null"
/orchestrate refactor "Split monolithic UserService into domain modules"
/orchestrate security "Audit authentication and session management"
/orchestrate hotfix "Fix CORS headers for production API"
/orchestrate qa "Test the new checkout flow"
/orchestrate custom "architect,database-reviewer,tdd-guide" "Redesign caching layer"
/orchestrate project "SaaS invoicing app with Stripe billing, team management, and PDF export"
/orchestrate project "REST API for a recipe sharing platform with auth, search, and image upload"
/orchestrate project resume
```
