# Appview

## Running

To run for development, first install dependencies. `pnpm install`

To run in Docker, first build the image: `docker build -t appview .`

Then run the container: `pnpm docker-dev`

For development without Docker, copy the .env.example file into a .env file and
follow the instructions to generate a key, then start the development server:
`pnpm dev`

This will start the server in development mode with hot reloading enabled.

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
PORT=3000
PUBLIC_URL=http://localhost:3000
SERVICE_DID=did:web:localhost

# Keys, generate these with openssl ecparam --name secp256k1 --genkey --noout --outform DER | tail --bytes=+8 | head --bytes=32 | xxd --plain --cols 32
APPVIEW_K256_PRIVATE_KEY_HEX=keyhex
ADMIN_PASSWORD=password
```
