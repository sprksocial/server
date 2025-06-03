FROM denoland/deno:alpine-2.3.5 AS builder

WORKDIR /app

COPY . .

RUN deno cache main.ts

FROM denoland/deno:alpine-2.3.5 AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["deno", "task", "start"]
