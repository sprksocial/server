FROM node:20.11-alpine3.18 AS build

RUN corepack enable

# Move files into the image and install
WORKDIR /app
COPY . .
RUN corepack prepare --activate
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm run postbuild

# Uses assets from build stage to reduce build size
FROM node:20.11-alpine3.18
WORKDIR /app

COPY --from=build /app/package.json /app
COPY --from=build /app/pnpm-lock.yaml /app

RUN corepack enable
RUN corepack prepare --activate
RUN apk add --update dumb-init

# Avoid zombie processes, handle signal forwarding
ENTRYPOINT ["dumb-init", "--"]

COPY --from=build /app /app

RUN pnpm install --frozen-lockfile --prod

RUN apk add bash curl openssl jq util-linux-misc
RUN curl --silent --show-error --fail --output '/usr/local/bin/pdsadmin' 'https://raw.githubusercontent.com/bluesky-social/pds/main/pdsadmin.sh'
RUN sed -i 's/--force/-f/g' /usr/local/bin/pdsadmin
RUN chmod +x /usr/local/bin/pdsadmin

EXPOSE 3000
ENV PDS_PORT=3000
ENV NODE_ENV=production
# potential perf issues w/ io_uring on this version of node
ENV UV_USE_IO_URING=0

CMD ["node", "--enable-source-maps", "dist/startpds.js"]

LABEL org.opencontainers.image.source=https://github.com/bluesky-social/pds
LABEL org.opencontainers.image.description="AT Protocol PDS (Sprk Version)"
LABEL org.opencontainers.image.licenses=MIT