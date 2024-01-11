import { config } from "dotenv";

config();

const { API_VERSION, DATABASE_URL, PORT } = process.env;

export { API_VERSION, PORT, DATABASE_URL };
