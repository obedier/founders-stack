# PMF Frameworks & Methodologies

Reference material for the `pmf-review` skill. These frameworks inform the analysis but should not be applied mechanically — adapt to the specific product and market.

---

## 1. Amazon Working Backwards

Write the press release first, then build the product that delivers on it.

**Why it works:** Forces clarity about who the customer is, what problem you're solving, and what the experience feels like — before architecture, before code, before hiring.

**Key elements:**
- Press release format (headline, subheadline, problem, solution, quote, how it works, getting started, CTA)
- FAQ document (external FAQ: customer questions; internal FAQ: engineering/business questions)
- The "so what?" test: if the press release doesn't excite you, stop

**When to use:** Every new product, every major feature, every pivot. No exceptions.

**Common mistakes:**
- Writing the press release to justify a decision already made
- Using internal jargon instead of customer language
- Skipping the customer quote (it forces empathy)
- Making the "how it works" section technical instead of experiential

---

## 2. YC Product-Market Fit Signals

From 15+ years of YC batch data and partner pattern recognition.

### Strong PMF Signals
- Users complain when the product is down
- Organic word-of-mouth growth (users bring other users without being asked)
- Users hack the product to do things you didn't intend
- Retention curves flatten (users who try it, keep using it)
- Usage grows faster than the team can support
- Customers ask to pay before you ask them to
- You can't hire fast enough to keep up with demand

