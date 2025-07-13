// import { Response } from "express";
// import postModel from "../model/postModel";

import { Request, Response } from "express";
import postModel from "../model/postModel";

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

export const LikePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const post = await postModel.findById(req.params.postID);
    const anonID = req.body.anonID;

    if (!anonID) {
      return res.status(400).json({ message: "Anonymous ID required" });
    }

    if (post) {
      const alreadyLiked = post.likes.includes(anonID);
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id !== anonID);
      } else {
        post.likes.push(anonID);
      }

      await post.save();
      return res
        .status(200)
        .json({ message: alreadyLiked ? "Unliked" : "Liked", data: post });
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error: any) {
    console.log("Like Post Error:", error.message);
    return res.status(500).json({ message: "Error liking post", status: 500 });
  }
};
