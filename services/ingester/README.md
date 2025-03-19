# Jetstream Ingester Service

This service connects to the Bluesky Jetstream WebSocket service, processes events, and stores them in MongoDB.

## Features

- Connects to Jetstream and processes events in real-time
- Handles connection failures and reconnects automatically
- Resolves DIDs to handles
- Stores like events in MongoDB
- Extensible event handler system

## Setup

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables:

Create a `.env` file with the following variables:

```env
NODE_ENV=development
JETSTREAM_URL=wss://jetstream2.us-east.bsky.network/subscribe
DB_NAME=dev
DB_HOST=localhost
DB_PORT=27017
DB_USER=mongo
DB_PASSWORD=mongo
```

## Running

```bash
# Development mode with auto-reload
bun dev

# Production mode
bun start
```

## Adding New Event Handlers

To add support for new event types:

1. Create a new handler file in `src/handlers/`
2. Add the handler to the registry in `src/handlers/index.ts`

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
