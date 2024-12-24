import { config } from "dotenv";

config();

const {
  API_VERSION,
  DATABASE_URL,
  PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_API_HOST,
  MINIO_BUCKET,
} = process.env;

export {
  API_VERSION,
  PORT,
  DATABASE_URL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_API_HOST,
  MINIO_BUCKET,
};
