---
name: bookmark
version: 1.0.0
description: |
  Save and resume coding session progress. Captures what you're working on,
  what's done, what's next, key decisions, git state, and relevant file context
  so a new Claude session can pick up seamlessly as if it never stopped.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# /bookmark — Save & Resume Coding Sessions

Bookmark your coding session so you can pick up later in a new Claude session as if you never stopped. This captures the full mental state: what you're building, what's done, what's next, key decisions, gotchas, and the exact git state.

## User-invocable
When the user types `/bookmark`, run this skill.

## Arguments
- `/bookmark` — save a bookmark of the current session
- `/bookmark save` — same as above
- `/bookmark save <label>` — save with a human-readable label (e.g., "auth-flow-wip")
- `/bookmark resume` — load the most recent bookmark and reconstruct context
- `/bookmark resume <label>` — load a specific bookmark by label
- `/bookmark list` — show all saved bookmarks
- `/bookmark delete <label>` — delete a bookmark

**Argument validation:** If the argument doesn't match one of the above patterns, show this usage and stop:
```
Usage: /bookmark [command] [label]
  /bookmark                  — save bookmark (auto-labeled by branch + timestamp)
  /bookmark save <label>     — save with a custom label
  /bookmark resume           — resume from most recent bookmark
  /bookmark resume <label>   — resume from a specific bookmark
  /bookmark list             — list all bookmarks
  /bookmark delete <label>   — delete a bookmark
```

---

## Storage

