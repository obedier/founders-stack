---
name: audit
version: 1.0.0
description: |
  Dependency and security audit for the project. Scans npm packages and Swift packages
  for known vulnerabilities, outdated dependencies, and license issues. Reports findings
  with severity and remediation steps.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - AskUserQuestion
---

# /audit — Dependency & Security Audit

Scans all project dependencies for vulnerabilities, outdated packages, and license issues. Covers both backend (npm) and iOS (Swift Package Manager).

## User-invocable
When the user types `/audit`, run this skill.

## Arguments
- `/audit` — full audit (npm + Swift packages)
- `/audit backend` — npm packages only
- `/audit ios` — Swift packages only
- `/audit --fix` — audit and auto-fix what's safe to fix

---

## Step 1: Backend (npm) Audit

### 1.1 Check for package.json
```bash
ls backend/package.json 2>/dev/null
```
If not found, skip backend audit.

### 1.2 Run npm audit
```bash
cd backend && npm audit --json 2>/dev/null | head -200
```

Parse the JSON output. For each vulnerability:
- Package name
- Severity (critical, high, moderate, low)
- Vulnerability title
- Fix available? (yes/no)
- Fix command

### 1.3 Check outdated packages
```bash
cd backend && npm outdated --json 2>/dev/null
```

Flag packages that are:
- 2+ major versions behind → **WARNING**
- Have known security advisories → **CRITICAL**
- Are deprecated → **CRITICAL**

### 1.4 License check
```bash
cd backend && npx license-checker --json --production 2>/dev/null | head -100
```

Flag any non-permissive licenses (GPL, AGPL, SSPL) that could affect distribution:
- MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC → **OK**
- GPL-2.0, GPL-3.0, AGPL-3.0 → **WARNING** (copyleft, may affect distribution)
- SSPL, Elastic License → **CRITICAL** (restrictive)
- Unknown/unlicensed → **WARNING**

---

## Step 2: iOS (Swift Package Manager) Audit

### 2.1 Check for Package.swift or .xcodeproj
```bash
ls ios/Shelly.xcodeproj 2>/dev/null || ls ios/Package.swift 2>/dev/null
```
If not found, skip iOS audit.

### 2.2 List Swift package dependencies
```bash
# From Package.resolved
cat ios/Shelly.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved 2>/dev/null || \
cat ios/Package.resolved 2>/dev/null
```

Parse the resolved file for:
- Package name
- Current version
- Repository URL

### 2.3 Check for known vulnerabilities

For each Swift package, search for known CVEs:
```bash
# Check GitHub advisory database
# Note: Swift ecosystem has fewer automated tools than npm
```

Cross-reference package names against:
- GitHub Security Advisories
- NVD (National Vulnerability Database)
- Package README/CHANGELOG for security notices

### 2.4 Check for outdated packages

For each package, compare resolved version against latest release:
```bash
# Check latest tag for each dependency repo
git ls-remote --tags <repo-url> 2>/dev/null | tail -5
```

---

## Step 3: Code-Level Security Scan

### 3.1 Secrets scan
```bash
# Check for hardcoded secrets, API keys, tokens
grep -rn "sk-\|sk_live\|sk_test\|AKIA\|password\s*=\s*['\"]" \
  --include="*.ts" --include="*.swift" --include="*.json" \
  --exclude-dir=node_modules --exclude-dir=.git \
  backend/ ios/ 2>/dev/null
```

Flag any matches as **CRITICAL**.

### 3.2 Environment variable check
```bash
# Check for .env files that shouldn't be committed
find . -name ".env" -o -name ".env.local" -o -name ".env.production" 2>/dev/null | grep -v node_modules
```

Verify `.gitignore` includes `.env*` patterns.

### 3.3 Shelly-specific security checks

Check for violations of Shelly's security rules:
```bash
# PII in LLM prompts — check for user data sent to AI
grep -rn "email\|phone\|address\|name.*user" backend/src/modules/receipt/ backend/src/modules/orchestration/ --include="*.ts" 2>/dev/null

# Raw SQL (should use ORM)
grep -rn "raw\|sql\`\|query(" backend/src/ --include="*.ts" 2>/dev/null | grep -v node_modules

# Force unwraps in Swift (!)
grep -rn '!\.' ios/Shelly/ --include="*.swift" 2>/dev/null | grep -v "//.*!" | head -20

# Any types in TypeScript
grep -rn ": any\b" backend/src/ --include="*.ts" 2>/dev/null | grep -v node_modules | head -20
```

---

## Step 4: Report

### Summary Table

```
AUDIT SUMMARY
=============

Backend (npm):
  Packages scanned:     N
  Critical vulns:       N
  High vulns:           N
  Moderate vulns:       N
  Outdated (2+ major):  N
  License issues:       N

iOS (Swift):
  Packages scanned:     N
  Known vulns:          N
  Outdated:             N

Code Security:
  Hardcoded secrets:    N
  Exposed env files:    N
  PII in LLM prompts:  N
  Raw SQL:              N
  Force unwraps:        N
  Any types:            N

Overall Risk: LOW / MODERATE / HIGH / CRITICAL
```

### Detailed Findings

For each finding, provide:
```
[SEVERITY] Package/Issue
  Description: ...
  Affected file: path:line
  Fix: npm audit fix / update to vX.Y.Z / remove package
  Risk if unfixed: ...
```

### Auto-Fix (if --fix flag)

For npm vulnerabilities with available fixes:
```bash
cd backend && npm audit fix
```

For outdated packages with no breaking changes (minor/patch updates):
```bash
cd backend && npm update
```

**Never auto-fix:**
- Major version bumps (breaking changes)
- License issues (requires human decision)
- Hardcoded secrets (requires human review)
- Swift package updates (may break iOS build)

Report what was fixed and what requires manual attention.

---

## Important Rules

1. **Never expose actual secret values.** If a hardcoded secret is found, show `[REDACTED]` and the file:line only.
2. **Run after every sprint.** New dependencies from agents may introduce vulnerabilities.
3. **License issues need human decisions.** Flag but don't auto-resolve.
4. **iOS audit is best-effort.** Swift ecosystem has fewer automated security tools than npm.
5. **This skill is read-only by default.** Only modify files when `--fix` is explicitly requested.
