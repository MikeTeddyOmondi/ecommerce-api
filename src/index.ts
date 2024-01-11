import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { Hono } from "hono";

import { users, products } from "./routes";
import { logger } from "./utils/logger";
import { dbConnection } from "./db";
import { API_VERSION, PORT } from "./config";

config();

dbConnection();

const app = new Hono();
const apiVersion = API_VERSION ? API_VERSION : "latest";

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:8000",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", async (ctx) => {
  try {
    logger.info("[*] API Info [GET]");
    return ctx.json({
      success: true,
      message: "Ecommerce Application Service",
    });
  } catch (error: any) {
    logger.error("[!] ERROR: API Info [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `${error.message}` });
  }
});

app.get("api/v1/", async (ctx) => {
  try {
    logger.info("[*] API Info [GET]");
    return ctx.json({
      success: true,
      message: "Ecommerce API v1.0.0",
    });
  } catch (error: any) {
    logger.error("[!] ERROR: API Info [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `${error.message}` });
  }
});

app.route("/api/v1/users", users);
app.route("/api/v1/products", products);

const port = PORT ? parseInt(PORT) : 3344;

logger.info(`[*] Ecommerce App v:${apiVersion}`);

mongoose.connection
  .on("open", () => {
    serve(
      {
        fetch: app.fetch,
        port,
      },
      (info) => {
        logger.info(`[*] Server listening: http://localhost:${info.port}`);
      }
    );
  })
  .on("error", (error) => {
    logger.error(`[!] ERROR: Database Connection Error: ${error.message}`);
    setTimeout(async () => {
      await dbConnection();
    }, 500);
  });
