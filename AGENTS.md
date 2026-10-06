# Unified Agent Workspace Rules & System Index

**Project Root:** `/workspaces/codespaces-blank`  
**Status:** Canonical & Enforced across all AI Coding Agents (`agy`, Claude Code, OpenCode, Codex, Gemini).

---

## 1. Core Operating Protocols & CLI Optimization

* **RTK Optimization**: Prefix standard terminal commands with `rtk` to compress output tokens (e.g. `rtk git status`, `rtk npm test`, `rtk npx oxlint`).
* **Ripwire Exemption**: `ripwire` CLI output is already in a token-minimised XML format. Run `ripwire` **un-prefixed** so structure is not mangled by re-filtering.
* **CRISP-LO Pre-Flight**: Before non-trivial execution, map: Context, Role, Instruction, Structure, Parameters, Logic, Output.
* **Skill Discovery (`find-skills`)**: If a required skill is missing in `.agents/skills/`, invoke `find-skills` to discover/install it from `skills.sh`.
* **Baseline Methodology (`superpowers`)**: For non-trivial engineering tasks, initiate the workflow using the `using-superpowers` skill.

---

## 2. Memory & Retrieval (The MemPalace Standard)

* **Search Palace First**: For questions regarding past work, architectural rationale, codebase structure, or prior decisions, run **MemPalace search first** (`mempalace search "<query>"`).
* **Search-Before-Answer Protocol (`mempalace-recall`)**: Invoke `mempalace-recall` before answering questions about prior session history, people, or technical decisions instead of guessing from model memory.
* **Broad Reads as Last Resort**: Do NOT read whole directory trees or dump large files when a targeted MemPalace search can answer the query.
* **Installed Binaries**: `mempalace` v3.9.0 and `mempalace-mcp` are installed on PATH at `/home/codespace/.local/bin/mempalace`.

---

## 3. Tooling & Skills Map

| Domain / Mandate | Installed Tools & Skills | Execution Rule |
|---|---|---|
| **Codebase Navigation** | 17 `ripwire-*` skills; CLI `ripwire` v0.5.0 at `~/.local/bin/ripwire` | **Mandatory:** Never explore with raw `grep`, `find`, `ls`, or `cat`. Use ripwire verbs (`orient`, `navigate`, `find-bug`, `before-you-build`). |
| **Workflow & Discipline** | `superpowers` (15 skills) & `speckit` CLI v1.0.13 (`specify`) | Initialize complex features with `using-superpowers` and Spec-Driven Development (`specify init`). |
| **Memory & Past Decisions** | `mempalace` & `mempalace-recall` | Search palace before reading or answering past decisions. |
| **Secret Management** | `infisical` v0.43.132 (`.infisical.json`, Project ID: `76f86766-bacb-41bd-8285-9c1d2a01939d`) | In-memory runtime injection (`infisical run`) or RAM-disk `/dev/shm/.env`. Zero plaintext secrets on disk. |
| **Credential Guard** | `gitleaks` v8.30.1 at `~/.local/bin/gitleaks` | Enforced via `.git/hooks/pre-commit` and pre-flight checks. |
| **Linting & Type Safety** | `oxlint` v1.83.0 globally | Fast type-aware check (`oxlint --type-aware`). Zero-error gate. |
| **Code Health & Anti-Bloat** | `fallow` (static analysis) & `ponytail` suite (6 skills) | Run `npx fallow audit` before declaring JS/TS tasks done. Apply Ponytail Ladder for minimal code. |
| **Visual Browser Review** | Playwright (devDependency in `Learnty_App`) | Execute `Learnty_App/playwright-breakpoints.mjs`. Capture multi-breakpoint mobile screenshots and logs. |
| **Adversarial Critique** | `requesting-code-review`, `receiving-code-review`, `code-review`, `gauntlet-loop` | Isolated critic protocol: author requests review; receiver verifies with technical rigor; `gauntlet-loop` for blind benchmark comparison. |
| **Visual Styles & UI Design Systems** | `frontend-design` (Anthropic), `stylekit` (148 styles, CLI v0.3.1), `design-md-creator` (63 brand specs) | Apply Anthropic `frontend-design` for anti-template intentional UI; `stylekit` for tokens/recipes; `design-md-creator` for brand specs. |
| **Instant Hosting & Storage** | `here-now` CLI & skills | Run `.agents/skills/here-now/scripts/publish.sh` for instant public URLs; drives for cloud storage. |
| **Communication & Brevity** | `chat` skill (`/chat`) | High-Density Brevity Protocol: lead with key points, inline micro-definitions, proactive risk-flagging, zero conversational filler. |
| **Library Documentation** | `context7-mcp` | Use `ctx7` MCP server to fetch current, version-specific library docs. |
| **Cloudflare & Edge Platform** | `wrangler` CLI v4.76.0 & `cloudflare-tunnel` skill | Non-interactive execution only (`CI=true`). Token injected via Infisical; never invoke interactive login. |

