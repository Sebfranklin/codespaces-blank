name: cloudflare-tunnel
description: >
  Expose any local web server, app, or service running on a port to a public HTTPS URL 
  using Cloudflare Tunnel (cloudflared). Use when asked to "tunnel a port", "expose port X", 
  "make port X public", "share local web app", "open tunnel for port X", or "make web app accessible".
---

# Cloudflare Tunnel Skill (`cloudflare-tunnel`)

This skill allows agents to instantly expose any local port running on this cloud computer to a secure, public `https://....trycloudflare.com` URL without requiring any authentication, password prompts, or local SSH client setup.

## Helper Script Location
- Script: `/teamspace/studios/this_studio/tunnel.sh`
- Binary: `/tmp/cloudflared` (auto-downloaded if missing)

## Usage

To tunnel any port (e.g. port `3000`, `4096`, `8000`, `8080`):

```bash
/teamspace/studios/this_studio/tunnel.sh <port>
```

### Example

To tunnel port 3000:
```bash
/teamspace/studios/this_studio/tunnel.sh 3000
```

To tunnel Opencode Web (port 4096):
```bash
opencode serve --port 4096 --hostname 0.0.0.0 &
/teamspace/studios/this_studio/tunnel.sh 4096
```

## How It Works Under The Hood

1. Check if `/tmp/cloudflared` binary exists. If not, download `cloudflared-linux-amd64` from Cloudflare's official GitHub release.
2. Launch `/tmp/cloudflared tunnel --url http://127.0.0.1:<port>`.
3. Read the output log to extract the generated `https://xxxx.trycloudflare.com` URL.
4. Return the public URL to the user.

## What to tell the user

- Share the generated `https://xxxx.trycloudflare.com` URL directly.
- Remind the user that Cloudflare Tunnels are instant, free, and require no IP password or authentication prompt.
