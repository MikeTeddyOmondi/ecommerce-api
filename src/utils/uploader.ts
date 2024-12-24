import { Client } from "minio";

import {
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_API_HOST,
  MINIO_BUCKET,
} from "../config";
import { logger } from "./logger";

if (
  MINIO_ACCESS_KEY == undefined ||
  MINIO_SECRET_KEY == undefined ||
  MINIO_API_HOST == undefined ||
  MINIO_BUCKET == undefined
) {
  logger.error("[#] Minio configuration required!");
  process.exit(1);
}

const BUCKET_NAME = String(MINIO_BUCKET);

// Instantiate the minio client with
// the endpoint and access keys
const minioClient = new Client({
  endPoint: MINIO_API_HOST,
  port: 9000,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export default class Uploader {
  private mc = minioClient;

  constructor() {
    this.mc.bucketExists(BUCKET_NAME, async function (error, doesExists) {
      if (error) {
        // console.log(error);
        return logger.error(
          `[!] ERROR: CHECKING IF BUCKET EXISTS: [POST] ${error.message}`
        );
      }

      // Create bucket if it doesn't exist
      if (!doesExists) {
        // Make a bucket called photos.
        minioClient.makeBucket("photos", "us-east-1", function (error: any) {
          if (error) {
            // console.log(error);
            return logger.error(
              `[!] ERROR: CREATING bucket(s): ${error.message}`
            );
          }
          // console.log('Bucket created successfully in "us-east-1" region.');
          return logger.info(
            `[*] SUCCESS: CREATING bucket(s): ${BUCKET_NAME} in "us-east-1" region.`
          );
        });
      }
      // console.log(`Bucket: ${BUCKET_NAME} exists...`);
      return logger.info(`[*] SUCCESS: Bucket: ${BUCKET_NAME} exists...`);
    });
  }

  async upload(object: { filePath: string; filename: string }) {
    try {
      let imageUrl: string | null = null;

      if (
        MINIO_ACCESS_KEY == undefined ||
        MINIO_SECRET_KEY == undefined ||
        MINIO_API_HOST == undefined
      ) {
        logger.error("[#] Minio configuration required!");
        process.exit(1);
      }
      let metaData = {
        "Content-Type": "image",
        "x-ecommerce-images": 1234,
      };

      // Using fPutObject API upload your file to the bucket
      this.mc.fPutObject(
        BUCKET_NAME,
        object.filename,
        object.filePath,
        metaData,
        function (error, etag) {
          if (error) {
            // console.log(error);
            logger.error(`[!] ERROR: Uploading object ${error.message}`);
            return (imageUrl = null);
          }
          // console.log("File uploaded successfully!");
          logger.info("[*] SUCCESS: File uploaded successfully!");

          imageUrl = `http://${MINIO_API_HOST}:9000/${MINIO_BUCKET}/${object.filename}`;
          return imageUrl;
        }
      );
    } catch (error: any) {
      console.log(error);
      logger.error(`[!] ERROR: Uploading object ${error.message}`);
      return null;
    }
  }
}