---

## 4. Security, Secrets & Resource Footprint Guardrails

### A. Zero Plaintext Secrets on Disk (Infisical Vault)
* Never write or commit `.env` files containing real API keys, credentials, or secrets to disk storage.
* Inject into dev servers via process memory: `infisical run --path='/' --path='/Learnty_App' -- <cmd>` (or `npm run dev:secrets`).
* For Supabase Edge Functions requiring an env file, use Linux shared-memory RAM disk (`/dev/shm/.env`) with an immediate `EXIT` cleanup trap:
  ```bash
  bash -c 'trap "rm -f /dev/shm/.env" EXIT INT TERM; (infisical export --path="/" --format=dotenv 2>/dev/null; infisical export --path="/Learnty_App" --format=dotenv 2>/dev/null) > /dev/shm/.env && supabase functions serve --env-file /dev/shm/.env'
  ```
* Enforce staged credential scans on every commit via `gitleaks protect --staged`.

### B. Minimal Resource Footprint (Lean Supabase Protocol)
* Codespaces resources (RAM and disk) are constrained. Never run full-stack Supabase by default.
* Always start with minimal footprint:
  ```bash
  supabase start -x studio,inbucket,analytics,realtime,storage,edge-runtime
  ```
* Local test keys (`anon`, `service_role` printed by `supabase start`) are local-only and return `401 Unauthorized` on remote production projects.
* Test Edge Functions and migrations locally (`supabase migration up`) before remote deployment.
* **Mandatory Container Shutdown:** Always shut down containers with `supabase stop` immediately when testing completes to free RAM and ports.

### C. Cloudflare & Wrangler Non-Interactive Protocol
* **Strict Non-Interactive Execution:** Never run commands that prompt for browser callbacks or interactive menu choices (e.g. naked `wrangler login`, `infisical login`). Always run under `CI=true` or pass explicit non-interactive flags.
* **Authentication via Injected Tokens:** All Cloudflare deployments and API operations must rely on `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` injected in-memory via `infisical run` — zero hardcoded credentials in `wrangler.toml` or `wrangler.jsonc`.
* **Local-First Worker Simulation:** For local test cycles, use local Miniflare simulations (`wrangler dev --ip 127.0.0.1` or `--remote=false`). Never push untested workers directly to remote environments.
* **Tunnels vs. Workers Boundary:** Use `cloudflare-tunnel` (`cloudflared`) exclusively for exposing local web ports to temporary public URLs. Use `wrangler` exclusively for Edge Workers, Pages, KV, D1, and R2 manipulation.

### D. Scope Discipline & Workspace Isolation
* Implement all requested changes without scope creep. Do not perform drive-by refactorings or introduce unrequested features.
* **No Unauthorized Merges:** Do not merge branches or push to `main` unless the user explicitly requests you to.
* Use **`using-git-worktrees`** when workspace isolation is required, and **`finishing-a-development-branch`** for integration choices.

---

## 5. UI & Visual Direction Pre-Build Selection Gate (Anthropic Frontend Design, StyleKit & DESIGN.md)

Before scaffolding, writing HTML/JSX, or generating CSS for any website, landing page, component, or web interface, the AI MUST NOT make arbitrary styling choices or default to generic styles. It must adopt Anthropic's **`frontend-design`** lead posture (reject AI slop, define intentional visual identity, distinctive typography) and execute this **Pre-Build Visual Selection Protocol**:

1. **Recommend Specific Styles from StyleKit (148 Curated Styles)**:
   * Query matching styles via the CLI (`stylekit search <keyword>`, `stylekit list --category <category>`) or present styles from curated families:
     * *Modern & Tech* (e.g. `linear-glow`, `saas-clean`, `bento-grid`, `glassmorphism`)
     * *Brutalist & Industrial* (e.g. `neo-brutalist`, `monochrome-stark`, `swiss-style`)
     * *Minimalist* (e.g. `zen-minimal`, `nordic-clean`, `monochrome`)
     * *Expressive & Retro* (e.g. `synthwave`, `cyberpunk`, `retro-90s`, `art-deco`)
   * Present 2–3 recommended styles with brief descriptions and design tokens.

