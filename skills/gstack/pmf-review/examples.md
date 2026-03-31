# PMF Review — Example Outputs

Reference examples for tone, specificity, and interaction style.

---

## Example 1: Step 0 — Amazon Press Release

### Input
Review PMF for a tool that helps indie game developers playtest their games with real players.

### Good Output
```
HEADLINE: GameTest Connects Indie Developers with Playtesting Communities in Minutes

SUBHEADLINE: Solo game devs and small studios get real player feedback on
builds in progress — no recruiting, no scheduling, no guessing.

PROBLEM: Indie game developers spend months building in isolation. When they
finally share their game, the feedback comes too late to change direction.
Today, playtesting means begging friends, posting on Reddit and hoping, or
paying $5K+ for a formal playtest lab. Most indie devs just skip it and ship
blind.

SOLUTION: GameTest matches your build with players who love your genre.
Upload a build, set the session length, and get video recordings, heatmaps,
and written feedback within 48 hours. No scheduling. No minimum spend.

QUOTE FROM CUSTOMER: "I found a game-breaking UX issue in my tutorial that
I'd been blind to for six months. $50 and two days. I can't believe I almost
shipped without this."

HOW IT WORKS:
- Upload your build (Windows, Mac, or WebGL)
- Pick your genre and target audience
- Set session length and feedback focus areas
- Get video recordings, heatmaps, and structured feedback in 48 hours

GETTING STARTED: Upload your first build free — 3 playtesters included.

QUOTE FROM LEADER: "The best games are built with players, not for them.
We're making that accessible to every developer, not just studios with
budgets."

CALL TO ACTION: Upload your build at gametest.dev — first session free.
```

**Press release evaluation:**
- Headline: Clear, specific, no jargon. **OK**
- Problem: Real and well-articulated. The $5K lab comparison anchors value. **OK**
- Customer quote: Specific outcome, believable emotion. **OK**
- How it works: 4 steps, no technical jargon. **OK**
- **Concern:** "48 hours" is ambitious for a two-sided marketplace. Where do the playtesters come from? This is the riskiest assumption.

---

## Example 2: Market Sizing (Bottom-Up)

### Good Output
```
MARKET SIZE — BOTTOM UP

TAM (Total Addressable Market)
= Indie game developers worldwide who ship at least 1 game per year
= ~250,000 developers (Steam alone has 115K+ developers;
  add itch.io, mobile-only, console indie)
  × $600/yr (avg 2 playtest sessions × $300 each)
= $150M/yr
Source: Steam developer count (public), SteamDB data,
  itch.io creator stats, GDC survey data

SAM (Serviceable Addressable Market)
= English-speaking, PC-first indie devs with >$500 game dev budget
= ~80,000 developers × $600/yr = $48M/yr
Filters: Language (English-first at launch), platform (PC builds only
at launch), budget (filtered out hobbyists with zero budget)

SOM (Serviceable Obtainable Market)
Year 1: 500 developers × $400/yr = $200K (0.6% of SAM)
Year 2: 2,500 developers × $600/yr = $1.5M (3.1% of SAM)
Year 3: 8,000 developers × $800/yr = $6.4M (13.3% of SAM)
Assumptions: Viral spread through indie dev communities,
  Year 2 pricing increase from feature expansion,
  Year 3 assumes mobile and console build support
```

**Reality check:**
- SOM Year 1 at $200K: Not venture-scale. Viable as bootstrapped/seed.
- TAM at $150M: Small for VC but reasonable for a focused business.
- Capture rate Year 3 at 13.3%: Aggressive. Requires strong community effects.
- **WARNING:** This is a marketplace — need supply (playtesters) AND demand (devs). Two-sided cold start is the biggest risk.

---

## Example 3: Competitive Moat Analysis

### Good AskUserQuestion
Issue 3 — Composite moat score is 9/30 (weak).

We recommend **A**: Build the data moat first by accumulating structured playtest data (heatmaps, drop-off points, feedback patterns by genre) that improves recommendations over time. This is the one moat a new entrant can't buy on day one.

Why: The current feature set (upload build, get feedback) is trivially replicable by any game platform. UserTesting.com could add a "games" vertical tomorrow. Without a proprietary data advantage, this is a feature, not a company.

A) **3A** — Invest in data moat: structured feedback taxonomy, cross-game pattern detection, genre-specific benchmarks. Makes the product smarter with each session. Effort: high. Timeline: 6+ months to meaningful advantage. Risk: low.

B) **3B** — Invest in community moat: build a dedicated playtester community with reputation scores, genre expertise, and exclusive access. Switching cost for both sides. Effort: high. Timeline: 3-6 months. Risk: medium (community building is unpredictable).

C) **3C** — Accept weak moat and compete on execution speed. Ship faster, iterate faster, own the indie niche before anyone cares. Effort: low. Risk: high (vulnerable to well-funded copy).

---

## Example 4: Killer Feature Test

