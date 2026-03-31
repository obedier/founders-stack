# PMF Review Templates

Reusable templates for the `pmf-review` skill.

---

## 1. Amazon Press Release Template

```text
HEADLINE: [Product] [Does What] for [Who]

SUBHEADLINE: [Target customer] [gets what benefit] — [key differentiator].

PROBLEM: [2-3 sentences. Current pain. Current workaround. Why that's bad.]

SOLUTION: [2-3 sentences. What the product does. How the experience differs.]

QUOTE FROM CUSTOMER: "[Specific outcome + emotion. One sentence.]"

HOW IT WORKS:
- [Step 1]
- [Step 2]
- [Step 3]
- [Step 4]

GETTING STARTED: [One sentence. First action.]

QUOTE FROM LEADER: "[Why this matters. One sentence.]"

CALL TO ACTION: [What to do right now.]
```

---

## 2. Problem Severity Scorecard

```text
PROBLEM SEVERITY SCORECARD
┌─────────────────────────────────┬───────┬─────────────────────────────┐
│ Dimension                       │ Score │ Evidence                    │
├─────────────────────────────────┼───────┼─────────────────────────────┤
│ Frequency                       │  /5   │                             │
│  5=daily 4=weekly 3=monthly     │       │                             │
│  2=quarterly 1=yearly           │       │                             │
│                                 │       │                             │
│ Intensity                       │  /5   │                             │
│  5=crisis 4=blocking            │       │                             │
│  3=painful 2=annoying           │       │                             │
│  1=minor inconvenience          │       │                             │
│                                 │       │                             │
│ Willingness to Pay              │  /5   │                             │
│  5=urgent budget 4=approved     │       │                             │
│  3=would find budget            │       │                             │
│  2=maybe 1=never                │       │                             │
│                                 │       │                             │
│ Current Alternatives            │  /5   │                             │
│  5=none exist 4=terrible        │       │                             │
│  3=mediocre 2=decent            │       │                             │
│  1=good solution exists         │       │                             │
│                                 │       │                             │
│ Ease of Switching FROM Current  │  /5   │                             │
│  5=trivial (good for you)       │       │                             │
│  4=easy 3=moderate 2=painful    │       │                             │
│  1=prohibitive (incumbent moat) │       │                             │
├─────────────────────────────────┼───────┼─────────────────────────────┤
│ TOTAL                           │  /25  │                             │
└─────────────────────────────────┴───────┴─────────────────────────────┘

15+ = Strong    10-14 = Moderate    <10 = Weak
```

---

## 3. Market Sizing Template

```text
MARKET SIZE — BOTTOM UP
┌──────────────────────────────────────────────────────────────────────┐
│ TAM (Total Addressable Market)                                       │
│  = Total potential customers × Annual value per customer             │
│  = _______ × $______/yr = $_______/yr                                │
│  Source:                                                             │
│  Methodology:                                                        │
│                                                                      │
│ SAM (Serviceable Addressable Market)                                 │
│  = TAM filtered by reachable segments                                │
│  Filters: [ ] geography [ ] segment [ ] channel [ ] language         │
│  = _______ × $______/yr = $_______/yr                                │
│                                                                      │
│ SOM (Serviceable Obtainable Market)                                  │
│  Year 1: _______ × $______/yr = $_______/yr (____% of SAM)          │
│  Year 2: _______ × $______/yr = $_______/yr (____% of SAM)          │
│  Year 3: _______ × $______/yr = $_______/yr (____% of SAM)          │
│  Key assumptions:                                                    │
│                                                                      │
│ Reality Check:                                                       │
│  [ ] SOM Y1 > $1M? (viable business threshold)                      │
│  [ ] TAM > $100M? (venture-scale threshold)                          │
│  [ ] Capture rate Y1 < 10%? (realistic for new entrant)              │
│  [ ] Sources cited for all numbers?                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Competitive Landscape Template

```text
COMPETITIVE LANDSCAPE
┌─────────────────────┬──────────┬──────────┬──────────┬──────────────┐
│ Competitor           │ Strength │ Weakness │ Pricing  │ Est. Revenue │
├─────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│                      │          │          │          │              │
├─────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│                      │          │          │          │              │
├─────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│                      │          │          │          │              │
└─────────────────────┴──────────┴──────────┴──────────┴──────────────┘

Direct competitors: [same problem, same customer]
Indirect competitors: [same problem, different approach]
Substitute behaviors: [what people do instead of any product]
Non-consumption: [people who suffer the problem and do nothing]
Platform risk: [can the platform you build on copy this?]
```

---

## 5. Moat Scorecard Template

```text
MOAT SCORECARD
┌──────────────────────────┬───────┬──────────────────────────────────┐
│ Moat Type                │ Score │ Evidence / Plan                  │
├──────────────────────────┼───────┼──────────────────────────────────┤
│ Network Effects          │  /5   │                                  │
│ Data Advantage           │  /5   │                                  │
│ Switching Costs          │  /5   │                                  │
│ Economies of Scale       │  /5   │                                  │
│ Brand / Trust            │  /5   │                                  │
│ Regulatory / IP          │  /5   │                                  │
├──────────────────────────┼───────┼──────────────────────────────────┤
│ COMPOSITE MOAT SCORE     │  /30  │                                  │
└──────────────────────────┴───────┴──────────────────────────────────┘

