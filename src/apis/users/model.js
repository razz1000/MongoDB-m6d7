import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, min: 15, max: 85, required: true },
    professions: [String],
    address: {
      street: { type: String },
      number: { type: Number },
    },
  },
  { timestamps: true }
);

export default model("User", usersSchema);
