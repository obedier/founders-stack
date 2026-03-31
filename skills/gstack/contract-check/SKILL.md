---
name: contract-check
version: 1.0.0
description: |
  Validate that backend API implementation matches OpenAPI contracts in contracts/api/.
  Detects drift between spec and implementation: missing endpoints, wrong response shapes,
  missing fields, wrong status codes. Run after integration to catch mismatches early.
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - AskUserQuestion
---

# /contract-check — API Contract Validation

Validates that the backend implementation matches the OpenAPI contracts defined in `contracts/api/`. Catches drift before it becomes an integration bug.

## User-invocable
When the user types `/contract-check`, run this skill.

## Arguments
- `/contract-check` — validate all contracts against running backend
- `/contract-check [endpoint]` — validate a specific endpoint (e.g., `/contract-check /households`)
- `/contract-check --static` — static analysis only (no running server needed)

---

## Mode 1: Static Analysis (default if server not running)

Compare OpenAPI specs against route definitions and handler code without a running server.

### Step 1: Gather contracts

```bash
ls contracts/api/*.yaml 2>/dev/null
```

Read each YAML file and extract:
- All defined paths and methods (GET, POST, PATCH, DELETE)
- Request body schemas
- Response schemas (per status code)
- Required fields
- Auth requirements

### Step 2: Gather implementation

Scan backend route definitions:
```bash
# Find route files
find backend/src -name "*.routes.ts" -o -name "routes.ts" -o -name "router.ts" | head -20
```

For each route file, extract:
- Registered paths and methods
- Handler references

Then for each handler, check:
- Input validation schema (zod)
- Response shape
- Status codes returned
- Auth middleware applied

### Step 3: Compare

For each endpoint in the contract:

```
CONTRACT vs IMPLEMENTATION

  ENDPOINT                | IN CONTRACT | IN CODE | STATUS
  ------------------------|-------------|---------|--------
  POST /auth/signup       | Yes         | Yes     | OK
  POST /households        | Yes         | Yes     | OK
  GET  /households/:id    | Yes         | No      | MISSING
  PATCH /policies/:id     | Yes         | Yes     | DRIFT
  POST /tasks/basket      | Yes         | Yes     | OK
```

### Step 4: Detail drifts

For each MISSING or DRIFT entry, report:

**MISSING endpoint:**
```
MISSING: GET /households/:id
  Contract: contracts/api/households.yaml line 15
  Expected response: { household_id, name, created_at, updated_at, default_policy_id }
  Action needed: Implement in backend/src/modules/household/
```

**DRIFT (schema mismatch):**
```
DRIFT: PATCH /policies/:id
  Contract: contracts/api/policies.yaml line 42
  Contract expects field: substitution_rule (string)
  Implementation has: substitution_rules (string[]) ← PLURAL MISMATCH
  File: backend/src/modules/policy/policy.handler.ts:28
  Action needed: Align implementation with contract (singular, string)
```

### Step 5: Check shared types

Compare `contracts/types/*.ts` against:
- Backend model definitions
- iOS Swift model definitions (if `ios/Shelly/Core/Models/` exists)

```
TYPE SYNC CHECK

  TYPE              | Contract | Backend | iOS    | STATUS
  ------------------|----------|---------|--------|--------
  Household         | Yes      | Yes     | Yes    | OK
  Policy            | Yes      | Yes     | No     | iOS MISSING
  TrustProfile      | Yes      | Yes     | Drift  | FIELD MISMATCH
```

For each drift, show the specific field differences.

### Step 6: Check events

Compare `contracts/events/*.ts` against event emission in backend code:

```bash
# Find all event emissions in backend
grep -r "emit\|publish\|dispatch" backend/src/modules/ --include="*.ts" -l
```

For each event defined in contracts, verify it's emitted somewhere in the code.

```
EVENT CHECK

  EVENT                    | IN CONTRACT | EMITTED | STATUS
  -------------------------|-------------|---------|--------
  household_created        | Yes         | Yes     | OK
  basket_rebuilt           | Yes         | No      | NOT EMITTED
  recommendation_accepted  | Yes         | Yes     | OK
```

---

## Mode 2: Live Validation (if server is running)

### Step 1: Check if backend is running

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health 2>/dev/null
```

If not running, fall back to static analysis mode.

### Step 2: Test each endpoint

For each endpoint in the contract:
1. Construct a valid request from the contract schema
2. Send the request via curl
3. Compare response status code and shape against contract

```bash
# Example: test POST /households
curl -s -X POST http://localhost:3000/households \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"name": "Test Household"}' | jq .
```

4. Validate response shape:
   - All required fields present?
   - Field types match?
   - Status code matches?

### Step 3: Report

```
LIVE VALIDATION RESULTS

  ENDPOINT                | STATUS | RESPONSE | MATCH
  ------------------------|--------|----------|------
  POST /auth/signup       | 201    | OK       | YES
  POST /households        | 201    | OK       | YES
  GET  /households/:id    | 404    | ERROR    | MISSING
  POST /policies          | 201    | OK       | DRIFT (missing field: autopilot_allowed)
```

---

## Output

### Summary

```
Contract Check Results:
  Endpoints checked:    15
  Matching:             12
  Missing:               2
  Drifted:               1
  Events checked:       10
  Events matching:       8
  Events not emitted:    2
  Types checked:         8
  Types matching:        6
  Types drifted:         2

  Overall: 2 MISSING endpoints, 1 DRIFT, 2 events not emitted
```

### Actionable Fixes

For each issue, provide the exact fix:
- File to modify
- Line number
- What to add/change
- Reference to the contract definition

---

## Important Rules

1. **Contract is always right.** If implementation differs from contract, the implementation needs to change (unless there's a documented reason in DECISION_LOG.md).
2. **Be precise about drifts.** Field name typos, pluralization mismatches, and type differences (string vs string[]) are all drifts.
3. **Check auth requirements.** If contract says "auth required" but the route has no auth middleware, that's a security drift — flag as CRITICAL.
4. **Don't modify anything.** This skill is read-only. Report issues, don't fix them.
5. **Run after every integration phase.** This catches what tests might miss.