2. **Recommend Established Patterns from `DESIGN.md` (63 Brand Systems)**:
   * Recommend matching established brand design systems from `.agents/design-md/` (e.g. *Stripe*, *Linear*, *Supabase*, *Vercel*, *Raycast*, *Apple*, *Notion*, *Claude*, *Cursor*).
   * Or offer to analyze and extract a design system from a reference website URL using **`design-md-creator`**.

3. **Solicit the User's Specific Take (Custom / Bespoke Direction)**:
   * If the user dislikes or rejects the recommended options, explicitly ask for their specific aesthetic preferences:
     * Custom color palettes, mood, and contrast levels
     * Typography preferences (serif, sans-serif, monospace)
     * Target audience, brand feeling, and emotional tone
     * Reference URLs, screenshots, or existing visual materials
   * Generate a custom `DESIGN.md` capturing their exact requirements before coding.

4. **Lock Tokens & Recipes Before Coding**:
   * Once the visual direction is confirmed, pull the design tokens and recipes (`stylekit tokens <slug>`, `stylekit recipe <slug> <comp>`, or load the relevant `DESIGN.md`).
   * Bind the implementation strictly to these tokens and constraints (Tailwind config, CSS variables). Zero visual drift.

---

## 6. Visual Browser Review (Mobile-First)

* **Real Browser Execution**: Drive Playwright (`Learnty_App/playwright-breakpoints.mjs`) for UI changes. Capture DOM rendering, console errors, network failures, and screenshots.
* **Mobile-First Hierarchy**: Mobile is the primary interface; desktop is additive. A UI that works on desktop but breaks on mobile is an invalid deliverable.
* **All-Breakpoint Verification**: Explicitly report status across 6 breakpoints:
  1. Mobile S: 375 × 812 (primary)
  2. Mobile L: 430 × 932 (primary)
  3. Tablet: 768 × 1024 (required)
  4. Laptop: 1280 × 800 (additive)
  5. Desktop: 1440 × 900 (additive)
  6. Wide: 1920 × 1080 (additive)
* **Touch Targets**: Mobile tap targets must be ≥ 44×44 px. Check overflow, navigation collapse, drawers, and input focus under simulated keyboards.

---

## 7. Adversarial Review & Linting Guardrails

* **Adversarial Mandate**: The Critic's job is to surface regressions, edge cases, and architectural flaws, not to rubber-stamp approval.
* **Isolated Critic Protocol**: The implementer must not review their own work. Use **`requesting-code-review`** to trigger review in an isolated subagent/fresh context, and use **`receiving-code-review`** to verify critique with evidence.
* **[CRITIQUE-MIN] Quotas**: Every review must produce:
  1. ≥2 real bugs, edge cases, or security boundary issues.
  2. ≥1 UX or accessibility issue at mobile width.
  3. Linter output with zero unresolved errors: run `oxlint --type-aware` and ensure clean pass.
  4. If fewer than 2 issues are found, the reviewer must document exactly where they looked and verify why the code is clean.

---

## 8. Autonomous Skill-Driven Execution Loop (Zero-Babysitting Standard)

```
Phase 1: Intent & Spec ──► Phase 2: TDD Red ──► Phase 3: Implementation ──► Phase 4: Adversarial Critique ──► Phase 5: Verification & DoD
 (Clarify/Spec/UI Gate)         (TDD)                (Ponytail/RTK)              (oxlint/review)                   (evidence/100% Green)
        ▲                                                                                                                   │
        └─────────────────────────────────── Auto-Loop on Failure (Self-Healing) ───────────────────────────────────────────┘
```

### The Autonomous "Zero-Babysitting" Contract:
1. **Upfront Clarity, Then Full Autonomy:** Clarify intent, scope, and design choices **once** at the start. Never halt halfway to ask for permission on obvious technical steps. Once the plan and spec are locked, execute autonomously to completion.
2. **Never Return Broken or Abstract Code:** If tests fail, linting breaks, or responsive layout fails, do NOT dump half-finished code or error logs onto the user. Run the autonomous feedback loop: diagnose with `systematic-debugging`, fix, and verify until green.

---

### Phase Breakdown:

