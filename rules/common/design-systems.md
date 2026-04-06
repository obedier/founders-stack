# Design Systems

## Automatic Design System Loading

When working on frontend code (React, Vue, Svelte, HTML, CSS, SwiftUI, Compose, Flutter), check for a `DESIGN.md` file in the project root. If one exists, treat it as the authoritative visual reference for all UI work.

## When DESIGN.md Exists

- **Use its color tokens** — never invent colors. Every color in generated code must trace back to a named token in DESIGN.md.
- **Follow its typography scale** — use the exact font families, sizes, weights, and line-heights specified.
- **Match its component specs** — buttons, cards, inputs, and navigation should follow the documented padding, border-radius, and shadow values.
- **Respect its do's and don'ts** — Section 7 contains explicit guardrails. Violations are treated as MEDIUM severity review findings.
- **Use its spacing system** — follow the documented spacing scale and layout principles.
- **Apply its elevation system** — use the shadow values from the depth/elevation section.

## When No DESIGN.md Exists

During `/orchestrate feature` or `/orchestrate project` workflows that involve UI:

1. **Check if the project has an existing design system** (CSS variables, Tailwind config, theme files)
2. **If no design system exists**, suggest selecting one from the design reference library (`/design-reference pick`)
3. **Do not block the workflow** — this is a suggestion, not a requirement

## Integration Points

| Workflow Step | How Design System Is Used |
|---------------|--------------------------|
| **Planning** | Reference DESIGN.md when planning UI components to ensure feasibility |
| **Implementation** | Generate code using exact tokens from DESIGN.md |
| **Code Review** | Verify generated UI code matches DESIGN.md tokens (color, typography, spacing) |
| **UX Review** | Use DESIGN.md as the quality bar alongside heuristics |
| **QA** | Check visual consistency against DESIGN.md specifications |

## Review Severity

| Issue | Severity |
|-------|----------|
| Using colors not in DESIGN.md | MEDIUM |
| Wrong font family or missing fallbacks | MEDIUM |
| Violating a Do's/Don'ts rule | MEDIUM |
| Completely ignoring DESIGN.md | HIGH |
| Inconsistent component styling across pages | MEDIUM |

> **Language note**: This rule applies only to projects with frontend/UI components. Backend-only, CLI, and library projects can ignore this rule entirely.
