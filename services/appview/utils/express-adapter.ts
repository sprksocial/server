import { Context } from "hono";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router as ExpressRouter,
} from "express";

/**
 * Converts an Express middleware/router to a Hono middleware
 * @param expressRouter The Express router or middleware to convert
 * @returns A Hono middleware function
 */
export const expressToHono = (expressRouter: ExpressRouter) => {
  return async (c: Context): Promise<Response | void> => {
    console.log("Incoming request:", c.req.url);

    // Create a mutable Express-compatible request object
    const req = {
      url: c.req.url,
      method: c.req.method,
      headers: Object.fromEntries([...c.req.raw.headers]),
      query: c.req.query(),
      params: {},
      body: await c.req.json().catch(() => ({})),
      get: (name: string) => req.headers[name.toLowerCase()],
      path: new URL(c.req.url).pathname,
    } as unknown as ExpressRequest;

    console.log("Created Express request:", {
      url: req.url,
      method: req.method,
      path: req.path,
    });

    return new Promise((resolve) => {
      const res = {
        setHeader: (name: string, value: string) => {
          console.log("setHeader:", name, value);
          c.header(name, value);
          return res;
        },
        end: (chunk: any) => {
          console.log("end called with:", chunk);
          resolve(c.body(chunk));
        },
        json: (body: any) => {
          console.log("json called with:", body);
          resolve(c.json(body));
        },
        status: (code: number) => {
          console.log("status called with:", code);
          c.status(code as any);
          return res;
        },
        send: (body: any) => {
          console.log("send called with:", body);
          resolve(c.body(body));
        },
      } as unknown as ExpressResponse;

      console.log("Calling Express router");
      expressRouter(req, res, (err: any) => {
        console.log("Express router callback called", { err });
        if (err) {
          c.status(500);
          resolve(c.json({ error: "Internal Server Error" }));
        }
      });
    });
  };
};
