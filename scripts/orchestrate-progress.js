#!/usr/bin/env node
'use strict';

/**
 * Orchestrate Progress — statusline renderer and state manager.
 *
 * Usage:
 *   As statusline:  Reads orchestrate state file, outputs breadcrumb trail.
 *                   Called by the statusline command with session JSON on stdin.
 *
 *   As state writer: node orchestrate-progress.js set <workflow> <stepIndex> [status]
 *                    node orchestrate-progress.js clear
 *
 * State file: ~/.claude/orchestrate-state.json
 */

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.claude',
  'orchestrate-state.json'
);

// Workflow step definitions — order matters
const WORKFLOWS = {
  feature:  ['Plan', 'Impl', 'Review', 'PreLand', 'QA', 'Ship'],
  bugfix:   ['Plan', 'Impl', 'Review', 'PreLand', 'Ship'],
  refactor: ['Plan', 'Arch', 'Review', 'PreLand', 'Ship'],
  security: ['Plan', 'SecRev', 'CodeRev', 'PreLand'],
  hotfix:   ['Impl', 'Review', 'PreLand', 'Ship'],
  qa:       ['PreLand', 'QA'],
  custom:   ['Agents', 'PreLand', 'Ship'],
  project:  ['Blueprint', 'EngReview', 'Scaffold', 'Features', 'Integrate', 'QA', 'Ship'],
};

// Step short labels for compact display
const STEP_LABELS = {
  Plan: 'Plan',
  Impl: 'Build',
  Arch: 'Arch',
  Review: 'Review',
  PreLand: 'PreLand',
  QA: 'QA',
  Ship: 'Ship',
  SecRev: 'SecAudit',
  CodeRev: 'CodeRev',
  Agents: 'Agents',
  Blueprint: 'Blueprint',
  EngReview: 'EngRev',
  Scaffold: 'Scaffold',
  Features: 'Features',
  Integrate: 'Integrate',
};

// ANSI colors
const C = {
  done:    '\x1b[38;2;64;160;43m',   // green
  current: '\x1b[38;2;255;183;77m',  // amber/orange
  pending: '\x1b[38;2;76;79;105m',   // gray
  bar:     '\x1b[38;2;76;79;105m',   // gray for frame
  pct:     '\x1b[38;2;136;57;239m',  // magenta
  wf:      '\x1b[38;2;23;146;153m',  // cyan
  reset:   '\x1b[0m',
};

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function clearState() {
  try { fs.unlinkSync(STATE_FILE); } catch { /* noop */ }
}

/**
 * Render the breadcrumb trail.
 *
 * Format: [feature: ✓Plan ✓Build ▸Review ·PreLand ·QA ·Ship] 50%
 *
 * ✓ = done, ▸ = current (highlighted), · = pending
 */
function renderProgress(state) {
  if (!state || !state.workflow || state.stepIndex == null) return '';

  const steps = WORKFLOWS[state.workflow] || WORKFLOWS.custom;
  const currentIdx = state.stepIndex;
  const total = steps.length;
  const pct = Math.round(((currentIdx) / total) * 100);

  const parts = steps.map((step, i) => {
    const label = STEP_LABELS[step] || step;
    if (i < currentIdx) {
      // completed
      return `${C.done}\u2713${label}${C.reset}`;
    } else if (i === currentIdx) {
      // current — highlighted
      const statusChar = state.status === 'running' ? '\u25b8' : '\u25b8';
      return `${C.current}${statusChar}${label}${C.reset}`;
    } else {
      // pending
      return `${C.pending}\u00b7${label}${C.reset}`;
    }
  });

  const trail = parts.join(' ');
  return `${C.bar}[${C.wf}${state.workflow}${C.bar}: ${trail}${C.bar}]${C.reset} ${C.pct}${pct}%${C.reset}`;
}

// --- CLI interface ---

const args = process.argv.slice(2);

if (args[0] === 'set') {
  // node orchestrate-progress.js set <workflow> <stepIndex> [status]
  const workflow = args[1];
  const stepIndex = parseInt(args[2], 10);
  const status = args[3] || 'running';
  const task = args.slice(4).join(' ') || '';
  writeState({ workflow, stepIndex, status, task, updatedAt: new Date().toISOString() });
  // Print the trail to stderr so calling code can see it
  process.stderr.write(renderProgress(readState()) + '\n');
} else if (args[0] === 'clear') {
  clearState();
} else if (args[0] === 'render') {
  // Just render current state (for testing)
  const state = readState();
  if (state) {
    process.stdout.write(renderProgress(state) + '\n');
  }
} else {
  // Statusline mode — read session JSON from stdin, append orchestrate progress
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    let sessionData;
    try {
      sessionData = JSON.parse(input);
    } catch {
      sessionData = {};
    }

    // Build the base statusline (user:path branch* ctx:% model time)
    const user = process.env.USER || process.env.USERNAME || '';
    const cwd = (sessionData.workspace?.current_dir || process.cwd()).replace(process.env.HOME, '~');
    const model = sessionData.model?.display_name || '';
    const remaining = sessionData.context_window?.remaining_percentage;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Git info
    let branch = '';
    let dirty = '';
    try {
      const { execSync } = require('child_process');
      const dir = sessionData.workspace?.current_dir || process.cwd();
      branch = execSync('git rev-parse --abbrev-ref HEAD 2>/dev/null', { cwd: dir, encoding: 'utf8' }).trim();
      const porcelain = execSync('git status --porcelain 2>/dev/null', { cwd: dir, encoding: 'utf8' }).trim();
      if (porcelain) dirty = '*';
    } catch { /* not a git repo */ }

    // Todo count from transcript
    let todoCount = 0;
    if (sessionData.transcript_path) {
      try {
        const transcript = fs.readFileSync(sessionData.transcript_path, 'utf8');
        todoCount = (transcript.match(/"type":"todo"/g) || []).length;
      } catch { /* noop */ }
    }

    // Colors
    const B = '\x1b[38;2;30;102;245m';
    const G = '\x1b[38;2;64;160;43m';
    const Y = '\x1b[38;2;223;142;29m';
    const M = '\x1b[38;2;136;57;239m';
    const Cy = '\x1b[38;2;23;146;153m';
    const T = '\x1b[38;2;76;79;105m';
    const R = '\x1b[0m';

    // Base line
    let line = `${Cy}${user}${R}:${B}${cwd}${R}`;
    if (branch) line += ` ${G}${branch}${Y}${dirty}${R}`;
    if (remaining != null) line += ` ${M}ctx:${remaining}%${R}`;
    line += ` ${T}${model}${R} ${Y}${time}${R}`;
    if (todoCount > 0) line += ` ${Cy}todos:${todoCount}${R}`;

    // Orchestrate progress — append if active
    const state = readState();
    if (state && state.workflow) {
      const progress = renderProgress(state);
      if (progress) line += `  ${progress}`;
    }

    process.stdout.write(line + '\n');
  });
}
