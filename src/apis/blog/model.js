import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Likes" }],
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: [
      {
        value: { type: Number },
        unit: { type: String },
      },
    ],

    content: { type: String },
    comments: [{ text: String }],
  },
  { timestamps: true }
);

export default model("blogpost", blogPostSchema);