20+ = Strong    12-19 = Developing    <12 = Weak
```

---

## 6. Feature Classification Template

```text
FEATURE CLASSIFICATION
┌──────────────────────┬──────────┬────────────┬─────────────────────┐
│ Feature               │ Type     │ Uniqueness │ PMF Role            │
│                       │ TS/Diff/ │ (1-5)      │ Must-have / Nice /  │
│                       │ Del      │            │ Differentiator /    │
│                       │          │            │ Delight             │
├──────────────────────┼──────────┼────────────┼─────────────────────┤
│                       │          │            │                     │
├──────────────────────┼──────────┼────────────┼─────────────────────┤
│                       │          │            │                     │
├──────────────────────┼──────────┼────────────┼─────────────────────┤
│                       │          │            │                     │
└──────────────────────┴──────────┴────────────┴─────────────────────┘

TS = Table Stakes    Diff = Differentiator    Del = Delight

Type: the competitive category (what it IS)
PMF Role: the user perception (what it DOES for adoption)
  - Must-have: required to compete, not a differentiator
  - Nice: useful but won't drive adoption
  - Differentiator: sets you apart from alternatives
  - Delight: unexpected value that creates word-of-mouth
```

---

## 7. Killer Feature Test Template

```text
KILLER FEATURE TEST — [Feature Name]
┌──────────────────────┬───────┬────────────────────────────────────────┐
│ Test                  │ Score │ Reasoning                              │
├──────────────────────┼───────┼────────────────────────────────────────┤
│ 10x better?          │  /5   │                                        │
│ Demo in 60s?         │  /5   │                                        │
│ Feel absence?        │  /5   │                                        │
│ Tell a friend?       │  /5   │                                        │
│ Switch tools for it? │  /5   │                                        │
├──────────────────────┼───────┼────────────────────────────────────────┤
│ AVERAGE              │  /5   │                                        │
└──────────────────────┴───────┴────────────────────────────────────────┘

<3 = Not a killer feature    3-4 = Strong differentiator    4+ = Killer
```

---

## 8. GTM Channel Analysis Template

```text
GTM CHANNEL ANALYSIS
┌─────────────────────┬──────────┬──────────┬──────────┬──────────────┐
│ Channel              │ CAC Est. │ Time to  │ Scale    │ Fit          │
│                      │          │ Results  │ Ceiling  │ (1-5)        │
├─────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Organic/SEO          │          │          │          │              │
│ Content marketing    │          │          │          │              │
│ Product-led growth   │          │          │          │              │
│ Sales-led            │          │          │          │              │
│ Partnerships         │          │          │          │              │
│ Community/DevRel     │          │          │          │              │
│ Paid acquisition     │          │          │          │              │
│ Viral/referral       │          │          │          │              │
└─────────────────────┴──────────┴──────────┴──────────┴──────────────┘
```

---

## 9. Unit Economics Template

```text
UNIT ECONOMICS
┌──────────────────────────────────────────────────────────────────────┐
│ Revenue                                                              │
│  ARPU (monthly):  $_____                                             │
│  ARPU (annual):   $_____                                             │
│  Gross margin:    _____% (Revenue - COGS / Revenue)                  │
│                                                                      │
│ Lifetime Value                                                       │
│  Avg lifespan:    _____ months                                       │
│  LTV = ARPU × Margin × Lifespan = $_____                            │
│                                                                      │
│ Acquisition                                                          │
│  CAC:             $_____                                             │
│  Primary channel: _____                                              │
│  Payback period:  _____ months                                       │
│                                                                      │
│ Ratios                                                               │
│  LTV:CAC =        _____:1 (target >3:1)                             │
│  Payback =        _____ months (target <12mo SaaS, <3mo SMB)        │
│                                                                      │
│ Burn & Runway                                                        │
│  Monthly burn:    $_____                                             │
│  Monthly revenue: $_____                                             │
│  Runway:          _____ months                                       │
│  Default alive?   yes / no / too early                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 10. Risk Register Template

```text
TOP RISKS
┌─────────────────────────────┬────────────┬────────────┬─────────────┐
│ Risk                         │ Likelihood │ Impact     │ Mitigation  │
├─────────────────────────────┼────────────┼────────────┼─────────────┤
│                              │ H / M / L  │ H / M / L  │             │
├─────────────────────────────┼────────────┼────────────┼─────────────┤
│                              │ H / M / L  │ H / M / L  │             │
├─────────────────────────────┼────────────┼────────────┼─────────────┤
│                              │ H / M / L  │ H / M / L  │             │
└─────────────────────────────┴────────────┴────────────┴─────────────┘
```

---

## 11. Validation Experiment Template

