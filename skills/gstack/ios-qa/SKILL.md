---
name: ios-qa
version: 1.0.0
description: |
  QA test an iOS app on the simulator. Launches the app, navigates screens,
  takes screenshots, tests user flows, checks accessibility, and reports issues.
  Built on xcrun simctl and xcodebuild. Use after sprint integration to verify
  iOS UI flows work end-to-end.
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

# /ios-qa — iOS Simulator QA Testing

Tests the Shelly iOS app on the simulator by building, launching, navigating, and verifying screens. Takes screenshots, checks accessibility, and produces a structured QA report.

## User-invocable
When the user types `/ios-qa`, run this skill.

## Arguments
- `/ios-qa` — full QA (build + launch + test all available screens)
- `/ios-qa --quick` — smoke test (build + launch + verify app shell renders)
- `/ios-qa [feature]` — test a specific feature (e.g., `/ios-qa onboarding`)
- `/ios-qa --screenshots` — capture screenshots of every screen for review

---

## Tools

This skill uses these CLI tools (all work headless, no Xcode GUI needed):

| Tool | Purpose | Install |
|------|---------|---------|
| `xcrun simctl` | Simulator lifecycle, screenshots, permissions, deep links | Built into Xcode |
| `xcodebuild` | Build app, run XCUITests | Built into Xcode |
| `axe` (optional) | Accessibility tree inspection + tap by identifier | `brew tap cameroncooke/axe && brew install axe` |
| `maestro` (optional) | YAML-driven E2E test flows | `curl -Ls "https://get.maestro.mobile.dev" \| bash` |

## Prerequisites

Verify Xcode and simulator are available:
```bash
xcode-select -p 2>/dev/null && echo "Xcode OK" || echo "ERROR: Xcode not installed"
xcrun simctl list devices available | grep -i iphone | head -5
```

If no simulator is booted, boot one:
```bash
# Find a suitable device
DEVICE=$(xcrun simctl list devices available | grep "iPhone 16" | head -1 | grep -oE '[A-F0-9-]{36}')
if [ -z "$DEVICE" ]; then
  DEVICE=$(xcrun simctl list devices available | grep "iPhone" | head -1 | grep -oE '[A-F0-9-]{36}')
fi
xcrun simctl boot "$DEVICE" 2>/dev/null || true
echo "Simulator: $DEVICE"
```

### Clean status bar for screenshots
```bash
xcrun simctl status_bar booted override \
  --time "9:41" --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 \
  --batteryState charged --batteryLevel 100
```

### Grant permissions (prevents permission dialogs during QA)
```bash
xcrun simctl privacy booted grant camera com.shelly.app
xcrun simctl privacy booted grant location com.shelly.app
xcrun simctl privacy booted grant photos com.shelly.app
xcrun simctl privacy booted grant notifications com.shelly.app
```

---

## Phase 1: Build

Build the app for simulator:
```bash
cd ios && xcodebuild build \
  -scheme Shelly \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  -derivedDataPath build/ \
  -quiet 2>&1 | tail -10
```

**If build fails:** Report the error and stop. Do not proceed with QA on a broken build.

Find the built .app:
```bash
APP_PATH=$(find ios/build -name "Shelly.app" -type d | head -1)
echo "Built app: $APP_PATH"
```

---

## Phase 2: Install & Launch

```bash
# Install on simulator
xcrun simctl install booted "$APP_PATH"

# Launch the app
xcrun simctl launch booted com.shelly.app 2>/dev/null || \
xcrun simctl launch booted $(defaults read "$APP_PATH/Info.plist" CFBundleIdentifier 2>/dev/null)

# Wait for launch
sleep 3
```

Take initial screenshot:
```bash
REPORT_DIR=".gstack/ios-qa-reports"
mkdir -p "$REPORT_DIR/screenshots"
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/01-launch.png"
```

---

## Phase 3: Screen Navigation & Testing

### Method A: AXe — Accessibility-Based Interaction (preferred if installed)

AXe uses Apple's accessibility APIs to find and interact with elements by identifier, no coordinates needed:
```bash
# Check if axe is installed
which axe 2>/dev/null && echo "AXe available" || echo "AXe not installed (brew tap cameroncooke/axe && brew install axe)"

# Dump accessibility tree (find all interactive elements)
axe describe-ui --udid booted

# Tap by accessibility identifier
axe tap --id "LoginButton" --udid booted

# Type text
axe type "user@example.com" --udid booted

# Swipe/scroll
axe gesture scroll-down --udid booted

# Multi-step batch (single invocation)
axe batch --udid booted \
  --step "tap --id SearchField" \
  --step "type 'paper towels'" \
  --step "key 40"
```

### Method B: Maestro — YAML-Driven Flows (preferred for repeatable E2E tests)

```bash
# Check if maestro is installed
which maestro 2>/dev/null && echo "Maestro available" || echo "Maestro not installed"

# Run a flow file
maestro test flows/onboarding.yaml

# Print current view hierarchy
maestro hierarchy
```

Sample flow file (`flows/onboarding.yaml`):
```yaml
appId: com.shelly.app
---
- launchApp
- assertVisible: "Get your household brain back"
- tapOn: "Get Started"
- assertVisible: "Connect Gmail"
- takeScreenshot: "onboarding-step-2"
```

