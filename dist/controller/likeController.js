"use strict";
// import { Response } from "express";
// import postModel from "../model/postModel";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikePost = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
// export const LikePost = async (req: any, res: Response) => {
//   try {
//     const { postID } = req.params;
//     const post: any = await postModel.findById(postID);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found", status: 404 });
//     }
//     const userID = req.user.id;
//     const alreadyLiked = post.likes.includes(userID);
//     console.log("UserID:", userID);
//     console.log("Post Likes Before:", post.likes);
//     if (alreadyLiked) {
//       post.likes.pull(userID);
//     } else {
//       post.likes.push(userID);
//     }
//     await post.save();
//     return res.status(200).json({
//       message: alreadyLiked ? "Unliked post" : "Liked post",
//       data: post,
//     });
//   } catch (error: any) {
//     console.log("Like Post Error:", error.message);
//     return res.status(500).json({ message: "Error liking post", status: 500 });
//   }
// };
const LikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(req.params.postID);
        const anonID = req.body.anonID;
        if (!anonID) {
            return res.status(400).json({ message: "Anonymous ID required" });
        }
        if (post) {
            const alreadyLiked = post.likes.includes(anonID);
            if (alreadyLiked) {
                post.likes = post.likes.filter((id) => id !== anonID);
            }
            else {
                post.likes.push(anonID);
            }
            yield post.save();
            return res
                .status(200)
                .json({ message: alreadyLiked ? "Unliked" : "Liked", data: post });
        }
        else {
            return res.status(404).json({ message: "Post not found" });
        }
    }
    catch (error) {
        console.log("Like Post Error:", error.message);
        return res.status(500).json({ message: "Error liking post", status: 500 });
    }
});
exports.LikePost = LikePost;
