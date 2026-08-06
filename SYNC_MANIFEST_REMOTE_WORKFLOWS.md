# Remote-Workflows Workspace Synchronization Request & Guide

> **To the AI Agent / Contributor in the Source Workspace (`Sebfranklin/remote-workflows`):**
> 
> This document details the exact set of missing skills, scripts, agents, knowledge base documents, and configuration files required to fully synchronize this workspace with the `Sebfranklin/remote-workflows` specification.
> 
> **Rule of Engagement:**
> - Any files or skills that **already exist** in identical state in this target workspace have been preserved and skipped.
> - Please export/generate/copy the exact files listed below into the designated paths.

---

## 1. Missing Core Gauntlet Scripts & Contracts

Please provide the exact implementation for the Gauntlet TDD execution loop and enforcement hooks:

| File Path | Description / Purpose |
| :--- | :--- |
| `bin/gauntlet-loop.mjs` | Node.js runner script for orchestrating `tdd-writer` $\rightarrow$ `coder` $\rightarrow$ `critique`. |
| `bin/validate-tdd-agent-write.mjs` | Validation script for agent file write operations during TDD cycles. |
| `.agents/gauntlet-primary.md` | Primary contract specifying pre-flight rules, TDD triggers, and scope bounds. |
| `.agents/gauntlet-config.json` | JSON schema/configuration template for active Gauntlet tasks. |
| `.agents/gauntlet-workbench.md` | Task tracking and test result state file. |
| `.git-hooks/pre-push` | Shell script for blocking `git push` on `main`/`master` unless Gauntlet status is `PASSED`. |

---

## 2. Missing Skill Directory (`.agents/skills/`)

The following **45 skills** are missing and need to be provided as directories under `.agents/skills/<skill-name>/SKILL.md`:

### Agent Workflow & Triage
- [ ] `gauntlet`
- [ ] `tdd`
- [ ] `code-review`
- [ ] `to-spec`
- [ ] `to-tickets`
- [ ] `triage`
- [ ] `handoff`
- [ ] `grill-me`
- [ ] `grill-with-docs`
- [ ] `grilling`
- [ ] `wayfinder`
- [ ] `implement`
- [ ] `find-skills`

### Codebase Architecture & Design
- [ ] `codebase-design`
- [ ] `domain-modeling`
- [ ] `improve-codebase-architecture`

### UI / Design Taste
- [ ] `design-taste-frontend`
- [ ] `design-taste-frontend-v1`
- [ ] `gpt-taste`
- [ ] `high-end-visual-design`
- [ ] `minimalist-ui`
- [ ] `industrial-brutalist-ui`
- [ ] `stitch-design-taste`
- [ ] `redesign-existing-projects`

### Motion, Video & Animation (HyperFrames Ecosystem)
- [ ] `hyperframes`
- [ ] `hyperframes-animation`
- [ ] `hyperframes-cli`
- [ ] `hyperframes-core`
- [ ] `hyperframes-creative`
- [ ] `hyperframes-keyframes`
- [ ] `hyperframes-registry`
- [ ] `general-video`
- [ ] `motion-graphics`
- [ ] `music-to-video`
- [ ] `faceless-explainer`
- [ ] `product-launch-video`
- [ ] `website-to-video`
- [ ] `pr-to-video`
- [ ] `remotion-to-hyperframes`
- [ ] `slideshow`

### Image, 3D & Vision
- [ ] `image-to-code`
- [ ] `imagegen-frontend-mobile`
- [ ] `imagegen-frontend-web`
- [ ] `img2threejs`
- [ ] `brandkit`
- [ ] `figma`

### Browser Automation & Stealth
- [ ] `pinchtab`
- [ ] `pinchtab-dev`
- [ ] `pinchtab-mcp`
- [ ] `pinchtab-opt`
- [ ] `pinchtab-stealth-score`

### Long-Term Memory
- [ ] `mempalace`
- [ ] `mempalace-recall`
- [ ] `dream`

### AI / Consensus / Evaluation
- [ ] `consensus`
- [ ] `model-benchmarks`
- [ ] `context7-mcp`
- [ ] `cli-agent-router`

### Document Processing & Content
- [ ] `pptx`
- [ ] `research`
- [ ] `stop-slop`
- [ ] `humanizer`
- [ ] `full-output-enforcement`

### Utility & Learning
- [ ] `ask-matt`
- [ ] `here-now`
- [ ] `fallow`
- [ ] `diagnosing-bugs`
- [ ] `prototype`
- [ ] `teach`
- [ ] `writing-great-skills`

---

## 3. Missing OKF (Open Knowledge Format) Structure

Please populate the `okf/` knowledge base tree with the following documentation files:

```
okf/
├── INDEX.md
├── concepts/
│   ├── agentic_engineering.md
│   ├── consensus_engine.md
│   ├── document_pipeline.md
│   ├── gospel_platform.md
│   ├── learnty_app.md
│   ├── pedagogical_engine.md
│   └── workspace_overview.md
├── policies/
│   └── agent_workflow.md
└── metrics/
    └── code_quality.md
```

---

## 4. Missing Agent Role Prompt Definitions & Plugins

Please provide the prompt markdown files and plugins under `.opencode/` and `.kilo/`:

### Agents (`.kilo/agent/` & `.opencode/agent/`)
- [ ] `coder.md`
- [ ] `critique.md`
- [ ] `research.md`
- [ ] `tdd-writer.md`
- [ ] `test-writer.md`

### Commands / System Prompts (`.opencode/command/`)
- [ ] `dream.md`
- [ ] `ponytail.md`
- [ ] `prompter.md`
- [ ] `consensus.md`

### Plugins (`.opencode/plugin/`)
- [ ] `ponytail.mjs`
- [ ] `ponytail-frontmatter.cjs`

---

## 5. Shell & Service Configurations

Please provide configuration snippets or updates for:
1. **PinchTab Auto-Start**:
   Add to shell init (`~/.bashrc` / `~/.zshrc`):
   ```bash
   pgrep -f "pinchtab server" >/dev/null || (nohup pinchtab server > ~/.pinchtab/pinchtab.log 2>&1 &)
   ```
2. **MCP Configurations**:
   - `Pollinations`: `npx @pollinations/mcp`
   - `MemPalace`: `mempalace-mcp --palace ~/.mempalace/palace`
   - `Context7`: `https://mcp.context7.com/mcp`

---

## Summary of Next Steps for the Source Agent

1. Read this manifest in target workspace: `SYNC_MANIFEST_REMOTE_WORKFLOWS.md`.
2. Package or write out the missing files into their exact paths.
3. Once completed, run `git hook` verification and ensure all 68 skills are indexed in `.agents/skills/`.