### Method C: XCUITest Runner

If the project has UI tests, run them:
```bash
cd ios && xcodebuild test \
  -scheme ShellyUITests \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  -derivedDataPath build/ \
  -resultBundlePath "$REPORT_DIR/test-results" \
  2>&1 | tail -30
```

Parse test results for pass/fail.

### Screen-by-Screen Verification

For each screen that should exist based on the current sprint:

1. **Navigate to the screen** (via deep link or UI test)
2. **Take screenshot:**
   ```bash
   xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/screen-name.png"
   ```
3. **Verify key elements exist** (via accessibility inspection or UI test assertions)
4. **Check for obvious issues:**
   - Does the screen render without crashes?
   - Are labels and text visible?
   - Is the layout correct (not overlapping, not truncated)?
   - Does navigation work (back button, tab switching)?

### Deep Link Testing (if supported)

```bash
# Test deep links to specific screens
xcrun simctl openurl booted "shelly://household"
sleep 1
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/deeplink-household.png"

xcrun simctl openurl booted "shelly://orders"
sleep 1
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/deeplink-orders.png"
```

### Notification Testing

```bash
# Send a test push notification
xcrun simctl push booted com.shelly.app - << EOF
{
  "aps": {
    "alert": {
      "title": "Shelly restocked your pantry",
      "body": "Paper towels from Walmart. Arrives tomorrow. Cancel within 20 min."
    },
    "sound": "default",
    "category": "AUTOPILOT_PURCHASE"
  }
}
EOF
sleep 2
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/notification.png"
```

---

## Phase 4: Responsive & Accessibility Checks

### Test different device sizes
```bash
# iPhone SE (small screen)
xcrun simctl shutdown booted 2>/dev/null
SE_DEVICE=$(xcrun simctl list devices available | grep "iPhone SE" | head -1 | grep -oE '[A-F0-9-]{36}')
if [ -n "$SE_DEVICE" ]; then
  xcrun simctl boot "$SE_DEVICE"
  xcrun simctl install booted "$APP_PATH"
  xcrun simctl launch booted com.shelly.app
  sleep 3
  xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/iphone-se.png"
  xcrun simctl shutdown booted
fi

# iPad (if universal app)
IPAD_DEVICE=$(xcrun simctl list devices available | grep "iPad" | head -1 | grep -oE '[A-F0-9-]{36}')
if [ -n "$IPAD_DEVICE" ]; then
  xcrun simctl boot "$IPAD_DEVICE"
  xcrun simctl install booted "$APP_PATH"
  xcrun simctl launch booted com.shelly.app
  sleep 3
  xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/ipad.png"
  xcrun simctl shutdown booted
fi
```

### Dynamic Type check
```bash
# Set large text size
xcrun simctl ui booted content_size extra-extra-large
sleep 1
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/large-text.png"
# Reset
xcrun simctl ui booted content_size medium
```

### Dark Mode check
```bash
xcrun simctl ui booted appearance dark
sleep 1
xcrun simctl io booted screenshot "$REPORT_DIR/screenshots/dark-mode.png"
xcrun simctl ui booted appearance light
```

---

## Phase 5: Report

Write the QA report to `$REPORT_DIR/ios-qa-report-YYYY-MM-DD.md`:

```markdown
# iOS QA Report — Shelly
> Date: YYYY-MM-DD | Device: iPhone 16 | iOS: XX.X | Sprint: N

## Summary
- Build: PASS / FAIL
- Launch: PASS / FAIL
- Screens tested: N
- Issues found: N (X critical, Y medium, Z low)
- UI Tests: N passed, N failed
- Screenshots captured: N

## Screen-by-Screen Results

### [Screen Name]
- Status: OK / ISSUE
- Screenshot: screenshots/screen-name.png
- Notes: ...

## Issues Found

### ISSUE-001: [Title]
- Severity: Critical / High / Medium / Low
- Screen: [screen name]
- Description: ...
- Screenshot: screenshots/issue-001.png
- Steps to reproduce: ...

## Responsive Check
- iPhone SE: OK / ISSUES
- iPad: OK / ISSUES / N/A
- Large Text: OK / ISSUES
- Dark Mode: OK / ISSUES

## Recommendations
1. ...
2. ...
3. ...
```

### Quick Mode Output

For `--quick`, produce a condensed report:
```
iOS QA Smoke Test:
  Build: PASS
  Launch: PASS
  App shell renders: PASS
  Tab navigation: PASS
  No crash on launch: PASS
  Screenshots: .gstack/ios-qa-reports/screenshots/
```

---

## Important Rules

1. **Never modify source code.** This skill is observation-only.
2. **Always take screenshots.** Every screen gets a screenshot — they're the evidence.
3. **Check dark mode.** Shelly's design must work in both modes.
4. **Check large text.** Accessibility is non-negotiable.
5. **Report crashes precisely.** If the app crashes, capture the crash log:
   ```bash
   xcrun simctl diagnose booted 2>/dev/null
   # Or check Console.app logs
   log show --predicate 'processImagePath contains "Shelly"' --last 5m 2>/dev/null | tail -30
   ```
6. **Clean up.** After QA, shut down any simulators you booted:
   ```bash
   xcrun simctl shutdown all 2>/dev/null
   ```
