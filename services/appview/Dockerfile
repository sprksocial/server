FROM denoland/deno:latest AS production

WORKDIR /app

ENV NODE_ENV=production

COPY deno.json deno.lock ./

RUN deno install

EXPOSE 3000

CMD ["deno", "run", "main.ts"]
