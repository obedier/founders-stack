---
name: sprint
version: 1.0.0
description: |
  Run a full sprint from the Shelly build plan. Orchestrates the complete workflow:
  pre-sprint reviews, contract definition, parallel agent launch, integration,
  post-sprint review, and ship. One command to run an entire sprint.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Agent
  - AskUserQuestion
---

# /sprint — Full Sprint Orchestrator

Runs a complete sprint from `docs/BUILD_PLAN.md` with minimal human interaction. Orchestrates pre-sprint reviews, contract definition, parallel agent builds, integration, and post-sprint shipping.

## User-invocable
When the user types `/sprint`, run this skill.

## Arguments
- `/sprint N` — run Sprint N (e.g., `/sprint 0`, `/sprint 1`)
- `/sprint N phase P` — run only phase P of Sprint N (e.g., `/sprint 1 phase 2`)
- `/sprint N resume` — resume Sprint N from where it left off (reads SPRINT_PROGRESS.md)
- `/sprint status` — show current sprint progress

**Argument validation:** If N is not provided or not a number 0-7, show usage and stop:
```
Usage: /sprint <number> [phase <1-4>] [resume]
  /sprint 0          — run Sprint 0 (Foundations)
  /sprint 1          — run Sprint 1 (Onboarding + Receipt Import)
  /sprint 2 phase 2  — run only Phase 2 (parallel build) of Sprint 2
  /sprint 3 resume   — resume Sprint 3 from last checkpoint
  /sprint status     — show current progress
```

---

## Pre-Flight Checks

Before starting any sprint:

1. **Check git state:**
```bash
git status --short
git branch --show-current
```
If there are uncommitted changes, warn the user and ask whether to stash or commit first.

2. **Check prerequisites:** Sprint N requires Sprint N-1 to be completed. Read `docs/SPRINT_PROGRESS.md` and verify prior sprint shows Phase 3 completed. If not, warn and ask whether to proceed anyway.

3. **Read the sprint plan:**
```bash
# Read BUILD_PLAN.md and extract Sprint N tasks
```
Parse the sprint's Goal, Backend tasks, iOS tasks, and AI tasks.

---

## Phase 1: Pre-Sprint Reviews + Contracts (~30 min)

### Step 1.1: Engineering Plan Review (conditional)

If the sprint introduces new architecture, data flows, or complex logic (Sprints 1-7), run a lightweight plan review:

Read `docs/BUILD_PLAN.md` Sprint N tasks. For each major new codepath:
- Identify missing edge cases
- Check for policy evaluation gaps
- Verify trust model compliance
- Check for missing error handling

If issues are found, fix them in BUILD_PLAN.md before proceeding.

**Skip for Sprint 0** (foundations — no complex logic).

### Step 1.2: UX Review (conditional)

If the sprint includes new iOS screens (Sprints 1-7), review the UX flow:
- Check for missing states (loading, empty, error)
- Verify interaction patterns are consistent
- Check accessibility considerations
- Verify haptic feedback placement

Document any UX decisions in `docs/DECISION_LOG.md`.

**Skip for Sprint 0** (app shell only — no complex UX).

### Step 1.3: Define Contracts

This is the critical step. Read the sprint's tasks and create/update:

1. **Shared types** in `contracts/types/`:
   - New entity types needed for this sprint
   - Update existing types if fields are added
   - TypeScript interfaces with JSDoc comments

2. **API contracts** in `contracts/api/`:
   - OpenAPI 3.1 YAML for new endpoints
   - Request/response schemas
   - Error response schemas
   - Auth requirements noted

3. **Event definitions** in `contracts/events/`:
   - New events this sprint introduces
   - Event payload types

4. **Connector interface updates** in `contracts/types/connectors.ts`:
   - New methods if connector capabilities expand

