import pino from "pino";
import { join } from "path";

const file = join(__dirname, "..", "..", "logs", `logs-${process.pid}.json`);

export const logger = pino({
  transport: {
    targets: [
      {
        level: "warn",
        target: "pino/file",
        options: {
          destination: file,
        },
      },
      {
        level: "error",
        target: "pino/file",
        options: {
          destination: file,
        },
      },
      {
        level: "info",
        target: "pino-pretty",
      },
    ],
  },
});
