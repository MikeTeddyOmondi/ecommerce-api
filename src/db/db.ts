import { config } from "dotenv";
import mongoose from "mongoose";

import { logger } from "../utils/logger";
import { DATABASE_URL } from "../config";

config();

mongoose.Promise = global.Promise;

export const dbConnection = async function () {
  try {
    if (!DATABASE_URL) {
      throw new Error("Database URL is not configured!");
    }
    await mongoose.connect(DATABASE_URL, {
      maxPoolSize: 5,
      connectTimeoutMS: 500,
    });
    logger.info("[*] Database connection successful!");
  } catch (error: any) {
    logger.warn(`[!] WARNING: Can't connect to the database...`);
  }
};
