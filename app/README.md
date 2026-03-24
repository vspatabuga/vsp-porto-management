# VSP Porto Management

**Experience Sovereign Systems Locally**

A CLI tool for managing and running VSP portfolio simulations. One-command installation to try all prototypes without manual setup.

## Quick Start

```bash
# Install
curl -fsSL https://porto.vspatabuga.io/install | sh

# Or via npm (coming soon)
npm install -g @vspatabuga/porto

# List available simulations
vsp-porto list

# Install a simulation
vsp-porto install kalpataru

# Start a simulation
vsp-porto start kalpataru
# → Opens http://localhost:3000

# Stop a simulation
vsp-porto stop kalpataru

# Remove completely
vsp-porto destroy kalpataru
```

## Available Simulations

| Package | Port | Description |
|---------|------|-------------|
| kalpataru | 3000 | Waste Management System |
| ai-gov | 3003 | AI Governance Stack |
| ledger | 3001 | Blockchain Voting |
| iac | 3002 | Multi-Cloud IaC |
| zero-trust | 3004 | Zero-Trust Network |

## Requirements

- Node.js 18+
- Docker 20.10+
- npm or yarn

## Commands

| Command | Description |
|---------|-------------|
| `vsp-porto install [pkg]` | Install package(s) |
| `vsp-porto list` | List all packages |
| `vsp-porto start <pkg>` | Start simulation |
| `vsp-porto stop <pkg>` | Stop simulation |
| `vsp-porto destroy <pkg>` | Remove simulation |

## License

MIT © VSP (Virgiawan Sagarmata Patabuga)
