import { Hono } from "hono";

import { logger } from "../utils/logger";
import { User, dbConnection } from "../db";

const users = new Hono();

type ReqBody = {
  publicId?: string;
  username: string;
  password: string;
};

users.get("/", async (ctx) => {
  try {
    logger.info("[!] All Users [GET]");
    const allUsers = await User.find().exec();
    logger.info({ users: allUsers }, "[*] SUCCESS: All Users: [GET]");
    ctx.status(200);
    return ctx.json({ success: true, data: { users: allUsers } });
  } catch (error: any) {
    logger.error("[!] ERROR: All Users: [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `Something went wrong!` });
  }
});

users.post("/", async (ctx) => {
  try {
    logger.info("[!] CREATE User [POST]");
    const { username, password }: ReqBody = await ctx.req.json();
    // TODO: generate secure hash password
    // const hashPassword = genHash(password);
    if (username === "" || password === "") {
      throw new Error("Username and password required!");
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error("Username already exists!");
    }
    const newUser = await User.create({ username, password });
    logger.info({ users: newUser }, "[*] SUCCESS: CREATE Users: [POST]");
    ctx.status(200);
    return ctx.json({ success: true, data: { users: newUser } });
  } catch (error: any) {
    // console.log({ error });
    logger.error(`[!] ERROR: CREATE Users: [POST] ${error.message}`);
    ctx.status(500);
    return ctx.json({ success: false, message: `Something went wrong!` });
  }
});

users.get("/:id", async (ctx) => {
  try {
    logger.info("[!] Single User [GET]");
    const userId = ctx.req.param("id");
    const user = await User.findById(userId).exec();
    logger.info({ user }, "[!] SUCCESS: Single User: [GET]");
    ctx.status(200);
    return ctx.json({ success: true, data: { user } });
  } catch (error: any) {
    logger.error("[!] ERROR: Single User: [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `Something went wrong!` });
  }
});

users.put("/:id", async (ctx) => {
  try {
    logger.info("[!] Single User [GET]");
    const userId = ctx.req.param("id");
    const user = await User.findById(userId).exec();
    logger.info({ user }, "[!] SUCCESS: Single User: [GET]");
    ctx.status(200);
    return ctx.json({ success: true, data: { user } });
  } catch (error: any) {
    logger.error("[!] ERROR: Single User: [GET]");
    ctx.status(500);
    return ctx.json({ success: false, message: `Something went wrong!` });
  }
});

export default users;
