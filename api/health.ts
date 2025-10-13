import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text(
    `
.------..------..------..------..------.
|S.--. ||P.--. ||A.--. ||R.--. ||K.--. |
| :/\\: || :/\\: || (\\/) || :(): || :/\\: |
| :\\/: || (__) || :\\/: || ()() || :\\/: |
| '--'S|| '--'P|| '--'A|| '--'R|| '--'K|
${"`"}------'${"`"}------'${"`"}------'${"`"}------'${"`"}------'


This is an AT Protocol Application View (AppView) for the "sprk.so" application.

Most API routes are under /xrpc/
                                                                 	
		`,
  );
});

app.get("/robots.txt", (c) => {
  return c.text(
    '# Hello Friends!\n\n# Crawling the public parts of the API is allowed. HTTP 429 ("backoff") status codes are used for rate-limiting. Up to a handful concurrent requests should be ok.\nUser-agent: *\nAllow: /',
  );
});

app.get("/xrpc/_health", (c) => {
  const version = Deno.env.get("COMMIT_SHA") ?? "unknown";
  return c.json({ version });
});

export default app;