### Good Output
```
FEATURE CLASSIFICATION
┌──────────────────────────┬───────────────┬────────────┬──────────────┐
│ Feature                   │ Type          │ Uniqueness │ PMF Signal   │
├──────────────────────────┼───────────────┼────────────┼──────────────┤
│ Upload build + get        │ Table Stakes  │ 2/5        │ Must-have    │
│ playtesters               │               │            │              │
│                           │               │            │              │
│ Video recordings of       │ Differentiator│ 3/5        │ Differentiator│
│ play sessions             │               │            │              │
│                           │               │            │              │
│ Genre-matched playtester  │ Differentiator│ 4/5        │ Differentiator│
│ selection                 │               │            │              │
│                           │               │            │              │
│ Heatmaps + drop-off       │ Delight       │ 4/5        │ Delight      │
│ analytics                 │               │            │              │
│                           │               │            │              │
│ 48-hour turnaround        │ Differentiator│ 3/5        │ Must-have    │
│                           │               │            │              │
│ $50 starting price        │ Table Stakes  │ 2/5        │ Must-have    │
└──────────────────────────┴───────────────┴────────────┴──────────────┘
```

**Killer Feature Test — "Genre-matched playtester selection":**
- 10x test: 3/5 — Better than Reddit posts, not 10x better than UserTesting filters.
- Demo test: 4/5 — "Upload, pick 'roguelike', get feedback from roguelike fans." Clear.
- Retention test: 3/5 — Useful but not addictive.
- Word-of-mouth test: 3/5 — Moderate. "Hey, this matched me with actual roguelike players."
- Willingness-to-switch test: 2/5 — Not enough alone.
- **Score: 3.0/5 — Borderline.** This is a differentiator but not a killer feature.

**Killer Feature Test — "Heatmaps + drop-off analytics":**
- 10x test: 4/5 — Nothing else gives indie devs spatial analytics on playtests.
- Demo test: 5/5 — Visual, instant "aha." Show where players died, got stuck, quit.
- Retention test: 4/5 — Once you've seen where players drop off, you can't unsee it.
- Word-of-mouth test: 4/5 — Highly shareable. "Look at this heatmap of my game."
- Willingness-to-switch test: 3/5 — Strong pull but needs the full package.
- **Score: 4.0/5 — This is the killer feature.** Lead with this in marketing.

---

## Example 5: Go-to-Market — First 100 Users

### Good Output

**First 100 paying developers — the plan:**

1. **Week 1-2: Manual outreach in 3 communities**
   - r/gamedev (960K members) — identify devs posting "looking for playtesters"
   - Indie Game Developers (Facebook, 150K members)
   - Game Dev Discord servers (HandmadeHero, GameDev.tv)
   - DM 10 developers/day with a personal message + free session offer

2. **Week 3-4: Content as proof**
   - Run 5 free playtests for recognizable indie games (with permission)
   - Publish the heatmaps and findings as case studies
   - Post to r/gamedev and Hacker News

3. **Month 2: Game jam partnerships**
   - Sponsor free playtest sessions at Ludum Dare, Global Game Jam
   - Game jam devs are exactly the target: small teams, need fast feedback

4. **Month 3: Referral loop**
   - Every playtester who completes a session gets "Want to get YOUR game tested?"
   - Playtesters are often game devs themselves — supply feeds demand

**Onboarding (first 5 minutes):**
1. Sign up with email or GitHub
2. "Upload your build" — drag and drop
3. "What genre?" — single select
4. "What do you want to learn?" — 3 checkbox options
5. "Your playtest session starts matching now" — confirmation + ETA

**This is good because:** It exploits the natural overlap between playtesters and game devs (supply = demand in many cases), uses existing high-intent communities, and leads with free value before asking for payment.

---

## Example 6: Sean Ellis Estimate

### Good Output
**Sean Ellis estimate: 30% "very disappointed"**

Reasoning:
- Problem severity scored 16/25 — moderate-to-strong
- Current alternatives exist (Reddit posts, Discord communities, UserTesting) — they're just worse, not absent
- The heatmap/analytics angle is unique but unproven
- Indie devs are price-sensitive and scrappy — many will find workarounds

**Assessment: Below the 40% threshold.** This suggests the product is close but not yet at PMF. Two paths to get there:
1. **Narrow the audience further:** Focus on devs preparing for Steam Early Access launch (higher urgency, higher willingness to pay)
2. **Strengthen the killer feature:** Make the analytics so good that manual playtesting feels negligent by comparison

---

## Example 7: Bad vs Good Style

### Bad
"The market seems large and there are some competitors but we think there's room for a new entrant."

### Good
"TAM is $150M (bottom-up: 250K indie devs × $600/yr). Three direct competitors exist: UserTesting ($13/tester, enterprise-focused), PlaytestCloud ($49/session, mobile-only), and BetaTesting (free, unstructured). None serve PC indie developers specifically. Gap: affordable, structured, genre-matched playtesting for indie PC games."

### Bad
"Users would probably like this feature."

### Good
"Problem severity scored 16/25. Frequency: weekly (during active development). Intensity: moderate (annoying but not blocking). Willingness to pay: moderate ($50-100/session based on UserTesting pricing anchoring). Current alternatives: bad but exist (Reddit, Discord). Switching cost from current: low. This is a 'better painkiller' opportunity, not a 'hair on fire' problem."
