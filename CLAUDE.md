# founder-stack

Consolidated Claude Code configuration: gstack + ECC + Agentic Sprint Kit.

## Quick Start

```bash
./install.sh                    # Full install to ~/.claude/
/update                         # Pull upstream changes from ECC + gstack
/orchestrate feature "desc"     # Single feature workflow
/orchestrate project "desc"     # Full v1 autonomous build
```

## What's Inside

| Source | What | Count |
|--------|------|-------|
| **ECC** | Agents, commands, rules, skills, hooks | 30 agents, 60 commands, 77 rules, 136 skills, 29 hooks |
| **gstack** | QA, review, ship, browse, product strategy | 17 skills |
| **Sprint Kit** | Spec-first autonomous project builder | 11 skills + agent docs |
| **Custom** | Unified orchestrate + progress tracker | /orchestrate, /update, statusline |

## Workflow Entry Points

| Command | When to Use |
|---------|-------------|
| `/orchestrate feature "desc"` | Build a single feature end-to-end |
| `/orchestrate project "desc"` | Build an entire v1 autonomously (spec-first, multi-sprint) |
| `/orchestrate bugfix "desc"` | Investigate and fix a bug |
| `/orchestrate refactor "desc"` | Restructure code safely |
| `/orchestrate hotfix "desc"` | Fast-track fix → ship |
| `/orchestrate security "desc"` | Security audit |
| `/orchestrate qa` | QA pass on current branch |

## Skill Priority

When gstack and ECC both cover a capability, prefer gstack:
- `/review` → gstack (structural safety review)
- `/qa` → gstack (systematic QA with browser)
- `/ship` → gstack (automated ship workflow)
- `/browse` → gstack (headless browser)
- `/research` → gstack (deep research)
- `/retro` → gstack (engineering retrospective)
- `/bookmark` → gstack (session save/resume)

## Sprint Kit Methodology

For full project builds (`/orchestrate project`), the sprint kit methodology applies:
- **Spec-first**: 9 spec documents generated before any code
- **Contract-driven**: Backend and frontend implement against API_CONTRACTS.md
- **ScrumMaster agent**: Background agent that resolves blockers autonomously
- **Source of truth**: PROMPT.md > GUARDRAILS > specs > code
- **Test-first**: All tests generated from acceptance criteria before implementation

Reference docs in `agent_docs/`:
- `agent-roles.md` — Agent role definitions and boundaries
- `coordination.md` — How agents avoid stepping on each other
- `guardrails.md` — What agents must never do
- `source-of-truth.md` — Conflict resolution hierarchy

## Upstream Tracking

This repo vendors two upstreams tracked in `.upstream`:
- **ECC**: github.com/affaan-m/everything-claude-code
- **gstack**: github.com/obedier/obstack

Run `/update` to pull latest changes. The update never overwrites custom files (orchestrate, sprint kit, agent_docs).