### Weak PMF Signals (often mistaken for PMF)
- "Everyone we demo to says they'd use it" (talk is cheap)
- Signups are growing but usage isn't (leaky bucket)
- A few power users love it but it doesn't spread (niche, not PMF)
- Investors are excited (investors are often wrong)
- Press coverage (press doesn't equal users)
- Awards or recognition (vanity, not traction)

### The YC Questions
1. Who are your users?
2. What does your product do for them?
3. Why do they need it?
4. How do they find you?
5. What's your growth rate? (Week-over-week, not month-over-month)
6. What's the number one thing holding you back?

---

## 3. Sean Ellis PMF Survey

> "How would you feel if you could no longer use [product]?"
> - Very disappointed
> - Somewhat disappointed
> - Not disappointed (it's not that useful)
> - N/A — I no longer use it

**Threshold:** 40% "very disappointed" = PMF

**How to interpret:**
- 0-20%: No PMF. Problem isn't severe enough or solution isn't good enough.
- 20-40%: Getting close. Narrow the audience or sharpen the value prop.
- 40-60%: PMF. Focus on growth.
- 60%+: Strong PMF. Don't screw it up — protect what users love.

**How to use it before launch:** Estimate based on:
- Severity of the problem (Section 1 scorecard)
- Strength of alternatives (if current solutions are "good enough," hard to hit 40%)
- Uniqueness of the solution (if it's truly 10x better on one axis)

---

## 4. Peter Thiel's Monopoly Framework

From "Zero to One." Every great company is a monopoly in a small market before expanding.

**The question:** What valuable company is nobody building?

**Monopoly characteristics:**
1. **Proprietary technology** — 10x better than alternatives on at least one dimension
2. **Network effects** — product gets better as more people use it
3. **Economies of scale** — cost advantages that grow with size
4. **Branding** — genuine trust and reputation (not marketing spend)

**The market entry strategy:**
1. Dominate a small, specific market first
2. Expand concentrically to adjacent markets
3. Never compete head-on with an incumbent in their core market

**Red flags:**
- "We're in a $X billion market" (big market = lots of competition)
- "We just need 1% of the market" (if it were that easy, someone would have it)
- "Our advantage is we work harder" (not a moat)

---

## 5. Facebook's Growth Framework

From Facebook's early growth team (Chamath Palihapitiya, Alex Schultz).

**The North Star Metric:**
- One metric that captures the core value delivery
- Facebook: Daily Active Users
- Airbnb: Nights booked
- Slack: Messages sent in teams with 2000+ messages
- Your product: ___?

**The Magic Number:**
- The activation threshold that predicts retention
- Facebook: 7 friends in 10 days
- Slack: 2000 messages in a workspace
- Dropbox: 1 file in 1 folder on 1 device
- What's yours?

**Growth = Acquisition × Activation × Retention × Referral × Revenue**

Focus on the weakest link. Usually it's retention, not acquisition.

**Distribution insight:** "The product IS the distribution." If the product doesn't naturally spread, growth is buying users — expensive and fragile.

---

## 6. Google's Product Excellence Framework

What made Google products (Search, Maps, Gmail, Android) succeed:

**10x Rule:** Don't ship unless it's 10x better than alternatives on the axis that matters most.
- Google Search was 10x better at relevance
- Gmail was 10x better at storage (1GB vs 4MB)
- Google Maps was 10x better at speed and UX
- Android was 10x better at openness and cost

**The "toothbrush test" (Larry Page):** Is this something people will use once or twice a day? Is it useful enough to be a daily habit?

**Platform thinking:** Build something others build on top of. APIs, integrations, ecosystems. Products are features; platforms are moats.

---

## 7. Crossing the Chasm (Geoffrey Moore)

Technology adoption follows a curve: Innovators → Early Adopters → Early Majority → Late Majority → Laggards.

**The chasm** is between Early Adopters and Early Majority. Most startups die here.

**Why the chasm exists:**
- Early adopters buy vision and potential
- Early majority buys proven solutions with references
- The sales motion, messaging, and product completeness are different

**How to cross:**
1. Pick ONE specific beachhead segment in the early majority
2. Become the undisputed leader in that segment
3. Use that reference base to expand to adjacent segments
4. Never try to be everything to everyone at once

**Beachhead criteria:**
- Specific, identifiable buyer
- Compelling reason to buy NOW
- Whole product exists (not just core tech)
- No established competitor owns this exact niche
- Win here and adjacent segments notice

---

## 8. Jobs to Be Done (Clayton Christensen)

People don't buy products. They hire products to do a job.

**The framework:**
- "When I [situation], I want to [motivation], so I can [expected outcome]."
- Example: "When I'm commuting alone, I want something to make the drive less boring, so I can arrive at work in a better mood." (This is the job that radio, podcasts, and audiobooks all compete for.)

**Key insight:** Competition is not products in the same category. Competition is anything the customer currently "hires" to do the same job.

**How to apply:**
1. Identify the job (not the feature request)
2. Map all current "hires" (including non-consumption)
3. Understand the switching cost from current hire
4. Design the product to be hired, not just used

---

## 9. Lean Startup Validation Hierarchy

From Eric Ries, adapted for rigor.

**Validate in this order:**
1. **Problem validation:** Do people actually have this problem? (Interviews, observation)
2. **Solution validation:** Does this specific solution address the problem? (Prototype, concierge MVP)
3. **Product validation:** Can we build this in a way people will use? (MVP, beta)
4. **Market validation:** Will enough people pay enough money? (Pricing tests, pre-sales)
5. **Scale validation:** Can we acquire customers profitably at scale? (Growth experiments)

**Do NOT skip steps.** Building a scalable product for a problem nobody has is the most expensive way to learn nothing.

---

## 10. The Riskiest Assumption Test (RAT)

Identify the single assumption that, if wrong, kills the entire product. Test that first.

**Common riskiest assumptions:**
- "Users have this problem" (often wrong)
- "Users will pay for a solution" (often wrong)
- "We can acquire users at reasonable cost" (often wrong)
- "The technology can deliver the experience" (sometimes wrong)
- "We can build this with our team/budget" (rarely the riskiest)

**How to test:**
- Fastest possible experiment
- Clear success/failure criteria defined in advance
- Time-boxed (1-2 weeks max)
- Results shared with the team before building more

---

## 11. Pricing Frameworks

### Van Westendorp Price Sensitivity Meter
Four questions to find optimal price range:
1. At what price would you consider this too expensive?
2. At what price would you consider this so cheap you'd question quality?
3. At what price would you consider this starting to get expensive but still worth it?
4. At what price would you consider this a bargain?

### Value-Based Pricing
- Price based on value delivered, not cost to build
- If you save a customer $10,000/month, charging $1,000/month is a bargain
- Reference price: what do they pay for the thing you're replacing?

### SaaS Pricing Principles
- Charge early (free kills feedback loops)
- Charge on the value metric (the thing that scales with customer success)
- 3-4 tiers maximum
- Make the middle tier the obvious choice
- Annual discount to improve cash flow
