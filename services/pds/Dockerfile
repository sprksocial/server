FROM node:20.11-alpine3.18 AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN corepack prepare --activate

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build && pnpm run postbuild

FROM node:20.11-alpine3.18 AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PDS_PORT=3000
ENV UV_USE_IO_URING=0

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./

RUN corepack enable && \
  corepack prepare --activate && \
  apk add --no-cache dumb-init bash curl openssl jq util-linux-misc && \
  curl --silent --show-error --fail --output '/usr/local/bin/pdsadmin' 'https://raw.githubusercontent.com/bluesky-social/pds/main/pdsadmin.sh' && \
  sed -i 's/--force/-f/g' /usr/local/bin/pdsadmin && \
  chmod +x /usr/local/bin/pdsadmin

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

ENTRYPOINT ["dumb-init", "--"]

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/startpds.js"]

LABEL org.opencontainers.image.source=https://github.com/sprksocial/spark-back-end
LABEL org.opencontainers.image.description="AT Protocol PDS (Spark Version)"
LABEL org.opencontainers.image.licenses=MIT