1. **Phase 1: Intent Discovery, Research & Spec** *(Architect)*
   * **Intent Clarification Gate (`brainstorming` & `grilling`):**
     * When given a broad or new product prompt (e.g., e-commerce, web app, Learnty, Gospel), **do not rush into coding**.
     * Discover intent: target user, primary conversion flow, data persistence needs, and core constraints.
     * Ask focused, high-leverage clarifying questions **one topic at a time** (or via structured multiple-choice) with recommended defaults so the user doesn't have to write essays.
   * **Deep Research (`research` & `context7-mcp`):** Research official APIs, framework conventions, or schemas before designing architecture.
   * **Mandatory UI Selection Gate (Section 5):** Present 2–3 curated visual styles from `StyleKit` or established patterns from `DESIGN.md`. If rejected, capture the user's specific aesthetic take. Lock design tokens before coding.
   * **Spec & Plan Formulation (`speckit` & `writing-plans`):** Write an executable, bite-sized plan with explicit acceptance criteria. Plan critique must verify no speculative bloat.
2. **Phase 2: Test-Driven Red Phase** *(Test Writer)*
   * Execute via the **`test-driven-development`** skill.
   * Write failing tests targeting confirmed public seams with `ripwire-write-tests`.
   * Execute and confirm Red failure reason before writing implementation code; log test IDs.
3. **Phase 3: Surgical Autonomous Implementation** *(Implementer)*
   * Execute tasks using **`subagent-driven-development`** (for independent subtasks) or **`executing-plans`**.
   * Use **`using-git-worktrees`** when task isolation is required.
   * Codebase exploration strictly through `ripwire` verbs.
   * Apply Ponytail Ladder (reach for stdlib before dependencies, minimal lines before abstractions).
   * All terminal commands prefixed with `rtk` (except `ripwire`). Zero plaintext secrets.
4. **Phase 4: Adversarial Critique** *(Critic — isolated context)*
   * Hand off using **`requesting-code-review`** and evaluate feedback using **`receiving-code-review`**.
   * Run structural inspection: `code-review`, `ponytail-review`, `ponytail-audit`, `ripwire-quality-bar`, `ripwire-security-scan`.
   * Run type-aware linter: `oxlint --type-aware` with zero errors.
   * Run Playwright responsive test across all 6 breakpoints.
5. **Phase 5: Deterministic Verification & Completion** *(Verifier)*
   * Execute via **`verification-before-completion`** — gather empirical proof before making success claims.
   * Full test suite execution: confirm 100% green.
   * Run `npx fallow audit` for JS/TS to ensure clean boundaries and no circular dependencies.
   * Confirm every Phase 1 criterion with verifiable command outputs and screenshots.
   * Determine branch integration path via **`finishing-a-development-branch`**.

**Autonomous Self-Healing Loop:** If any phase fails (test failure, linter error, layout mismatch), the agent MUST NOT stop or ask the user what to do. Re-enter the loop: diagnose root cause (`systematic-debugging`), apply fix, re-verify, and repeat until the Definition of Done is 100% satisfied.

---

## 9. Definition of Done (All 9 Required)

1. **Phase 1 Criteria:** Every Phase 1 acceptance criterion verified with empirical evidence via `verification-before-completion`.
2. **Verification Loop:** Full verification passed (green), with test runner outputs.
3. **Fallow Audit:** `npx fallow audit` passed with zero unresolved findings (JS/TS tasks).
4. **Ponytail Verification:** Minimal-code verification passed — zero bloat or speculative abstractions.
5. **Browser Review:** Playwright review passed at all 6 breakpoints; mobile screenshots captured.
6. **Adversarial Critique:** Isolated critique completed via `requesting-code-review` / `receiving-code-review` (≥2 issues surfaced and resolved).
7. **Oxlint Type-Aware Check:** `oxlint --type-aware` executed with zero errors.
8. **Zero Plaintext Secrets On Disk:** No `.env` or credential files committed or written to persistent disk. All secrets handled via Infisical memory injection or RAM-disk `/dev/shm/.env`.
9. **Handoff Summary:** Complete handoff summary recorded via the `handoff` skill.

---

## 10. Anti-Happy-Pass & Credential Guardrails

### Anti-Happy-Pass
Agents are strictly forbidden from approving work or declaring completion with "LGTM", "looks good", or "all tests pass" without producing:
1. Verifiable test execution output.
2. `npx fallow audit` results for JS/TS.
3. Ponytail's minimal-code audit confirmation.
4. Clean `oxlint --type-aware` output.
5. Verified secret-free storage check.

### Shared Agent Credentials Guardrails
* **Never** print passwords, tokens, or API keys into output, terminal logs, screenshots, or committed files.
* **Never** write credentials into any file in this repository.
* Use credentials strictly for operations explicitly authorized in conversation.
* Check for existing authenticated sessions before attempting to create new accounts.
* If a service requires MFA or blocks automation, report it directly to the user — do not attempt to bypass.
