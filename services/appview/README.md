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

See the `.env.example` file in the project root to see what environment variables are required for the application to run properly. This file contains all the necessary configuration options with example values.
