# Appview

## Running

To run with Docker Compose (includes database and appview):
`deno task docker-dev`. This will start both the database and appview services
in Docker containers.

For development without Docker, set up the .env file by following the
instructions down below, then start the development server: `deno task dev`

Both methods will start the server in development mode with hot reloading enabled available at `http://localhost:4000`.

## Environment Variables

.env setup:

```
# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=dev
DB_USER=mongo
DB_PASSWORD=mongo

# Server
HOST=0.0.0.0
NODE_ENV=development
PORT=4000
PUBLIC_URL=http://localhost:3000
SERVICE_DID=did:web:localhost

# Keys, generate these with openssl ecparam --name secp256k1 --genkey --noout --outform DER | tail --bytes=+8 | head --bytes=32 | xxd --plain --cols 32
APPVIEW_K256_PRIVATE_KEY_HEX=keyhex
ADMIN_PASSWORD=password
```
