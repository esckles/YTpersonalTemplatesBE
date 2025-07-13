import { Document, model, Schema, Types } from "mongoose";

interface iAdmin {
  name: string;
  email: string;
  password: string;
  avatar: string;
  avatarID: string;
  posts: Types.ObjectId[];
  followers: string[];
  isVerified: boolean;
  isVerifiedToken: string;
}

interface iAdminData extends iAdmin, Document {}

const adminModel = new Schema<iAdminData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    posts: [
      {
        type: Types.ObjectId,
        ref: "Posts",
      },
    ],
    isVerified: {
      type: Boolean,
    },
    isVerifiedToken: {
      type: String,
    },
    followers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default model<iAdminData>("AdminRegisteration", adminModel);
