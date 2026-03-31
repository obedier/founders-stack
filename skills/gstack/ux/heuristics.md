# UX Review Heuristics

Use this rubric when running `master-ux-review`.  
This file is for evaluation depth, not for user-facing verbosity.

## 1. Clarity
Questions:
- Is it obvious what this screen/flow is for?
- Is the primary action unmistakable?
- Are labels concrete instead of internal/jargony?
- Can a new user predict what happens next?

Look for:
- vague labels
- overloaded screens
- unclear CTAs
- hidden system state
- ambiguous outcomes

Severity guide:
- High: user may choose the wrong action or fail to proceed
- Medium: user can proceed but with hesitation or confusion
- Low: mild wording or hierarchy cleanup

## 2. Information Architecture
Questions:
- Are things grouped by user mental model rather than backend structure?
- Can users predict where features/settings live?
- Are navigation categories mutually understandable?
- Does the hierarchy feel shallow enough to scan but deep enough to organize?

Look for:
- duplicate destinations
- settings scattered across pages
- weak grouping logic
- mixed object types in one surface
- navigation that reflects org chart rather than user goals

## 3. Primary vs Secondary Action Hierarchy
Questions:
- Is there one clear main action?
- Are destructive or low-priority actions visually demoted?
- Are secondary actions available without competing?

Look for:
- equal-weight buttons
- too many CTAs
- dangerous actions too close to primary flow
- “Save”, “Submit”, “Continue”, “Confirm” used inconsistently

## 4. Progressive Disclosure
Questions:
- Is complexity revealed only when needed?
- Are advanced options available without overwhelming default users?
- Does the plan avoid forcing users through low-value decisions early?

Look for:
- too many fields at once
- advanced controls shown by default
- dense configuration before first success
- modals/panels opened for trivial details

## 5. State Coverage
Every meaningful screen/flow should define:
- default state
- loading state
- empty state
- error state
- success state
- warning state where relevant
- disabled state where relevant
- permission-blocked state where relevant

Look for:
- silent failures
- blank empties
- spinners without copy
- success with no next step
- permissions that dead-end users

## 6. Error Prevention and Recovery
Questions:
- Can users make avoidable mistakes?
- Are risky actions gated appropriately?
- If something goes wrong, can users recover?

Look for:
- destructive actions without confirmation
- insufficient inline validation
- poor retry behavior
- missing unsaved-changes warning
- technical error text exposed to users
- no recovery path after failure

## 7. Trust and Safety
Important for:
- fintech
- AI
- healthcare
- legal
- identity/admin
- permissions
- billing
- irreversible workflows

Questions:
- Is the system honest about uncertainty?
- Are fees/timing/risk made visible at the right time?
- Are permissions and consequences clear?
- Are users reassured appropriately without fake confidence?

Look for:
- hidden fees or consequences
- AI certainty theater
- unclear approval state
- vague confirmation language
- missing audit/history cues
- silent background changes

## 8. Consistency / DRY in UX
Questions:
- Are similar actions handled the same way?
- Are patterns reused instead of reinvented?
- Are naming and interaction rules consistent across screens?

Look for:
- multiple patterns for same task
- different terms for same object
- one flow uses drawer, another modal, another page for same complexity
- inconsistent button placement
- conflicting empty state tone

## 9. Forms and Input Design
Questions:
- Are fields grouped logically?
- Are labels clear and persistent?
- Is validation timely and specific?
- Is the minimum required input being collected?

Look for:
- placeholder-only labels
- mixed formatting expectations
- unclear required vs optional fields
- premature validation noise
- poor autofill/mobile keyboard choices
- overly long forms without chunking

## 10. Accessibility
Baseline:
- keyboard reachable
- visible focus states
- touch targets large enough
- sufficient contrast
- semantic labeling
- no color-only meaning
- screen reader understandable structure
- error messaging connected to fields

Look for:
- inaccessible custom controls
- hover-only affordances
- icon-only actions without labels
- modal focus traps done poorly
- tables unusable on mobile or screen reader

## 11. Responsive Behavior
Questions:
- What collapses first?
- What stays sticky?
- What becomes hidden behind overflow?
- Does the dense layout still work on narrow screens?

Look for:
- desktop assumptions
- important columns disappearing without replacement
- modals too tall for mobile
- filters that become impossible to discover
- action bars pushed off-screen

## 12. Perceived Performance
Questions:
- Does the UI feel responsive while work happens?
- Is there progress feedback?
- Is latency masked appropriately?

Look for:
- spinner-only waits
- unclear “saving” vs “saved”
- layout jump during load
- no skeleton/placeholders where useful
- optimistic updates without rollback handling

## 13. First-Time User vs Repeat User Balance
Questions:
- Can a new user succeed?
- Can a repeat user move fast?
- Is onboarding proportionate to complexity?

Look for:
- new users dropped into dense UI
- too much handholding for experts
- no shortcuts/bulk flows for repeat behavior
- no first-success moment

## 14. AI-Specific Heuristics
Questions:
- Is model output distinguishable from system facts?
- Can the user edit, retry, or override?
- Is confidence/uncertainty handled honestly?
- Are failure and fallback paths visible?

Look for:
- AI outputs presented as authoritative truth
- no retry/refine controls
- no provenance/context
- hidden prompt side effects
- unpredictable state transitions after generation

## 15. Severity Framework
Use:
- Critical: user likely fails, loses trust, or causes damage
- High: major friction, confusion, or risk in core path
- Medium: usability issue with workaround
- Low: polish/consistency issue
- Note: improvement idea, not a defect

## 16. Recommendation Style
Recommendations should be:
- specific
- minimally invasive where possible
- tied to user goal
- tied to product/trust implications
- explicit about tradeoffs

Prefer:
- “Move X under Y and expose Z only after selection”
Over:
- “Improve organization”

Prefer:
- “Use one primary CTA, demote destructive actions to tertiary menu”
Over:
- “Make hierarchy clearer”

## 17. Output Shortcuts
When compressed, prioritize:
1. biggest IA flaw
2. biggest core-flow friction
3. biggest missing state
4. biggest trust/accessibility issue
5. biggest responsive risk