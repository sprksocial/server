import type { LoggerOptions } from "pino";
import { env } from "./env.ts";

export const customConfig = (name: string): LoggerOptions => {
  return {
    name,
    level: env.NODE_ENV === "development" ? "debug" : "info",
    ...(env.NODE_ENV === "development" && {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    }),
  };
};
