# Spark AppView

An AT Protocol AppView implementation that provides a comprehensive view of the
Spark lexicon.

## Features

- **Real-time sync**: Subscribes to AT Protocol relay for live data ingestion
- **Rich API**: XRPC endpoints for feeds, profiles, audio, stories, and social
  graph
- **MongoDB storage**: Efficient document-based storage with Mongoose ODM
- **Pipeline architecture**: Clean separation between skeleton, hydration, and
  presentation layers

## Quick Start

### Docker Compose (Recommended)

```bash
deno task docker-dev
```

This starts MongoDB and the AppView in Docker containers with hot reloading at
`http://localhost:4000`.

### Local Development

1. **Prerequisites**: Deno 2.x, MongoDB 8.x

2. **Environment setup**: Create `.env` file (see Configuration below)

3. **Start services**:

```bash
deno task dev
```

This runs three parallel services:

- MongoDB (`dev:db`)
- API server (`dev:api`) on port 4000
- Ingester (`dev:ingest`) for real-time sync

## Architecture

### Key Directories

- `api/` - XRPC endpoint handlers using pipeline pattern
- `data-plane/` - Database layer, indexing plugins, and subscription logic
- `hydration/` - Data enrichment layer (actors, feeds, graphs)
- `views/` - Presentation layer transforming hydrated data to API responses
- `lexicons/` - AT Protocol lexicon definitions (JSON)
- `lex/` - Generated TypeScript types from lexicons (`deno task codegen`)
- `utils/` - Shared utilities (transformers, logger, retry logic)

### Data Flow

```
AT Protocol Relay → Ingester → MongoDB ← Data Plane ← Pipeline ← API Endpoints
  (Firehose)      (ingest.ts)          (Raw queries) (4 stages)     (XRPC)
```

### Request Pipeline (api/)

Every API endpoint follows a 4-stage pipeline pattern:

```
                          Client Request
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. SKELETON                                                     │
│    • Query parameters → minimal data identifiers (URIs, DIDs)   │
│    • Fast database queries for structure only                   │
│    • Returns: { postUris: [...], authorDids: [...] }            │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. HYDRATION (hydration/)                                       │
│    • Skeleton → Data Plane → rich data from MongoDB             │
│    • Batch fetches: actors, posts, likes, blocks, etc.          │
│    • Returns: HydrationState with all related records           │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. RULES                                                        │
│    • Apply business logic (filtering, sorting, permissions)     │
│    • Modify skeleton based on hydrated data                     │
│    • Returns: Modified skeleton                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PRESENTATION (views/)                                        │
│    • Skeleton + Hydration → API response format                 │
│    • Transform internal models to lexicon types                 │
│    • Apply CDN URLs, format dates, handle takedowns             │
│    • Returns: JSON response matching lexicon schema             │
└────────────────────────────────┬────────────────────────────────┘
                                 ▼
                          Client Response
```

### Layer Responsibilities

**Data Plane** (`data-plane/`)

- Direct MongoDB access through Mongoose models
- Route handlers: `actors`, `feeds`, `follows`, `likes`, `blocks`, etc.
- No business logic, pure data operations
- Used only by Hydrator

**Hydrator** (`hydration/`)

- Orchestrates Data Plane queries
- Batches requests for efficiency
- Maintains viewer context (permissions, blocks)
- Returns `HydrationState` with all data needed for presentation

**Views** (`views/`)

- Pure transformation functions
- No database access
- Applies CDN URLs, formats responses
- Enforces lexicon schemas

## Configuration

Create a `.env` file:

```bash
# Database
SPRK_DB_URI=mongodb://mongo:mongo@localhost:27017
SPRK_DB_NAME=dev

NODE_ENV=development
SPRK_PORT=4000
SPRK_PUBLIC_URL=https://example.com
SPRK_SERVER_DID=did:web:example.com

# openssl ecparam -name secp256k1 -genkey -noout -outform DER | tail -c +8 | head -c 32 | xxd -p -c 32
SPRK_PRIVATE_KEY=your_private_key_hex
SPRK_ADMIN_PASSWORDS=password1,password2
SPRK_MOD_SERVICE_DID=did:web:mod.bsky.app

SPRK_VERSION=0.1.0
SPRK_INDEXED_AT_EPOCH=2025-01-01T00:00:00Z
```
