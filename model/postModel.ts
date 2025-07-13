import { Schema, model, Types, Document } from "mongoose";

interface iPost {
  title: string;
  postImage: string;
  downloadable?: boolean; // ✅ Optional field
  postImageID: string;
  userID: Types.ObjectId;
  likes: string[]; // ✅ Correct type
}

interface iPostData extends iPost, Document {}

const postModel = new Schema<iPostData>(
  {
    title: {
      type: String,
    },
    postImage: {
      type: String,
    },
    postImageID: {
      type: String,
    },
    userID: {
      type: Schema.Types.ObjectId,
    },
    likes: [
      {
        type: String,
      },
    ],
    downloadable: {
      type: Boolean,
      default: false, // locked by default
    },
  },
  { timestamps: true }
);
export default model<iPostData>("Posts", postModel);
