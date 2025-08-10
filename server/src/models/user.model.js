import mongoose from "mongoose";

const UserCheSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true },
    profilePicture: { type: String, default: "" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserCheSchema);