Commit contracts to main:
```bash
git add contracts/
git commit -m "[contracts] Sprint N: define types, API specs, and events

- [list what was added]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Step 1.4: Update Progress

Update `docs/SPRINT_PROGRESS.md` to mark Phase 1 complete.

---

## Phase 2: Parallel Build (bulk of sprint)

Launch exactly 3 agents in a SINGLE message for true parallelism. Each agent runs on Sonnet in an isolated worktree.

### Determine which agents are needed

Read the sprint's tasks. Some sprints don't need all 3 agents:

| Sprint | Backend | iOS | AI |
|--------|---------|-----|----|
| S0 | Yes | Yes | Yes (mock connector) |
| S1 | Yes | Yes | Yes (receipt pipeline) |
| S2 | Yes | Yes | Yes (rationale gen) |
| S3 | Yes | Yes | Yes (connectors) |
| S4 | Yes | Yes | No (help test) |
| S5 | Yes | Yes | Yes (trust engine) |
| S6 | Yes | Yes | Yes (trust downgrade) |
| S7 | No (help test) | Yes | Yes (intent parser) |

### Launch agents

Use the exact prompt templates from `docs/AGENT_WORKFLOW.md` Phase 2 section. Customize with:
- Sprint number
- Specific tasks from BUILD_PLAN.md for this sprint
- Any decisions made in Phase 1
- Any UX specs from Phase 1

**Critical:** All Agent() calls MUST be in a single message for parallel execution.

All agents use `model: "sonnet"` and `isolation: "worktree"`.

### Monitor

After launching, wait for all agents to complete. Do NOT poll or sleep. You will be notified when each completes.

As each agent completes, note:
- Files changed
- Tests written
- Any decisions made (check their commits for DECISION_LOG entries)
- Any open questions (check their commits for OPEN_QUESTIONS entries)

### Update Progress

Update `docs/SPRINT_PROGRESS.md` with each agent's status as they complete.

---

## Phase 3: Integration (~1 hour)

### Step 3.1: Merge worktree branches

For each completed agent:
1. Review the agent's commits (summary, not line-by-line)
2. Merge the worktree branch into the current branch:
```bash
git merge <worktree-branch> --no-edit
```
3. If merge conflicts occur:
   - Contracts are source of truth for type conflicts
   - Module owner has priority for code conflicts
   - If ambiguous, resolve conservatively and document

### Step 3.2: Run tests

```bash
cd backend && npm test 2>&1 | tail -30
```

Check iOS builds:
```bash
cd ios && xcodebuild build -scheme Shelly -destination 'platform=iOS Simulator,name=iPhone 16' -quiet 2>&1 | tail -20
```

### Step 3.3: Fix integration issues

If tests fail or build fails:
- Read the error
- Fix the issue (usually import paths, missing types, or contract mismatches)
- Re-run tests
- Maximum 3 fix attempts before escalating to user

### Step 3.4: Commit integration fixes

```bash
git add -A
git commit -m "[integration] Sprint N: merge and fix integration issues

- [list fixes applied]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Step 3.5: Update Progress

Update `docs/SPRINT_PROGRESS.md` to mark Phase 3 complete.

---

## Phase 4: Post-Sprint Review + Report

### Step 4.1: Contract Validation (if /contract-check skill exists)

Run `/contract-check` to verify backend implementation matches OpenAPI specs.

### Step 4.2: Pre-Landing Review

If on a feature branch with commits, mentally run the review checklist:
- SQL safety (no raw queries, parameterized only)
- LLM trust boundary (LLM output never directly triggers execution)
- Policy evaluation (all execution paths go through policy)
- PII handling (no PII in logs or LLM prompts)
- Input validation (zod on all endpoints)

Flag any issues and fix them.

### Step 4.3: Sprint Report

Update `docs/SPRINT_PROGRESS.md` with final status:

```markdown
## Sprint N — [Name]
**Status:** Complete

### Phase 1: Contracts
- [x] Types defined
- [x] API specs written
- [x] Events defined

### Phase 2: Build
- Backend Agent: Complete — [summary of what was built]
- iOS Agent: Complete — [summary of what was built]
- AI Agent: Complete — [summary of what was built]

### Phase 3: Integration
- [x] Branches merged
- [x] Tests passing
- [x] Build succeeds

### Phase 4: Review
- [x] Contract validation passed
- [x] Pre-landing review clean

### Stats
- Files changed: N
- Tests added: N
- Endpoints added: N
- iOS screens added: N

### Decisions Made
- [list from DECISION_LOG.md additions]

### Open Questions
- [list from OPEN_QUESTIONS.md additions]
```

### Step 4.4: Surface any open questions

If any agent added to `docs/OPEN_QUESTIONS.md`, present each question to the user via AskUserQuestion before proceeding to the next sprint.

---

## Resume Mode

When `/sprint N resume` is used:

1. Read `docs/SPRINT_PROGRESS.md` for Sprint N
2. Find the last completed phase
3. Resume from the next phase
4. If Phase 2 was partially complete (some agents finished, some didn't), re-launch only the incomplete agents

---

## Status Mode

When `/sprint status` is used:

Read `docs/SPRINT_PROGRESS.md` and display:
```
Sprint Progress:
  Sprint 0: Complete
  Sprint 1: Phase 2 in progress (Backend: done, iOS: running, AI: done)
  Sprint 2: Not started
  ...
```

---

## Important Rules

1. **Never skip contracts.** Phase 1.3 is mandatory for every sprint.
2. **Never run agents sequentially.** All agents in ONE message for parallelism.
3. **Never skip tests.** If tests fail in Phase 3, fix before proceeding.
4. **Always update SPRINT_PROGRESS.md.** This is the resume checkpoint.
5. **Always use model: "sonnet" for build agents.** Cost optimization.
6. **Always use isolation: "worktree".** Prevents file conflicts.
7. **Surface open questions.** Never silently proceed past ambiguity.
8. **Bookmark on pause.** If the user interrupts or the session ends, run `/bookmark save "sprint-N-phase-P"` to preserve state.
