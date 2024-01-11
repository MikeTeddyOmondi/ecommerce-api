import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    publicId: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: false },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    publicId: { type: String, required: false },
    name: { type: String, required: true },
    stockQuantity: { type: Number, required: true, defaultValue: 0 },
    colors: { type: [String], required: false },
  },
  { timestamps: true }
);

export const User = model("Users", UserSchema);
export const Product = model("Product", ProductSchema);