```text
VALIDATION PLAN
┌─────────────────┬────────────┬────────────┬──────────┬──────────────┐
│ Hypothesis       │ Experiment │ Success    │ Time     │ Cost         │
│                  │            │ Metric     │          │              │
├─────────────────┼────────────┼────────────┼──────────┼──────────────┤
│                  │            │            │          │              │
├─────────────────┼────────────┼────────────┼──────────┼──────────────┤
│                  │            │            │          │              │
├─────────────────┼────────────┼────────────┼──────────┼──────────────┤
│                  │            │            │          │              │
└─────────────────┴────────────┴────────────┴──────────┴──────────────┘
```

---

## 12. PMF Scorecard Template

All dimensions normalized to /5 for comparability.

```text
PMF SCORECARD — OVERALL ASSESSMENT
┌──────────────────────────────────┬───────┬──────────────────────────┐
│ Dimension                        │ Score │ Key Finding              │
├──────────────────────────────────┼───────┼──────────────────────────┤
│ Problem Severity                 │  /5   │ (mapped from /25 total)  │
│ Market Opportunity               │  /5   │ (from market sizing)     │
│ Competitive Moat                 │  /5   │ (mapped from /30 total)  │
│ Killer Feature Strength          │  /5   │ (best differentiator)    │
│ Sean Ellis Plausibility          │  /5   │ (thought experiment)     │
│ GTM Feasibility                  │  /5   │ (from channel analysis)  │
│ Unit Economics                   │  /5   │ (from LTV:CAC etc.)     │
│ Timing (why now)                 │  /5   │ (from Step 0B)          │
├──────────────────────────────────┼───────┼──────────────────────────┤
│ AVERAGE                          │  /5   │                          │
│ OVERALL PMF ASSESSMENT           │       │ Strong / Promising /     │
│                                  │       │ Weak / Not Yet           │
└──────────────────────────────────┴───────┴──────────────────────────┘

Thresholds:
  Average >= 4.0 = Strong — build with confidence
  Average 3.0-3.9 = Promising — validate weakest dimensions first
  Average 2.0-2.9 = Weak — significant pivots or de-risking needed
  Average < 2.0 = Not Yet — go back to problem discovery

Critical override: If ANY dimension = 1/5, overall cannot exceed "Weak"

Mapping guide:
  Problem Severity: /25 total → /5 (divide by 5)
  Competitive Moat: /30 total → /5 (divide by 6)
  Market Opportunity: SOM Y3 >$10M=5, $5-10M=4, $1-5M=3, $500K-1M=2, <$500K=1
  Unit Economics: LTV:CAC >5:1=5, 3-5:1=4, 2-3:1=3, 1-2:1=2, <1:1=1
    (FEATURE BET: payback <3mo=5, 3-6mo=4, 6-12mo=3, 12-24mo=2, >24mo=1)
```

---

## 13. Preliminary PMF Signal Template

Produced after Sections 1-4, before GTM and economics.

```text
PRELIMINARY PMF SIGNAL
┌──────────────────────────────────┬───────┐
│ Problem Severity                 │  /5   │
│ Timing                           │  /5   │
│ Competitive Moat                 │  /5   │
│ Killer Feature Strength          │  /5   │
│ Sean Ellis Plausibility          │  /5   │
├──────────────────────────────────┼───────┤
│ Average                          │  /5   │
│ Early Signal                     │       │
└──────────────────────────────────┴───────┘

>= 4.0 = Strong    3.0-3.9 = Promising    2.0-2.9 = Weak    < 2.0 = Not Yet
```

---

## 14. AskUserQuestion Template

```text
Issue [N] — [short title]

We recommend [LETTER]: [one-line reason].

Why: [1-2 sentences tied to market data, competitive dynamics, or
customer evidence — not opinion.]

A) [N]A — [option]. Impact: [quantified if possible]. Risk: [H/M/L].
B) [N]B — [option]. Impact: [quantified if possible]. Risk: [H/M/L].
C) [N]C — [option]. Impact: [quantified if possible]. Risk: [H/M/L].
```

---

## 15. Completion Summary Template

```text
┌════════════════════════════════════════════════════════════════════════┐
│                 PMF REVIEW — COMPLETION SUMMARY                       │
├═══════════════════════════┬════════════════════════════════════════════┤
│ Mode selected             │                                            │
│ Press Release             │ Written + revised                          │
│ Customer & Problem        │ Severity: __/25 (mapped: __/5)            │
│ Market Sizing             │ TAM: $__ SAM: $__ SOM Y3: $__             │
│ Competitive Landscape     │ ___ competitors mapped, moat: __/30       │
│ Killer Features           │ ___ features, ___ true killers            │
│ Sean Ellis Plausibility   │ __/5                                       │
│ GTM Plan                  │ Primary channel: ___, feasibility: __/5   │
│ Unit Economics            │ LTV:CAC = __:1, payback: __ months        │
│ PMF Assessment            │ __/5 avg → Strong/Promising/Weak/Not Yet  │
│ Top Risk                  │                                            │
│ #1 Validation Needed      │                                            │
│ What Already Exists       │ Written                                    │
│ TODOS proposed            │ ___                                        │
│ NOT in scope              │ ___ items                                  │
│ Unresolved decisions      │ ___ (listed below)                         │
└═══════════════════════════┴════════════════════════════════════════════┘
```
