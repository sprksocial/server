FROM denoland/deno:alpine-2.5.4
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN deno install

EXPOSE 3000

CMD ["deno", "task", "start"]
