import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likesSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    likeCount: { type: Number },
  },

  { timestamps: true }
);

export default model("Likes", likesSchema);
