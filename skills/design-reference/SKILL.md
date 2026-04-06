---
name: design-reference
description: >-
  Browse, select, and apply production design systems from 54 real-world brands
  (Stripe, Linear, Airbnb, Vercel, etc.) to any frontend project. Auto-injects
  design tokens, typography, components, and do's/don'ts so AI agents generate
  on-brand UI without guessing. Source: awesome-design-md (MIT).
origin: awesome-design-md
---

# Design Reference — Production Design Systems

54 complete design systems extracted from real production websites, optimized for AI agent consumption. Each provides exact color tokens, typography scales, component specs, layout rules, elevation systems, responsive breakpoints, do's/don'ts, and agent prompt guides.

## User-invocable

When the user types `/design-reference`, run this skill.

## Arguments

- `/design-reference` — list all available design systems
- `/design-reference list` — same as above
- `/design-reference <brand>` — load a specific design system (e.g., `/design-reference stripe`)
- `/design-reference pick` — interactive picker: describe your project and get recommended design systems
- `/design-reference apply <brand>` — copy the design system to DESIGN.md in the project root
- `/design-reference compare <brand1> <brand2>` — side-by-side comparison of two design systems

## Available Design Systems (54)

### AI & Developer Tools
`claude`, `cohere`, `cursor`, `elevenlabs`, `minimax`, `mistral.ai`, `ollama`, `opencode.ai`, `together.ai`, `x.ai`, `composio`, `voltagent`, `replicate`

### Design & Productivity
`figma`, `framer`, `miro`, `notion`, `webflow`, `airtable`, `cal`, `mintlify`, `raycast`, `warp`, `superhuman`, `lovable`

### Infrastructure & DevOps
`clickhouse`, `hashicorp`, `mongodb`, `sentry`, `posthog`, `sanity`, `supabase`, `vercel`, `expo`

### Fintech & Crypto
`stripe`, `coinbase`, `kraken`, `revolut`, `wise`

### Enterprise & Consumer
`airbnb`, `apple`, `bmw`, `ibm`, `nvidia`, `spacex`, `spotify`, `uber`, `pinterest`, `intercom`, `runwayml`, `resend`, `clay`, `zapier`

## Storage

Design system files are stored in the founder-stack repo at `design-systems/<brand>.md`. When installed, they are copied to `~/.claude/design-systems/`.

## What Each Design System Contains (9 sections)

| Section | What It Provides |
|---------|-----------------|
| **1. Visual Theme & Atmosphere** | Brand personality, key visual characteristics, signature elements |
| **2. Color Palette & Roles** | 20-40 named color tokens with hex values, organized by role (primary, accent, surface, neutral, semantic) |
| **3. Typography Rules** | Font families with fallbacks, full hierarchy table (role/font/size/weight/line-height/letter-spacing) |
| **4. Component Stylings** | Buttons (3-6 variants), cards, inputs, navigation, badges — with exact padding, radius, shadow values |
| **5. Layout Principles** | Spacing system, grid/container specs, whitespace philosophy, border-radius scale |
| **6. Depth & Elevation** | Multi-level shadow systems with exact CSS shadow values |
| **7. Do's and Don'ts** | Explicit guardrails to prevent AI from drifting off-brand |
| **8. Responsive Behavior** | Breakpoints, touch targets, collapsing strategies |
| **9. Agent Prompt Guide** | Quick color reference, example component prompts, iteration guide |

## Automatic Integration

This skill is automatically invoked by the orchestrate workflow when:
- A `feature` or `project` workflow involves UI/frontend work
- No `DESIGN.md` exists in the project root
- The user hasn't explicitly opted out of design system suggestions

When auto-invoked, the workflow:
1. Detects the project type and aesthetic from existing code/README
2. Recommends 2-3 matching design systems
3. Asks the user to pick one (or skip)
4. Copies the selected DESIGN.md to the project root

## How It Works in Practice

Once a DESIGN.md is in the project root, **every agent that generates frontend code automatically reads it** — no prompt injection needed. The design system becomes part of the project context just like CLAUDE.md.

### For the /ux skill
The `/ux` review uses the active DESIGN.md as its quality bar instead of (or in addition to) Apple HIG. This means UX reviews validate against **your chosen design system**, not a generic standard.

### For implementation agents
The tdd-guide, architect, and code-reviewer agents all see DESIGN.md in the project root and use its tokens, component specs, and do's/don'ts when generating or reviewing frontend code.

### For /qa
The QA skill checks visual consistency against the design system's color tokens, spacing, and component specs.

---

## LIST workflow

When listing, read the `design-systems/` directory and display:

```
Available Design Systems (54)
=============================

AI & Developer Tools:
  claude        cohere        cursor        elevenlabs    minimax
  mistral.ai    ollama        opencode.ai   together.ai   x.ai
  composio      voltagent     replicate

Design & Productivity:
  figma         framer        miro          notion        webflow
  airtable      cal           mintlify      raycast       warp
  superhuman    lovable

Infrastructure & DevOps:
  clickhouse    hashicorp     mongodb       sentry        posthog
  sanity        supabase      vercel        expo

Fintech & Crypto:
  stripe        coinbase      kraken        revolut       wise

Enterprise & Consumer:
  airbnb        apple         bmw           ibm           nvidia
  spacex        spotify       uber          pinterest     intercom
  runwayml      resend        clay          zapier

Usage:
  /design-reference <brand>         — view a design system
  /design-reference pick            — get recommendations for your project
  /design-reference apply <brand>   — copy to project root as DESIGN.md
```

## PICK workflow

When the user runs `/design-reference pick`:

1. Read the project's README.md, package.json, and any existing CSS/theme files
2. Identify the project type (SaaS, fintech, developer tool, consumer app, etc.)
3. Recommend 2-3 design systems that match the project's domain and aesthetic
4. For each recommendation, explain why it's a good fit (1 sentence)
5. Ask the user to choose one or skip

## APPLY workflow

When the user runs `/design-reference apply <brand>`:

1. Read `~/.claude/design-systems/<brand>.md`
2. Write it to `DESIGN.md` in the project root
3. Confirm: "Design system applied: <brand>. All agents will now use this as the visual reference."

## COMPARE workflow

When the user runs `/design-reference compare <brand1> <brand2>`:

1. Read both design system files
2. Display a comparison table covering:
   - Color palette contrast (warm vs cool, dark vs light)
   - Typography approach (serif vs sans, weights, scale)
   - Component style (rounded vs sharp, shadows vs flat)
   - Overall feel (1-2 words each)

---

## Upstream

Source: https://github.com/VoltAgent/awesome-design-md (MIT license)
Tracked in `.upstream` as `design_md=<sha>`.
Updated via `/update --design-md-only` or as part of the standard `/update` flow.
