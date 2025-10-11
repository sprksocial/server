import { configure, getConsoleSink } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

export async function configureLogger() {
  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: getPrettyFormatter({
          properties: true,
          categoryStyle: "underline",
          messageColor: "rgb(255, 255, 255)",
          categoryColor: "rgb(255, 255, 255)",
          messageStyle: "reset",
        }),
      }),
    },
    loggers: [
      { category: "appview", lowestLevel: "info", sinks: ["console"] },
      {
        category: ["logtape", "meta"],
        lowestLevel: "error",
        sinks: ["console"],
      },
    ],
  });
}
