# Appview

## Running

To run for development, first install dependencies.
`pnpm install`

To run in Docker, first build the image:
`docker build -t appview .`

Then run the container:
`pnpm docker-dev`

For development without Docker, copy the .env.example file into a .env file and follow the instructions to generate a key, then start the development server:
`pnpm dev`

This will start the server in development mode with hot reloading enabled.

## Environment Variables

The following environment variables are required:

- `PORT` - Port to run the server on (default: 3000)
- `DATABASE_URL` - MongoDB connection string
- `DID_RESOLVER_URL` - URL of the DID resolver service
- `CDN_URL` - URL of the CDN service for serving media

## API Routes

The service exposes the following API routes:

### Actor Routes
- `GET /xrpc/so.sprk.actor.getProfile` - Get profile details for an actor
- `GET /xrpc/so.sprk.actor.searchActors` - Search for actors

### Graph Routes  
- `GET /xrpc/so.sprk.graph.getFollowers` - Get followers for an actor
- `GET /xrpc/so.sprk.graph.getFollows` - Get accounts an actor follows

### Feed Routes
- `GET /xrpc/so.sprk.feed.getPosts` - Get post objects from URIs
- `GET /xrpc/so.sprk.feed.getAuthorFeed` - Get a post and all replies to it