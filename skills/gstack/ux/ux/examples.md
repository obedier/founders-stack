# Example Outputs and AskUserQuestion Style

These are reference examples for tone, level of specificity, and interaction style.

---

## Example 1: Step 0 Scope Challenge

### Input
Review UX for a new “bulk refund” workflow in an admin payments dashboard.

### Good output
## Step 0: Scope Challenge

### What already exists
- Existing single-refund flow already handles refund reason capture, confirmation, and success messaging.
- Existing transaction table already supports row selection and bulk export.
- Existing permissions model already distinguishes “view payments” vs “manage refunds”.

### Scope challenge
1. Existing pieces already solve most sub-problems:
   - selection: existing table row selection
   - refund reason capture: existing single-refund modal
   - confirmation: existing destructive-action confirmation pattern
2. Minimum UX change:
   - add bulk selection state
   - add bulk refund summary/confirmation
   - reuse existing refund reason and result states where possible
3. Complexity smell:
   - current plan introduces 2 new screens and a new wizard pattern
   - that looks overbuilt for a task users will likely do from the existing table context

We recommend **1: SCOPE REDUCTION** because this appears to be a table-adjacent action, not a net-new workflow. Reusing the current table + confirmation patterns better matches minimal surface area and pattern reuse.

A) **1A** Keep current big redesign with new wizard screen.  
Effort: high. Risk: medium. UX maintenance burden: high.

B) **1B** Reuse the existing payments table, add bulk-selection mode, and review that smaller UX.  
Effort: medium. Risk: low. UX maintenance burden: low.

C) **1C** Do nothing and keep only single refunds.  
Effort: none. Risk: product gap remains. UX maintenance burden: none.

---

## Example 2: Architecture / IA issue

### Good AskUserQuestion
Issue 2 — refund history placement is ambiguous.

We recommend **B: keep refund history in the transaction detail surface, and expose a summary link from the bulk result state**.  
This preserves the user mental model that refunds belong to transactions, not to a separate admin artifact, and avoids inventing a second place to inspect refund outcomes.

A) **2A** Add a brand-new “Bulk Refund History” page.  
Effort: high. Risk: medium. UX maintenance burden: high.

B) **2B** Keep history attached to transaction details and link to affected records after bulk completion.  
Effort: low. Risk: low. UX maintenance burden: low.

C) **2C** Only show a toast after completion and store no visible review path.  
Effort: lowest. Risk: high. UX maintenance burden: low.

---

## Example 3: Interaction quality issue

### Good AskUserQuestion
Issue 5 — the confirmation step is overloaded.

We recommend **A: split selection review from irreversible confirmation**.  
Users handling money need explicit confirmation, but combining line-item review, error warnings, and final action in one crowded modal increases risk and weakens clarity.

A) **5A** Use a two-step confirmation: review selection first, then confirm refund.  
Effort: medium. Risk: low. UX maintenance burden: medium.

B) **5B** Keep one modal but collapse warnings and details behind accordions.  
Effort: low. Risk: medium. UX maintenance burden: medium.

C) **5C** Keep the current crowded confirmation modal.  
Effort: none. Risk: high. UX maintenance burden: high.

---

## Example 4: State coverage diagram

### Good output
## Core flow / state diagram

```text
[Table Default]
   |
   +--> select 1+ rows
           |
           v
   [Bulk Action Bar Visible]
           |
           +--> cancel selection ------> [Table Default]
           |
           +--> click "Refund Selected"
                       |
                       v
              [Selection Review]
                       |
                       +--> invalid items found ----> [Review With Warnings]
                       |                                   |
                       |                                   +--> remove invalid items
                       |                                   +--> cancel
                       |
                       +--> continue
                               |
                               v
                        [Final Confirmation]
                               |
                               +--> confirm ----> [Submitting]
                               |                       |
                               |                       +--> full success ----> [Success Summary]
                               |                       +--> partial failure --> [Partial Result]
                               |                       +--> hard failure -----> [Error State]
                               |
                               +--> cancel -----> [Selection Review]
Good gap identification

Gaps:

No explicit state for “partial success”.

No defined behavior for invalid rows discovered after selection.

No retry path from hard failure.

No persistence rule for selected rows after a failed submission.


Example 5: Accessibility / responsive issue
Good AskUserQuestion
Issue 8 — the bulk action bar becomes unusable on small screens.
We recommend B: collapse secondary actions into an overflow menu and keep only count + primary action visible.
That preserves clarity and keeps the core action reachable on mobile without forcing users into a totally different mental model.
A) 8A Keep the full action bar and allow horizontal scrolling.
Effort: low. Risk: high. UX maintenance burden: medium.
B) 8B Show selected count + primary action, move secondary actions into overflow.
Effort: medium. Risk: low. UX maintenance burden: low.
C) 8C Disable bulk refund on mobile entirely.
Effort: low. Risk: medium. UX maintenance burden: low.
________________________________________
Example 6: Failure modes section
Good output
Failure modes
1.	Partial API timeout after some refunds succeed
•	Coverage exists: no
•	UX fallback exists: partial
•	User sees clear message: no
•	Result: critical gap
2.	User loses selection because table refetches after filter change
•	Coverage exists: no
•	UX fallback exists: no
•	User sees clear message: confusing
•	Result: critical gap
3.	Refund blocked by missing permission
•	Coverage exists: yes
•	UX fallback exists: yes
•	User sees clear message: yes
•	Result: covered
________________________________________
Example 7: TODO prompt style
Good AskUserQuestion
Potential TODO 2
What: Add a downloadable CSV result for bulk refund outcomes.
Why: Admin users may need an auditable list of successes and failures after large refund batches.
Pros: Better operations follow-up, easier reconciliation, stronger trust.
Cons: Extra output format, more QA surface, unclear value for small-volume teams.
Context: Current success summary is good for immediate review but weak for operational handoff. This matters more if users process dozens or hundreds of refunds at once.
Depends on / blocked by: Stable partial-result schema.
We recommend A: add to TODOS.md, not build now.
Useful operationally, but not required for the first usable version of the flow.
A) Add to TODOS.md
B) Skip — not valuable enough
C) Build it now in this PR
________________________________________
Example 8: Bad vs good recommendation style
Bad
“This area might be improved by making the flow simpler.”
Good
“Move advanced filters behind a ‘More filters’ disclosure and keep only status + date visible by default. That preserves scanability for first-time users and still supports expert filtering.”
________________________________________
Example 9: Compressed SMALL CHANGE format
Good output
SMALL CHANGE review
1.	Architecture / IA
o	Main issue: new settings page duplicates controls already present in workspace setup.
o	Recommendation: consolidate advanced controls into existing workspace settings.
2.	Interaction Quality
o	Main issue: primary CTA competes visually with “Test connection”.
o	Recommendation: make “Save and connect” primary, demote “Test connection”.
3.	State Coverage
o	Main issue: no explicit permission-blocked state.
o	Recommendation: add blocked state with required role + next step.
4.	Accessibility / Responsive
o	Main issue: connection-status badges rely on color alone.
o	Recommendation: add icon + text state labels.
[Workspace Settings]
   |
   +--> [Integration Card]
            |
            +--> connect
            +--> test connection
            +--> permission blocked
            +--> saving
            +--> success
            +--> failure