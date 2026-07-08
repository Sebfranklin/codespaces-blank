# Design Spec: SkillOpt CLI Integration

## Objective
Integrate the local workspace agent command-line interfaces (`agy`, `kimchi`, `opencode`) with the cloned Microsoft `SkillOpt` framework. Specifically, make them available as execution backends for `skillopt-sleep` offline self-evolution cycles.

## Context & Architecture
SkillOpt-Sleep is a nightly companion that optimizes coding agent instructions (skills) based on session transcripts and offline task replays. The framework uses a modular backend system defined in `skillopt_sleep/backend.py`. 

To support local agent CLIs, we implemented:
1. **AgyCliBackend**: Invokes `agy -p {prompt} --dangerously-skip-permissions` to evaluate prompts.
2. **KimchiCliBackend**: Invokes `kimchi -p {prompt} --auto` to evaluate prompts.
3. **OpencodeCliBackend**: Invokes `opencode run -m {model} --auto -- {prompt}` to evaluate prompts, parsing and stripping the compilation headers `> build ·` from the output.

## Implementation Details

### 1. Backend Additions (`skillopt_sleep/backend.py`)
Registered the backend classes extending `CliBackend` and mapped them in the `get_backend` factory function:
- `agy` / `antigravity` -> `AgyCliBackend`
- `kimchi` -> `KimchiCliBackend`
- `opencode` -> `OpencodeCliBackend`

### 2. Argument Parsing (`skillopt_sleep/__main__.py`)
Added `"agy"`, `"kimchi"`, and `"opencode"` as valid choices for the `--backend` command-line argument.

### 3. Agent Skill Registration (`skillopt-sleep` Skill)
Created and registered a custom Antigravity skill in `/home/codespace/.gemini/antigravity-cli/skills/skillopt-sleep/SKILL.md` explaining how the agents can run, test, and adopt SkillOpt-Sleep nightly self-optimizations.

## Verification
- Dry-runs for all three backends completed successfully:
  ```bash
  skillopt-sleep dry-run --backend agy
  skillopt-sleep dry-run --backend kimchi
  skillopt-sleep dry-run --backend opencode
  ```
- Deterministic proof experiment completed successfully:
  ```bash
  python -m skillopt_sleep.experiments.run_experiment --persona researcher --assert-improves
  ```