Bookmarks are saved to `.context/bookmarks/` in the project root (create if it doesn't exist). Each bookmark is a single Markdown file named `<label>.md`.

Auto-generated labels use the format: `<branch>--<YYYY-MM-DD-HHmm>` (e.g., `feat-auth--2026-03-15-1430`).

Add `.context/` to `.gitignore` if it isn't already there. Bookmarks are personal working state — they should not be committed.

---

## SAVE workflow

When saving a bookmark, gather all of the following context and write it to a single structured Markdown file.

### Step 1: Gather git state

Run these commands in parallel:

```bash
# Current branch
git branch --show-current

# Uncommitted changes summary
git status --short

# Staged diff (if any)
git diff --cached --stat

# Unstaged diff (if any)
git diff --stat

# Recent commits on this branch (last 20, or since divergence from main)
git log main..HEAD --oneline 2>/dev/null || git log -20 --oneline

# Stashed changes
git stash list
```

### Step 2: Identify key files

Find the files most relevant to the current work session:

```bash
# Files modified in working tree
git diff --name-only
git diff --cached --name-only

# Files changed on this branch vs main
git diff main...HEAD --name-only 2>/dev/null

# Recently modified tracked files (last 2 hours)
find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' -o -name '*.go' -o -name '*.rs' -o -name '*.rb' -o -name '*.java' -o -name '*.swift' -o -name '*.css' -o -name '*.html' -o -name '*.vue' -o -name '*.svelte' | head -200 | xargs ls -lt 2>/dev/null | head -20
```

### Step 3: Reconstruct session context

This is the most important step. You must synthesize the **mental model** of the session — not just raw data, but the narrative of what's happening. Think about what a new Claude session would need to know to continue without missing a beat.

**Ask yourself these questions and write the answers into the bookmark:**

1. **Goal**: What is the user trying to accomplish? What's the high-level task?
2. **Approach**: What strategy/architecture was chosen? Were there alternatives that were rejected, and why?
3. **Progress**: What's been completed? What's partially done? What hasn't started?
4. **Current state**: What was the user working on right before this bookmark? What's the immediate next step?
5. **Key decisions**: What non-obvious decisions were made during this session? What constraints or tradeoffs were accepted?
6. **Gotchas & blockers**: What didn't work? What workarounds were used? What should a new session watch out for?
7. **File map**: Which files are the most important to read first to understand the current work?
8. **Test state**: Are tests passing? Any known failures? What needs testing?

**To reconstruct this context:** Review the conversation history, the git diff, recent commits, and the state of modified files. Read the key files if needed to understand their current state.

### Step 4: Write the bookmark file

Write the bookmark to `.context/bookmarks/<label>.md` in this exact format:

```markdown
# Bookmark: <label>
> Saved: <YYYY-MM-DD HH:MM> · Branch: <branch> · Commit: <short-hash>

## Goal
<What the user is trying to accomplish — 1-3 sentences>

## Approach
<Strategy chosen, architecture decisions, rejected alternatives and why>

## Progress
- [x] <completed item>
- [x] <completed item>
- [ ] <in-progress item> ← **current**
- [ ] <not started item>
- [ ] <not started item>

## Current State
<What was happening right before this bookmark. The immediate next action to take when resuming. Be specific — e.g., "Was debugging why the auth middleware rejects valid tokens when the session cookie has a SameSite=Strict attribute. Next step: add logging to middleware.ts:47 to inspect the parsed cookie value.">

## Key Decisions
- <Decision>: <Why>
- <Decision>: <Why>

## Gotchas & Blockers
- <Thing that didn't work or was surprising>
- <Workaround used>
- <Known issue to watch out for>

## File Map
Key files to read first (in priority order):
1. `<path>` — <why this file matters>
2. `<path>` — <why this file matters>
3. `<path>` — <why this file matters>

## Tests
<Test state: passing/failing, known failures, what needs testing next>

## Git State
- Branch: `<branch>`
- Uncommitted changes: <yes/no — summary>
- Commits on branch: <count>
- Stashed: <yes/no>

<raw git status output>

## Conversation Highlights
<Any important context from the conversation that isn't captured above — user preferences expressed during the session, verbal agreements about approach, things the user said they'd handle manually, etc.>
```

### Step 5: Ensure .gitignore coverage

```bash
# Add .context/ to .gitignore if not already present
if [ -f .gitignore ]; then
  grep -qxF '.context/' .gitignore || echo '.context/' >> .gitignore
else
  echo '.context/' > .gitignore
fi
```

### Step 6: Confirm

After saving, output:

```
Bookmark saved: .context/bookmarks/<label>.md

To resume later, start a new Claude session and run:
  /bookmark resume <label>
```

---

## RESUME workflow

When resuming from a bookmark, the goal is to reconstruct full context so you can continue the work seamlessly.

### Step 1: Load the bookmark

If a label is provided, read `.context/bookmarks/<label>.md`. If no label, find the most recent bookmark:

```bash
ls -t .context/bookmarks/*.md | head -1
```

Read the bookmark file.

### Step 2: Validate git state

Check that the current git state is compatible with the bookmark:

```bash
git branch --show-current
git status --short
git log -1 --oneline
```

If the branch doesn't match the bookmark, warn the user but continue. If there are unexpected uncommitted changes not mentioned in the bookmark, mention them.

### Step 3: Read key files

Read the files listed in the **File Map** section of the bookmark (in the order listed). This rebuilds the code context that the previous session had loaded.

### Step 4: Reconstruct and brief the user

After loading the bookmark and reading the key files, give the user a concise briefing:

```
Resumed from bookmark: <label> (saved <date>)

**Goal**: <goal>
**You were**: <current state — what was happening>
**Next step**: <the immediate action to take>

<any warnings about git state changes since bookmark>

Ready to continue. Want me to pick up from where we left off?
```

Do NOT start doing work automatically. Wait for the user to confirm or redirect.

---

## LIST workflow

```bash
ls -lt .context/bookmarks/*.md 2>/dev/null
```

For each bookmark file found, read the first 3 lines to extract the label and metadata, then display as a table:

```
Bookmarks:
  <label>          <date>    <branch>    <goal summary>
  <label>          <date>    <branch>    <goal summary>
```

If no bookmarks exist, say: "No bookmarks found. Use `/bookmark save` to create one."

---

## DELETE workflow

```bash
rm .context/bookmarks/<label>.md
```

Confirm: "Deleted bookmark: <label>"

If the file doesn't exist, say: "Bookmark '<label>' not found. Run `/bookmark list` to see available bookmarks."
