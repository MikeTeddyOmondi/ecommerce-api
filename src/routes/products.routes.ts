import { Hono } from "hono";
import { File } from "buffer";

import { logger } from "../utils/logger";
import { Product, dbConnection } from "../db";
import { MINIO_API_HOST, MINIO_BUCKET } from "../config";
import Uploader from "../utils/uploader";

const products = new Hono();

type ReqBody = {
  publicId?: string;
  name: string;
  file: File;
};

products.get("/", async (ctx) => {
  try {
    logger.info("[!] All Products [GET]");
    await dbConnection();
    const products = await Product.find().exec();
    logger.info({ products }, "[!] SUCCESS: All products: GET Request");
    ctx.status(200);
    return ctx.json({ success: true, data: { products } });
  } catch (error: any) {
    logger.error("[!] ERROR: All Products [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `${error.message}` });
  }
});

products.post("/", async (ctx) => {
  try {
    logger.info("[!] CREATE Product [POST]");
    console.log(await ctx.req.parseBody());
    const { name, file } = (await ctx.req.parseBody()) as unknown as ReqBody;
    if (name === "" || !file) {
      throw new Error("Product name and file required!");
    }
    const productExists = await Product.findOne({ name });
    if (productExists) {
      throw new Error("Product already exists!");
    }
    const uploader = new Uploader();

    const object = { filePath: file.name, filename: file.name };
    const imageUrl = await uploader.upload(object);
    console.log({ imageUrl });

    if (imageUrl === null) {
      throw new Error(`An error occurred while uploading file`);
      // return ctx.json({ success: false, message: `Something went wrong!` });
    }

    const newProduct = await Product.create({ name, imageUrl });
    logger.info(
      { products: newProduct, imageUrl },
      "[*] SUCCESS: CREATE Products: [POST]"
    );
    ctx.status(200);
    return ctx.json({ success: true, data: { product: newProduct } });
  } catch (error: any) {
    // console.log({ error });
    logger.error(`[!] ERROR: CREATE products: [POST] ${error.message}`);
    ctx.status(500);
    return ctx.json({ success: false, message: `Something went wrong!` });
  }
});

products.get("/:id", async (ctx) => {
  try {
    logger.info("[!] Single Product [GET]");
    const productId = ctx.req.param("id");
    await dbConnection();
    const products = await Product.find({ id: productId }).exec();
    logger.info({ products }, "[!] SUCCESS: Single products: GET Request");
    ctx.status(200);
    return ctx.json({ success: true, data: { products } });
  } catch (error: any) {
    logger.error("[!] ERROR: Single Product [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `${error.message}` });
  }
});

export default products;
