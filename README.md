# VOLQ

VOLQ is a self-hosted game server management platform made of two parts:

- `VOLQ PANEL`: the web dashboard for managing users, nodes, and game server instances
- `VOLQ NODE`: the daemon that runs on each host machine and controls Docker containers, files, FTP, and live stats

It is designed to let you manage game servers from one central panel while each node handles the actual server workload locally.

## What VOLQ Does

VOLQ provides a complete control layer for Docker-based game servers, including:

- creating, starting, stopping, restarting, and deleting instances
- live console access through the browser
- real-time CPU, RAM, and disk monitoring
- file browsing, upload, download, edit, rename, zip, and unzip tools
- plugin installation and management
- per-instance FTP access
- database provisioning
- port and network management
- scheduled automations
- user access control
- node health and admin management

## Repository Structure

```text
VOLQ-main/
|-- VOLQ PANEL/   # web panel
|-- VOLQ NODE/    # node daemon
|-- README.md
|-- LICENSE
`-- logo.png
```

## Requirements

Before installing, make sure you have:

- Node.js 18 or newer
- npm 9 or newer
- Docker 24 or newer
- MySQL, if you plan to use the database features on the node side

## How It Works

The panel and node talk to each other over HTTP and WebSocket.

1. The panel stores your admin data, users, nodes, and instance settings.
2. The node receives commands from the panel and performs the actual server operations.
3. Docker runs the game servers.
4. FTP, file access, and stats are exposed through the node for each instance.

The node must be able to reach Docker on the machine where it is running, and the panel must be able to reach the node over the network.

## Installation

Clone the repository and install each app separately.

### 1. Install the panel

```bash
cd "VOLQ PANEL"
npm install
npm run seed
npm run createUser
npm start
```

### 2. Install the node

```bash
cd "VOLQ NODE"
npm install
npm start
```

## Panel Setup

The panel runs on port `3000` by default.

Important files and commands:

- `VOLQ PANEL/config.json` stores panel settings
- `npm run seed` initializes the database
- `npm run createUser` creates the first admin account
- `npm start` starts the panel server

If you are developing locally, make sure the panel can reach the node address you configure in the admin interface.

## Node Setup

The node runs on port `3002` by default and uses an FTP service on port `3003`.

Important files and commands:

- `VOLQ NODE/config.json` stores node connection settings
- `node handlers/configure.js` helps configure the node from the panel
- `npm start` starts the daemon

The node configuration must match the API key registered in the panel.

## Default Ports

| Service | Default Port |
| --- | ---: |
| Panel HTTP | 3000 |
| Node HTTP API | 3002 |
| Node FTP | 3003 |

## Node and Panel Connection

To connect a node to the panel:

1. Start the panel.
2. Create the first admin account.
3. Add or configure the node from the panel admin area.
4. Make sure the node config uses the correct panel URL and API key.
5. Start the node and confirm it is reachable from the panel.

If the node shows offline, the most common causes are:

- Docker is not running on the node machine
- the panel is pointing to the wrong node address
- the node API key does not match the panel
- a firewall is blocking the node port

## Development Scripts

### VOLQ PANEL

```bash
npm start        # start the panel
npm run start:dev # start with nodemon
npm run dev       # run server and browser sync together
npm run seed      # initialize panel data
npm run createUser
npm run build:css # build Tailwind CSS
```

### VOLQ NODE

```bash
npm start
npm run configure
```

## Security Notes

This project is intended for self-hosted environments.

- keep your panel and node API keys private
- do not expose admin endpoints without authentication
- use HTTPS in production where possible
- make sure Docker access is only available to trusted machines

## License

MIT
