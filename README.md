# Spark AppView

This AppView provides a view of AT Protocol that encompasses all Spark lexicon
and aims to interop with Bluesky lexicon.

## Development

To run with Docker Compose (includes database and appview):
`deno task docker-dev`. This will start both the database and appview services
in Docker containers.

For development without Docker, set up the .env file by following the
instructions down below, then start the development server: `deno task dev`

Both methods will start the server in development mode with hot reloading
enabled available at `http://localhost:4000`.

## Environment Variables

.env setup:

```
# Database
SPRK_DB_URI=mongodb://mongo:mongo@localhost:27017

# Server
NODE_ENV=development
SPRK_PORT=4000
SPRK_PUBLIC_URL=http://localhost:3000
SPRK_SERVER_DID=did:web:localhost

# Keys, generate these with openssl ecparam --name secp256k1 --genkey --noout --outform DER | tail --bytes=+8 | head --bytes=32 | xxd --plain --cols 32
# On Mac: openssl ecparam -name secp256k1 -genkey -noout -outform DER | tail --bytes=+8 | head --bytes=32 | xxd --plain --cols 32
SPRK_PRIVATE_KEY=keyhex
SPRK_ADMIN_PASSWORDS=password1,password2
```
