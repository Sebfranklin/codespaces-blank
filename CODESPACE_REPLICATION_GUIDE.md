# GitHub Codespaces Agent Replication Guide (Antigravity / `agy`)

> **Target Environment:** GitHub Codespaces (Debian/Ubuntu Linux container, user `vscode`)  
> **Target Agent:** Antigravity (`agy`) / Autonomous Coding Agents  
> **Objective:** Faithfully replicate the exact security tooling, Infisical secret vault architecture, lean Supabase protocol, pre-commit gates, and workspace intelligence configured in this studio.

---

## Table of Contents
1. [Prerequisites & System Packages](#1-prerequisites--system-packages)
2. [CLI Tool Installations](#2-cli-tool-installations)
   - [A. Infisical CLI](#a-infisical-cli)
   - [B. Gitleaks](#b-gitleaks)
   - [C. Supabase CLI](#c-supabase-cli)
   - [D. Vercel CLI](#d-vercel-cli)
   - [E. Oxlint (Fast Type-Aware Linter)](#e-oxlint-fast-type-aware-linter)
3. [Infisical Secret Vault Setup](#3-infisical-secret-vault-setup)
   - [Project ID & Configuration](#project-id--configuration)
   - [Authentication in Codespaces (Headless / Token)](#authentication-in-codespaces-headless--token)
   - [Vault Folder Hierarchy](#vault-folder-hierarchy)
   - [Tested Root Secrets Matrix](#tested-root-secrets-matrix)
4. [Zero-Plaintext In-Memory Injection Scripts](#4-zero-plaintext-in-memory-injection-scripts)
   - [Web App Dev Server (`npm run dev:secrets`)](#web-app-dev-server-npm-run-devsecrets)
   - [Supabase Edge Functions (`npm run serve:edge`)](#supabase-edge-functions-npm-run-serveedge)
   - [Production Builds (`infisical run`)](#production-builds-infisical-run)
5. [Lean Supabase Operations Protocol](#5-lean-supabase-operations-protocol)
   - [Codespaces Disk & Memory Conservation](#codespaces-disk--memory-conservation)
   - [Local Development vs Remote Production Keys](#local-development-vs-remote-production-keys)
   - [Local-First Testing Mandate](#local-first-testing-mandate)
   - [Mandatory Container Shutdown](#mandatory-container-shutdown)
6. [Pre-Commit Hooks & Automated Guardrails](#6-pre-commit-hooks--automated-guardrails)
   - [Gitleaks Hook](#gitleaks-hook)
   - [Oxlint Hook](#oxlint-hook)
7. [Workspace Intelligence & Agent System Addendum](#7-workspace-intelligence--agent-system-addendum)
   - [Universal System Addendum v3 Placement](#universal-system-addendum-v3-placement)
   - [Rules Enforcement (`AGENTS.md`)](#rules-enforcement-agentsmd)
8. [Automated One-Shot Bootstrap Script](#8-automated-one-shot-bootstrap-script)

---

## 1. Prerequisites & System Packages

In GitHub Codespaces, default packages are installed under the `vscode` user with `sudo` available. Ensure standard build utilities, `curl`, `jq`, and node tools are available:

```bash
sudo apt-get update && sudo apt-get install -y curl jq tar git
mkdir -p ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"
```

To ensure `~/.local/bin` is permanently in PATH, verify `~/.bashrc`:
```bash
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi
```

---

## 2. CLI Tool Installations

### A. Infisical CLI
Install the official Infisical binary release:

```bash
# Option 1: Official Debian Repository (Recommended in Codespaces)
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
sudo apt-get install -y infisical

# Option 2: Standalone binary (if apt is restricted)
INFISICAL_VERSION="0.43.132"
curl -sSL "https://github.com/Infisical/cli/releases/download/v${INFISICAL_VERSION}/cli_${INFISICAL_VERSION}_linux_amd64.tar.gz" -o /tmp/infisical.tar.gz
tar -xzf /tmp/infisical.tar.gz -C ~/.local/bin infisical
chmod +x ~/.local/bin/infisical
rm -f /tmp/infisical.tar.gz
```

Verify:
```bash
infisical --version
```

---

### B. Gitleaks
Protects against committing credentials, tokens, and keys into Git:

```bash
GITLEAKS_VERSION="8.30.1"
curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o /tmp/gitleaks.tar.gz
tar -xzf /tmp/gitleaks.tar.gz -C ~/.local/bin gitleaks
chmod +x ~/.local/bin/gitleaks
rm -f /tmp/gitleaks.tar.gz
```

Verify:
```bash
gitleaks version
```

---

### C. Supabase CLI
Required for running local migrations, testing Edge Functions, and schema validations:

```bash
npm install -g supabase
```

Verify:
```bash
supabase --version
```

---

### D. Vercel CLI
Required for deployments, domain inspection, and preview URLs:

```bash
npm install -g vercel
```

Verify:
```bash
vercel --version
```

---

### E. Oxlint (Fast Type-Aware Linter)
Sub-second static analysis and type checking used in Gospel & Learnty:

```bash
npm install -g oxlint oxlint-tsgolint
```

---

## 3. Infisical Secret Vault Setup

### Project ID & Configuration
In the workspace root of your Codespace project, create `.infisical.json`:

```json
{
  "projectId": "76f86766-bacb-41bd-8285-9c1d2a01939d"
}
```

### Authentication in Codespaces (Headless / Token)
In ephemeral GitHub Codespaces, interactive OAuth login can be cumbersome upon container rebuild. Use either of these methods:

1. **Service Token / Machine Identity (Best for Codespaces / CI)**:
   Add `INFISICAL_TOKEN` to your **GitHub Codespaces Secrets** (`Settings -> Secrets and variables -> Codespaces` in GitHub).
   When `INFISICAL_TOKEN` is set, `infisical` commands authenticate automatically in non-interactive sessions.

2. **Interactive CLI Login (Keyring Backend)**:
   ```bash
   infisical login
   ```
   Follow the CLI prompt to authenticate via browser. Verify login status:
   ```bash
   infisical login status
   ```

### Vault Folder Hierarchy
The vault is organized into clean hierarchical paths:
```text
/                  <-- Root: Shared global services (Vercel, GitHub, Cloudflare, Firecrawl, Pollinations, Supabase PAT)
├── /Gospel        <-- Gospel App specifics (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GEOCODER_CONTACT_EMAIL)
└── /Learnty       <-- Learnty App specifics (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
```

### Tested Root Secrets Matrix
Every root key verified live in this session:
- `CLOUDFLARE_API_TOKEN`: Active token verified against Cloudflare API.
- `FIRECRAWL_API_KEY`: Active scraping API key verified against Firecrawl API.
- `GITHUB_PERSONAL_ACCESS_TOKEN`: Active GitHub PAT (`repo`, `read:org`).
- `POLLINATIONS_API_KEY`: Active key verified with `text.pollinations.ai` (requires `User-Agent` header).
- `VERCEL_API_KEY`: Active deployment token verified against `api.vercel.com`.
- `SUPABASE_ACCESS_TOKEN`: User-scoped Personal Access Token (`sbp_...`) required for `supabase projects list` and CLI deployments.

---

## 4. Zero-Plaintext In-Memory Injection Scripts

> **MANDATORY RULE:** Never write `.env` files containing real secrets to persistent disk. All secrets must be injected into process memory at runtime.

Add these exact scripts to `package.json` for each project:

### Web App Dev Server (`npm run dev:secrets`)
Merges root `/` and project folder secrets directly into the Vite process memory:

```json
"scripts": {
  "dev": "vite",
  "dev:secrets": "infisical run --path='/' --path='/Gospel' -- vite"
}
```
*(Change `/Gospel` to `/Learnty` for the Learnty app)*

### Supabase Edge Functions (`npm run serve:edge`)
Supabase Edge Functions require an env file via `--env-file`. To follow the zero-leak rule, pipe secrets into the Linux shared-memory RAM disk (`/dev/shm/.env`) and install an `EXIT` trap that immediately unlinks the file when the process stops:

```json
"scripts": {
  "serve:edge": "bash -c 'trap \"rm -f /dev/shm/.env\" EXIT INT TERM; (infisical export --path=\"/\" --format=dotenv 2>/dev/null; infisical export --path=\"/Gospel\" --format=dotenv 2>/dev/null) > /dev/shm/.env && supabase functions serve --env-file /dev/shm/.env'"
}
```

### Production Builds (`infisical run`)
Run builds with secrets injected in-memory:
```bash
infisical run --path="/" --path="/Gospel" -- npm run build
```

---

## 5. Lean Supabase Operations Protocol

### Codespaces Disk & Memory Conservation
GitHub Codespaces (like Lightning Studio) runs with resource and disk limits. Full local Supabase installations consume several gigabytes of Docker images and memory.

**Minimal Start Command:**
```bash
supabase start -x studio,inbucket,analytics,realtime,storage,edge-runtime
```
*Disables the bulky studio UI, email inbucket, analytics, and storage services, running only the core Postgres database.*

### Local Development vs Remote Production Keys
- When running `supabase start`, the CLI prints `anon key` and `service_role key`.
- **CRITICAL DISTINCTION:** Those are **local-only test keys**. They do NOT work on remote production Supabase and return `401 Unauthorized` if tested against your remote project.
- Production keys belong strictly in Infisical (`/Gospel` or `/Learnty`).

### Local-First Testing Mandate
Before running `supabase db push` or deploying edge functions remotely:
1. **Migrations**: Verify locally first:
   ```bash
   supabase migration up
   ```
2. **Edge Functions**:
   - Serve locally: `npm run serve:edge`
   - Test endpoints at `http://127.0.0.1:54321/functions/v1/<fn-name>`
   - Edge functions must bind HTTP listener using `Deno.serve(handler)`.
   - Custom local environment variables passed to functions **cannot start with `SUPABASE_`** (reserved by Supabase CLI; use standard names like `JWT_SECRET`).

### Mandatory Container Shutdown
To release memory and free ports (`54321`, `54322`), always stop Supabase immediately when tests finish:
```bash
supabase stop
```

---

## 6. Pre-Commit Hooks & Automated Guardrails

Ensure Gitleaks and Oxlint run automatically on `git commit`:

### Gitleaks Hook
Create `.git/hooks/pre-commit` (or add to your `.husky/pre-commit`):

```bash
cat << 'EOF' > .git/hooks/pre-commit
#!/usr/bin/env bash
set -e

echo "==> Running Gitleaks credential protection..."
gitleaks protect --staged --verbose

if [ -f ".oxlintrc.json" ]; then
  echo "==> Running Oxlint type-aware check..."
  oxlint --type-aware
fi

echo "==> Pre-commit checks passed."
EOF

chmod +x .git/hooks/pre-commit
```

---

## 7. Workspace Intelligence & Agent System Addendum

### Universal System Addendum v3 Placement
Place `universal-agent-addendum.md` in `.gemini/agents/universal-agent-addendum.md`:
- Includes `[INFISICAL-SECRETS — ZERO PLAINTEXT SECRETS ON DISK]`
- Includes `[LEAN-SUPABASE — MINIMAL FOOTPRINT & LOCAL-FIRST]`
- Includes `[CRITIQUE-MIN]` with `oxlint --type-aware`
- Includes 9 mandatory Definition-of-Done gates

### Rules Enforcement (`AGENTS.md`)
Add the core Infisical and Supabase rules to your workspace's root `AGENTS.md` to ensure any LLM agent operating in Codespaces enforces the zero-plaintext and local-first requirements.

---

## 8. Automated One-Shot Bootstrap Script

To set up everything above in a single command inside a fresh Codespace, run this script:

```bash
cat << 'EOF' > /tmp/bootstrap-codespace.sh
#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo " Bootstrapping Codespace Agent Environment"
echo "=========================================="

mkdir -p "$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PATH"

# 1. Install Infisical
if ! command -v infisical &>/dev/null; then
  echo "--> Installing Infisical CLI..."
  curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
  sudo apt-get install -y infisical
fi

# 2. Install Gitleaks
if ! command -v gitleaks &>/dev/null; then
  echo "--> Installing Gitleaks..."
  GITLEAKS_VERSION="8.30.1"
  curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o /tmp/gitleaks.tar.gz
  tar -xzf /tmp/gitleaks.tar.gz -C "$HOME/.local/bin" gitleaks
  chmod +x "$HOME/.local/bin/gitleaks"
  rm -f /tmp/gitleaks.tar.gz
fi

# 3. Install Node-based CLIs
echo "--> Installing Supabase, Vercel, and Oxlint CLIs..."
npm install -g supabase vercel oxlint oxlint-tsgolint

# 4. Configure .infisical.json if not present
if [ ! -f ".infisical.json" ]; then
  echo "--> Initializing .infisical.json..."
  cat << 'JSON' > .infisical.json
{
  "projectId": "76f86766-bacb-41bd-8285-9c1d2a01939d"
}
JSON
fi

echo "=========================================="
echo " Codespace Bootstrap Complete!            "
echo " Run: 'infisical login' to authenticate   "
echo "=========================================="
EOF

chmod +x /tmp/bootstrap-codespace.sh
/tmp/bootstrap-codespace.sh
```
