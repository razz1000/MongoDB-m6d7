import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: [
      {
        value: { type: Number },
        unit: { type: String },
      },
    ],
    author: [
      {
        name: { type: String },
        avatar: { type: String },
      },
    ],
    content: { type: String },
  },
  { timestamps: true }
);

export default model("blogpost", blogPostSchema);
