# founder-stack

A consolidated Claude Code configuration that makes AI-assisted development dramatically more effective. Combines three battle-tested systems into one install:

- **ECC** (Everything Claude Code) -- 30 agents, 136 skills, 60 commands, hooks, and rules
- **gstack** -- Headless browser QA, structural code review, ship automation, product strategy
- **Agentic Sprint Kit** -- Spec-first autonomous project builder with multi-agent coordination
- **awesome-design-md** -- 54 production design systems (Stripe, Linear, Airbnb, Vercel, etc.) for AI-native UI generation

One install. One `/orchestrate` command. Every workflow covered.

---

## Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Usage by Mode](#usage-by-mode)
  - [Building a New Project from Scratch](#building-a-new-project-from-scratch)
  - [Adding a Feature](#adding-a-feature)
  - [Fixing a Bug](#fixing-a-bug)
  - [Hotfix (Emergency)](#hotfix-emergency)
  - [Refactoring](#refactoring)
  - [Security Audit](#security-audit)
  - [QA Pass](#qa-pass)
  - [Custom Workflow](#custom-workflow)
- [Design Systems (Auto-Injected)](#design-systems-auto-injected)
- [10x Productivity Patterns](#10x-productivity-patterns)
- [Keeping It Updated](#keeping-it-updated)
- [The Skill Catalog](#the-skill-catalog)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Troubleshooting](#troubleshooting)
- [Customizing](#customizing)

---

## Quick Start

### Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js 18+
- [bun](https://bun.sh) (optional, for headless browser QA)
- git

### Install

```bash
git clone https://github.com/obedier/founders-stack.git
cd founders-stack
./install.sh
```

This copies agents, skills, commands, rules, hooks, and scripts to `~/.claude/` and merges hook configurations into your `settings.json`. Start a new Claude Code session to activate.

### Verify

Open Claude Code in any project and run:

```
/orchestrate feature "add a health check endpoint"
```

You should see a progress breadcrumb trail in the status bar and an automated pipeline kick off: plan, implement (TDD), review, pre-landing check, QA, and ship.

---

## How It Works

### The Orchestrate Pipeline

Every workflow in founder-stack flows through `/orchestrate`, which chains together the right agents, skills, and hooks for the task at hand. Think of it as a CI/CD pipeline for development itself.

```
/orchestrate <mode> "description"
```

Each mode runs a different pipeline of steps. A visual breadcrumb trail shows progress:

```
[feature: ✓Plan ✓Impl ▸Review ·PreLand ·QA ·Ship] 50%
```

### What Runs Automatically

When you work in any Claude Code session with founder-stack installed, several things happen behind the scenes:

**Before tool execution (PreToolUse hooks):**
- Blocks `--no-verify` flag on git commits (protects your git hooks)
- Redirects dev servers to tmux (prevents blocking your session)
- Validates commit quality (lint, format, no secrets)
- Protects linter/formatter configs from accidental modification
- Checks MCP server health before MCP tool calls

**After tool execution (PostToolUse hooks):**
- Auto-formats JS/TS files after edits (Biome or Prettier)
- Runs TypeScript type-checking after `.ts`/`.tsx` edits
- Warns about `console.log` statements
- Runs quality gate checks after file edits

**At session end (Stop hooks):**
- Checks all modified files for `console.log`
- Tracks cost/token metrics
- Sends desktop notification with task summary
- Evaluates session for extractable patterns (continuous learning)

### Language Detection

The orchestrator auto-detects your project's language from config files (`tsconfig.json`, `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `build.gradle.kts`, etc.) and routes to the correct reviewer, build resolver, and test runner. You don't need to configure anything.

---

## Usage by Mode

### Building a New Project from Scratch

```
/orchestrate project "a marketplace for yacht slip rentals with Stripe payments"
```

This is the most powerful mode. It builds an entire v1 autonomously using the Agentic Sprint Kit methodology:

**Phase 0 -- Intake**
Asks up to 10 clarifying questions about gaps in your description. Covers: target user, magic moment, success criteria, user flows, retention loop, scope boundaries, non-negotiables, and tech preferences.

**Phase 1 -- Specification**
Generates 9 spec documents before any code is written:

| Document | Purpose |
|----------|---------|
| `PRODUCT_BRIEF.md` | Problem, users, flows, success criteria |
| `ARCHITECTURE.md` | System design with mermaid diagrams |
| `DATA_MODEL.md` | Entities, fields, relationships (ER diagram) |
| `API_CONTRACTS.md` | Every endpoint with TypeScript request/response types |
| `USER_FLOWS.md` | Step-by-step flows with WHEN-THEN-SHALL acceptance criteria |
| `SPRINT_PLAN.md` | Ordered sprints with tasks and parallelization notes |
| `GUARDRAILS.md` | Rules agents must follow |
| `TEST_STRATEGY.md` | What gets tested and how |
| `DECISION_LOG.md` | Tracks every decision with rationale |

**Phase 1.5 -- Validation**
Pressure-tests whether the specs actually deliver the product you described: Does Sprint 1 deliver visible user value? How many steps before the magic moment? Is the return/habit loop built into the architecture?

**Phase 2 -- Scaffold**
Creates the project skeleton: directory structure, shared types from API contracts, database schema, stub API endpoints (correct response shapes, no logic), and test infrastructure. After this phase, the project builds and type-checks.

**Phase 2.5 -- Test Generation**
Converts every WHEN-THEN-SHALL acceptance criterion into a test. All tests are marked `skip` and tagged by sprint. During sprints, agents un-skip and implement against these tests.

**Phase 3 -- Sprint Execution (loop)**
Executes each sprint with parallel agents in isolated git worktrees:
- Un-skips this sprint's tests
- Breaks sprint into independent tasks
- Spawns agents in parallel (each in its own worktree, own files)
- Merges and runs full test suite
- Self-healing loop: if tests fail, spawns repair agent (max 3 attempts)
- A **ScrumMaster agent** runs continuously in the background, monitoring for stalls, resolving open questions, breaking deadlocks, and preventing scope creep

**Phase 4 -- QA**
Full project verification: test suite, acceptance criteria audit, contract compliance, security check, code readability audit, edge cases, and a product-lens review ("would I use this?"). Generates `STATUS.md` with a GREEN/YELLOW/RED verdict.

**Ship**
Final structural review, version bump, changelog, commit, push, PR.

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

**Key principle:** Backend and frontend agents never negotiate API shapes directly. Both implement against `API_CONTRACTS.md`. If an agent needs to change a contract, it updates the spec first.

---

### Adding a Feature

```
/orchestrate feature "add Stripe webhook handler for subscription events"
```

**Pipeline:** Plan -> Implement (TDD) -> Review (parallel) -> Pre-Landing -> QA -> Ship

| Step | What Happens |
|------|-------------|
| **Plan** | Planner agent creates implementation plan with files, dependencies, risks. You confirm before proceeding. |
| **Implement** | TDD-guide agent writes tests first, then minimal implementation to pass them. If unfamiliar libraries are involved, docs-lookup agent fetches current documentation. |
| **Review** | Language-specific reviewer + security reviewer + database reviewer run in parallel. CRITICAL issues are fixed and re-reviewed. |
| **Pre-Landing** | gstack `/review` runs structural safety analysis: SQL safety, trust boundary violations, conditional side effects. |
| **QA** | gstack `/qa` tests the running app with headless browser (web), simulator (iOS), or E2E tests (API-only). |
| **Ship** | gstack `/ship` merges main, runs tests, bumps version, updates changelog, pushes, creates PR. |

After shipping, the system automatically saves your session (`/save-session`), extracts reusable patterns (`/learn`), and runs a dependency audit if new packages were added.

---

### Fixing a Bug

```
/orchestrate bugfix "users can't checkout with Apple Pay on Safari"
```

**Pipeline:** Plan -> Implement (TDD) -> Review -> Pre-Landing -> Ship

Same as feature but **skips QA** (the fix itself is the verification). The TDD step is critical here: you write a test that reproduces the bug first, then fix it.

---

### Hotfix (Emergency)

```
/orchestrate hotfix "fix crash on null user.email in checkout flow"
```

**Pipeline:** Implement (TDD) -> Review -> Pre-Landing -> Ship

**Skips planning entirely.** Jumps straight to TDD (write failing test, fix, verify), then reviews and ships. Use this when production is broken and speed matters.

---

### Refactoring

```
/orchestrate refactor "extract payment logic from checkout controller into service layer"
```

**Pipeline:** Plan -> Architect -> Review -> Pre-Landing -> Ship

Different from feature: uses the **architect** agent instead of TDD-guide for the implementation step. The architect designs the structural changes first. If dead code is detected, the **refactor-cleaner** agent automatically cleans it up.

---

### Security Audit

```
/orchestrate security "audit authentication and payment flows"
```

**Pipeline:** Plan -> Security Review -> Code Review -> Pre-Landing

This workflow **does not ship**. It produces a security assessment:
1. Planner scopes the audit
2. Security-reviewer agent does deep architecture-level analysis
3. Code-reviewer agent does code-level security analysis
4. gstack `/review` does final structural check

Use this before launches, after adding auth/payment features, or on a regular cadence.

---

### QA Pass

```
/orchestrate qa
```

**Pipeline:** Pre-Landing Review -> QA

Lightweight. Runs structural review then full QA on the current branch. No planning, no implementation, no shipping. Use this to verify quality before merging someone else's PR or after manual changes.

---

### Custom Workflow

```
/orchestrate custom "architect,database-reviewer,tdd-guide" "redesign caching layer"
```

Run any combination of agents in sequence, then pre-landing review and ship. Use this when the standard modes don't fit.

---

## Design Systems (Auto-Injected)

founder-stack includes 54 complete design systems extracted from real production websites, sourced from [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT, 14K+ stars). Each provides exact color tokens, typography scales, component specs, layout rules, elevation systems, do's/don'ts, and AI agent prompt guides.

### How It Works

1. **During `/orchestrate feature` or `/orchestrate project`** with UI work, if no `DESIGN.md` exists in the project root, the workflow auto-suggests a matching design system
2. **Run `/design-reference pick`** to browse and select interactively, or `/design-reference apply stripe` to apply directly
3. **Once applied**, every agent (planner, tdd-guide, code-reviewer, `/ux`, `/qa`) automatically reads the `DESIGN.md` -- no prompt changes needed

### Available Brands (54)

| Category | Brands |
|----------|--------|
| **AI & Developer Tools** | claude, cohere, cursor, elevenlabs, minimax, mistral.ai, ollama, opencode.ai, together.ai, x.ai, composio, voltagent, replicate |
| **Design & Productivity** | figma, framer, miro, notion, webflow, airtable, cal, mintlify, raycast, warp, superhuman, lovable |
| **Infrastructure & DevOps** | clickhouse, hashicorp, mongodb, sentry, posthog, sanity, supabase, vercel, expo |
| **Fintech & Crypto** | stripe, coinbase, kraken, revolut, wise |
| **Enterprise & Consumer** | airbnb, apple, bmw, ibm, nvidia, spacex, spotify, uber, pinterest, intercom, runwayml, resend, clay, zapier |

### What Each Design System Contains

| Section | Content |
|---------|---------|
| Visual Theme & Atmosphere | Brand personality and signature elements |
| Color Palette & Roles | 20-40 named tokens with hex values |
| Typography Rules | Full hierarchy with font/size/weight/line-height |
| Component Stylings | Buttons, cards, inputs, nav with exact specs |
| Layout Principles | Spacing system, grid, border-radius scale |
| Depth & Elevation | Multi-level shadow systems |
| Do's and Don'ts | Explicit guardrails for staying on-brand |
| Responsive Behavior | Breakpoints, touch targets, collapsing |
| Agent Prompt Guide | Quick reference + example component prompts |

### Commands

```
/design-reference                  # list all 54 design systems
/design-reference pick             # get recommendations for your project
/design-reference stripe           # view the Stripe design system
/design-reference apply linear.app # copy to DESIGN.md in project root
/design-reference compare stripe vercel  # side-by-side comparison
```

Design systems stay current via `/update` -- new brands are added as the upstream project grows.

---

## 10x Productivity Patterns

### 1. Use the Right Slash Commands Directly

You don't always need `/orchestrate`. These standalone commands are powerful on their own:

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `/plan` | Create implementation plan, wait for confirmation | Before complex work |
| `/tdd` | Write tests first, then implement | Any code change |
| `/review` | Structural safety review (gstack) | Before merging |
| `/qa` | Systematic QA with headless browser (gstack) | After deploying to preview |
| `/ship` | Merge, test, version, push, PR (gstack) | When ready to ship |
| `/browse` | Headless browser for inspection/testing (gstack) | Checking deployed pages |
| `/research` | Deep company/product/market research (gstack) | Due diligence, competitive analysis |
| `/bookmark` | Save session state for later (gstack) | End of work session |
| `/build-fix` | Fix build/type errors incrementally | When build is broken |
| `/e2e` | Generate and run Playwright tests | Critical user flows |
| `/code-review` | Comprehensive security + quality review | After writing code |
| `/save-session` | Capture state for resume | Before hitting context limits |
| `/resume-session` | Load previous session | Starting new session on same work |
| `/learn` | Extract reusable patterns | After solving non-trivial problems |
| `/context-budget` | Analyze context window usage | When sessions feel slow |
| `/audit` | Dependency and security scan (gstack) | Before releases, after adding deps |
| `/retro` | Engineering retrospective (gstack) | Weekly team review |
| `/design-reference` | Browse and apply 54 production design systems | UI/frontend work |
| `/update` | Pull latest from ECC + gstack + design-md upstreams | Staying current |

### 2. Parallel Agent Execution

The system launches independent agents in parallel automatically. But you can also do this manually:

```
Review the auth module for security, the cache system for performance, 
and the utilities for type safety -- all in parallel.
```

Claude will spawn `security-reviewer`, `performance-optimizer`, and `typescript-reviewer` simultaneously.

### 3. Product-First Development

Before writing any code, use the strategy skills:

```
/pmf-review             # Is this product worth building?
/plan-ceo-review        # Challenge the vision (10-star product thinking)
/plan-eng-review        # Lock in the execution plan
/ux                     # Review UX before implementation
/product-lens           # Validate the "why" before the "how"
```

These skills are opinionated and interactive. They'll push back on your assumptions.

### 4. Session Continuity

Never lose context between sessions:

```
/bookmark save "stripe-integration"    # End of session
# ... new session ...
/bookmark resume "stripe-integration"  # Full context restored
```

Or use the lighter-weight:
```
/save-session     # Quick capture
/resume-session   # Load latest
```

### 5. Continuous Learning

The system learns from your sessions automatically (via hooks). You can also explicitly extract patterns:

```
/learn          # Extract patterns from this session
/evolve         # Analyze instincts and suggest evolved structures
```

Over time, this builds a library of project-specific patterns that make future sessions more effective.

### 6. Blueprint for Multi-Session Projects

For work spanning multiple sessions:

```
/blueprint "migrate from REST to GraphQL"
```

Produces a step-by-step plan where each step has a self-contained context brief. A fresh Claude session can pick up any step cold, without needing history from previous sessions.

### 7. Research Before Coding

The development workflow enforces research-first:

1. GitHub code search (`gh search repos`, `gh search code`)
2. Library docs (Context7 MCP)
3. Web research (Exa) -- only if first two are insufficient
4. Package registries (npm, PyPI, crates.io)

Use `/search-first` or `/docs` to trigger this explicitly.

### 8. Multi-Model Cost Optimization

The system routes tasks to the right model automatically:

| Model | Used For | Cost |
|-------|----------|------|
| **Haiku 4.5** | Doc generation, lightweight agents, worker agents | Cheapest |
| **Sonnet 4.6** | Main development, code review, implementation | Mid |
| **Opus** | Architecture decisions, planning, complex reasoning | Highest |

You can see your context budget with `/context-budget`.

---

## Keeping It Updated

founder-stack tracks three upstreams:

- **ECC**: `github.com/affaan-m/everything-claude-code`
- **gstack**: `github.com/obedier/obstack`
- **awesome-design-md**: `github.com/VoltAgent/awesome-design-md`

### Preview Changes

```
/update
```

Or from the terminal:
```bash
bash scripts/update.sh --dry-run
```

### Apply Updates

```bash
bash scripts/update.sh         # Interactive: shows diff, asks for confirmation
./install.sh --skip-gstack-build  # Deploy to ~/.claude/
```

### Update Only Design Systems

```bash
bash scripts/update.sh --design-md-only
```

### What's Protected

Updates never overwrite your custom files:
- `commands/orchestrate.md` -- the unified workflow
- `commands/update.md` -- the update command itself
- `skills/kit-*` -- sprint kit skills
- `agent_docs/` -- agent coordination docs
- `templates/` -- project templates

---

## The Skill Catalog

### Development Workflow
| Skill | Purpose |
|-------|---------|
| `tdd-workflow` | RED-GREEN-REFACTOR with 80%+ coverage |
| `search-first` | Research existing solutions before writing code |
| `coding-standards` | Universal TS/JS/React/Node conventions |
| `frontend-patterns` | React/Next.js components, state, performance |
| `backend-patterns` | API design, repos, services, caching, auth |
| `api-design` | REST conventions, status codes, pagination |
| `database-migrations` | Safe schema changes, zero-downtime patterns |
| `git-workflow` | Branching, commits, PRs, conflict resolution |

### Quality & Security
| Skill | Purpose |
|-------|---------|
| `security-review` | OWASP Top 10, secrets, auth, XSS, CSRF |
| `verification-loop` | Build + types + lint + tests + security scan |
| `santa-method` | Dual independent review (both must pass to ship) |
| `quality-gate` | On-demand quality pipeline |

### Design & UX
| Skill | Purpose |
|-------|---------|
| `design-reference` | Browse and apply 54 production design systems (auto-injected) |
| `design-system` | Generate or audit design systems from existing code |
| `ux` | UX review: IA, journeys, states, accessibility |
| `frontend-design` | Create distinctive, production-grade frontend interfaces |

### Product Strategy (gstack)
| Skill | Purpose |
|-------|---------|
| `pmf-review` | Product-market fit analysis with validation plan |
| `plan-ceo-review` | 10-star product thinking, scope challenge |
| `plan-eng-review` | Execution plan review, edge cases, performance |
| `research` | Company, product, competitor, market dossiers |
| `product-lens` | Validate "why" before building |

### QA & Testing (gstack)
| Skill | Purpose |
|-------|---------|
| `browse` | Headless browser (~100ms/command, persistent sessions) |
| `qa` | Systematic QA: full, quick, or regression mode |
| `ios-qa` | iOS simulator testing with screenshots |
| `e2e-testing` | Playwright patterns, Page Object Model, flaky test fixes |
| `browser-qa` | Visual testing, accessibility, responsive checks |
| `contract-check` | Validate API implementation matches OpenAPI contracts |

### Shipping (gstack)
| Skill | Purpose |
|-------|---------|
| `ship` | Merge, test, review, version, push, PR -- fully automated |
| `review` | Pre-landing structural safety review |
| `audit` | Dependency vulnerabilities + license compliance |
| `deployment-patterns` | CI/CD, Docker, health checks, rollback |

### AI & Agent Patterns
| Skill | Purpose |
|-------|---------|
| `blueprint` | Multi-session project plan with dependency graph |
| `autonomous-loops` | Patterns from sequential to RFC-driven DAG |
| `agentic-engineering` | Eval-first execution, cost-aware routing |
| `continuous-learning` | Extract reusable patterns from sessions |
| `continuous-learning-v2` | Instinct-based learning with project scoping |
| `agent-harness-construction` | Optimize agent action spaces and tools |

### Language-Specific
| Language | Reviewer | Build Resolver | Test | Patterns |
|----------|----------|----------------|------|----------|
| TypeScript/JS | `typescript-reviewer` | `build-error-resolver` | `tdd-workflow` | `frontend-patterns`, `backend-patterns` |
| Python | `python-reviewer` | -- | `python-testing` | `python-patterns` |
| Go | `go-reviewer` | `go-build-resolver` | `golang-testing` | `golang-patterns` |
| Rust | `rust-reviewer` | `rust-build-resolver` | `rust-testing` | `rust-patterns` |
| Java | `java-reviewer` | `java-build-resolver` | `springboot-tdd` | `springboot-patterns` |
| Kotlin | `kotlin-reviewer` | `kotlin-build-resolver` | `kotlin-testing` | `kotlin-patterns` |
| C++ | `cpp-reviewer` | `cpp-build-resolver` | `cpp-testing` | `cpp-coding-standards` |
| Swift | -- | -- | -- | `swiftui-patterns` |
| Flutter/Dart | `flutter-reviewer` | -- | -- | -- |
| PHP/Laravel | -- | -- | `laravel-tdd` | `laravel-patterns` |
| Perl | -- | -- | `perl-testing` | `perl-patterns` |
| Django | -- | -- | `django-tdd` | `django-patterns` |

---

## Architecture Deep Dive

### Directory Structure

```
founder-stack/
├── agents/          # 30 agent definitions (.md files)
├── commands/        # 60+ slash commands (.md files)
├── design-systems/  # 54 production design systems (.md files, from awesome-design-md)
├── rules/           # Layered rules system
│   ├── common/      # Universal principles (always active)
│   ├── typescript/   # TS/JS extensions
│   ├── python/       # Python extensions
│   ├── golang/       # Go extensions
│   ├── swift/        # Swift extensions
│   ├── php/          # PHP/Laravel extensions
│   └── zh/           # Chinese translations
├── skills/          # 148+ skill directories
│   ├── gstack/      # QA, review, ship, product strategy
│   ├── kit-*/       # Sprint kit phases
│   ├── design-reference/  # Design system browser/selector
│   └── .../         # ECC skills (one dir per skill)
├── hooks/           # Hook configurations (hooks.json)
├── scripts/
│   ├── hooks/       # Hook implementation scripts
│   ├── lib/         # Shared libraries
│   └── update.sh    # Upstream update script
├── agent_docs/      # Sprint kit agent coordination docs
├── templates/       # Project scaffolding templates
├── manifests/       # Installation profiles and modules
├── schemas/         # JSON Schema definitions
├── examples/        # Example CLAUDE.md files for different stacks
├── install.sh       # Installer
├── CLAUDE.md        # Project instructions
└── .upstream        # Tracked upstream SHAs (ECC + gstack + design-md)
```

### How Agents, Skills, and Hooks Relate

```
User types /orchestrate feature "..."
       │
       ▼
  orchestrate.md (command)
       │
       ├── Checks: DESIGN.md in project root ──► if missing + UI work, suggests /design-reference pick
       ├── Spawns: planner agent ──► produces implementation plan
       ├── Spawns: tdd-guide agent ──► writes tests, implements (using DESIGN.md tokens if present)
       ├── Spawns: typescript-reviewer agent ──► (auto-detected)     ┐
       ├── Spawns: security-reviewer agent ──► (if auth/API touched) ├ parallel
       ├── Spawns: database-reviewer agent ──► (if SQL touched)      ┘
       ├── Invokes: /review skill (gstack) ──► structural safety
       ├── Invokes: /qa skill (gstack) ──► headless browser QA
       └── Invokes: /ship skill (gstack) ──► merge, test, push, PR

Meanwhile, hooks run on every tool call:
  PreToolUse ──► format validation, config protection, security
  PostToolUse ──► auto-format, type-check, quality gate
  Stop ──► session metrics, pattern extraction, notifications
```

### The Hook Flag System

Hooks are controlled via environment variables:

| Variable | Purpose |
|----------|---------|
| `ECC_HOOK_PROFILE` | `minimal`, `standard` (default), or `strict` |
| `ECC_DISABLED_HOOKS` | Comma-separated hook IDs to disable |
| `ECC_GOVERNANCE_CAPTURE` | Set to `1` for governance event logging |
| `ECC_ENABLE_INSAITS` | Set to `1` for AI security monitoring |
| `CLAUDE_PLUGIN_ROOT` | Path to scripts directory (set to `~/.claude`) |

### Source of Truth Hierarchy

When specs conflict during project builds, this hierarchy resolves disputes:

1. **User's description + clarifying answers** -- intent is supreme
2. **GUARDRAILS.md** -- hard rules agents cannot break
3. **PRODUCT_BRIEF.md** -- synthesized product spec
4. **API_CONTRACTS.md** -- typed interface contracts
5. **DATA_MODEL.md** -- entity definitions
6. **ARCHITECTURE.md** -- system design
7. **SPRINT_PLAN.md** -- execution plan
8. **Code** -- lowest priority (change code to match specs, never reverse)

### Rules Layering

```
rules/common/coding-style.md     ← universal defaults
       +
rules/typescript/coding-style.md ← TS-specific overrides (takes precedence)
```

Language-specific rules extend common rules. When they conflict, language-specific wins. Example: common rules recommend immutability; Go rules allow pointer receiver mutation because it's idiomatic.

---

## Troubleshooting

### Hook Errors ("PreToolUse:Bash hook error")

**Cause:** `CLAUDE_PLUGIN_ROOT` environment variable not set.

**Fix:** Add to `~/.claude/settings.json` under `"env"`:
```json
"CLAUDE_PLUGIN_ROOT": "/Users/yourname/.claude"
```

### gstack Skills Not Working

**Fix:**
```bash
cd ~/.claude/skills/gstack && ./setup
```

Requires `bun` to be installed. The setup script builds the headless browser binary and creates skill symlinks.

### Stale Hooks After Update

After running `/update` + `./install.sh`, start a new Claude Code session. Hooks are loaded at session start.

### Build Errors

Use the language-specific build resolver:
```
/build-fix                # auto-detects language
/rust-build               # Rust-specific
/go-build                 # Go-specific
/cpp-build                # C++ specific
/kotlin-build             # Kotlin/Gradle
/gradle-build             # Android/KMP
```

### Context Window Running Low

```
/context-budget           # see what's consuming context
/compact                  # compress conversation history
```

Avoid the last 20% of context for large-scale refactoring or multi-file features. Start a new session with `/bookmark` or `/save-session` to preserve state.

### Sprint Kit Phase Stuck

The ScrumMaster agent handles most stalls automatically. If it escalates:
1. Check `docs/OPEN_QUESTIONS.md` for unresolved items
2. Check `docs/DECISION_LOG.md` for recent decisions
3. Run `/kit-status` for current project state
4. Answer any questions, then resume with `/kit-sprint`

---

## Customizing

### Adding Project-Specific Rules

Create a `.claude/rules/` directory in your project:
```
your-project/
├── .claude/
│   ├── CLAUDE.md          # Project-specific instructions
│   └── rules/
│       └── my-rules.md    # Your rules (override globals)
```

### Adding Your Own Skills

Create a directory under `~/.claude/skills/your-skill/SKILL.md`:
```markdown
---
name: your-skill
description: What it does in one line
---

Instructions for Claude when this skill is invoked...
```

Invoke with `/your-skill` in any session.

### Disabling Specific Hooks

Set in your shell profile or `~/.claude/settings.json` env:
```json
"ECC_DISABLED_HOOKS": "post:edit:typecheck,post:edit:format"
```

### Using Example Configs

The `examples/` directory has production-ready CLAUDE.md files for common stacks:
- `saas-nextjs-CLAUDE.md` -- Next.js + Supabase + Stripe SaaS
- `go-microservice-CLAUDE.md` -- Go + PostgreSQL + gRPC
- `django-api-CLAUDE.md` -- Django + DRF + Celery
- `laravel-api-CLAUDE.md` -- Laravel + PostgreSQL + Redis
- `rust-api-CLAUDE.md` -- Rust API

Copy the relevant one to your project's `.claude/CLAUDE.md` and customize.

---

## License

MIT
