#!/usr/bin/env bash
set -euo pipefail

echo "========================================================"
echo " Bootstrapping Full Agent Engineering Environment (VM) "
echo "========================================================"

mkdir -p "$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PATH"

if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi

# 1. System prerequisites
echo "--> Checking system tools (curl, git, jq, tar)..."
if command -v apt-get &>/dev/null; then
  sudo apt-get update -y && sudo apt-get install -y curl git jq tar build-essential
fi

# 2. Install uv (Fast Python Package & Tool Manager)
if ! command -v uv &>/dev/null; then
  echo "--> Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# 3. Install Infisical CLI
if ! command -v infisical &>/dev/null; then
  echo "--> Installing Infisical CLI..."
  INFISICAL_VERSION="0.43.132"
  curl -sSL "https://github.com/Infisical/cli/releases/download/v${INFISICAL_VERSION}/cli_${INFISICAL_VERSION}_linux_amd64.tar.gz" -o /tmp/infisical.tar.gz
  tar -xzf /tmp/infisical.tar.gz -C "$HOME/.local/bin" infisical
  chmod +x "$HOME/.local/bin/infisical"
  rm -f /tmp/infisical.tar.gz
fi

# 4. Install Gitleaks
if ! command -v gitleaks &>/dev/null; then
  echo "--> Installing Gitleaks..."
  GITLEAKS_VERSION="8.30.1"
  curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o /tmp/gitleaks.tar.gz
  tar -xzf /tmp/gitleaks.tar.gz -C "$HOME/.local/bin" gitleaks
  chmod +x "$HOME/.local/bin/gitleaks"
  rm -f /tmp/gitleaks.tar.gz
fi

# 5. Install Spec Kit (specify-cli) & symlink speckit
if ! command -v specify &>/dev/null; then
  echo "--> Installing Spec Kit (specify-cli)..."
  uv tool install specify-cli
  ln -sf "$HOME/.local/bin/specify" "$HOME/.local/bin/speckit"
fi

# 6. Install MemPalace CLI
if ! command -v mempalace &>/dev/null; then
  echo "--> Installing MemPalace CLI..."
  uv tool install mempalace
fi

# 7. Install Global Node-based Tooling
echo "--> Installing Node-based CLIs (Supabase, Wrangler, Oxlint, StyleKit)..."
npm install -g supabase wrangler oxlint oxlint-tsgolint @anxforever/stylekit-cli fallow

# 8. Configure Infisical Project ID
if [ ! -f ".infisical.json" ]; then
  echo "--> Initializing .infisical.json..."
  cat << 'JSON' > .infisical.json
{
  "projectId": "76f86766-bacb-41bd-8285-9c1d2a01939d"
}
JSON
fi

# 9. Configure Git Hooks (.githooks)
echo "--> Configuring Git hooks directory..."
git config core.hooksPath .githooks
chmod +x .githooks/* 2>/dev/null || true

# 10. Ensure Rule Symlinks exist
echo "--> Verifying canonical AGENTS.md symlinks..."
mkdir -p .agents/rules .gemini/agents
ln -sf /workspaces/codespaces-blank/AGENTS.md .agents/rules/universal-agent-addendum.md 2>/dev/null || true
ln -sf /workspaces/codespaces-blank/AGENTS.md .gemini/agents/universal-agent-addendum.md 2>/dev/null || true

echo "========================================================"
echo " VM / Environment Bootstrap Complete!                 "
echo "  • AGENTS.md canonical rules active                   "
echo "  • .githooks protected (main branch, gitleaks, oxlint) "
echo "  • Spec Kit, StyleKit, MemPalace, Supabase, Wrangler OK"
echo " Run: 'infisical login' to authenticate secrets vault  "
echo "========================================================"
