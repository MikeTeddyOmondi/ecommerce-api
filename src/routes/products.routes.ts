import { Hono } from "hono";

import { logger } from "../utils/logger";
import { Product, dbConnection } from "../db";

const products = new Hono();

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
