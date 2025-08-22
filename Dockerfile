FROM denoland/deno:alpine-2.3.5 AS builder
ARG COMMIT_SHA

WORKDIR /app

COPY . .

RUN deno cache main.ts

FROM denoland/deno:alpine-2.3.5 AS production
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["deno", "task", "start"]
