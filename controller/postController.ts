import { Request, Response } from "express";
import { Types } from "mongoose";
import postModel from "../model/postModel";
import adminModel from "../model/adminModel";
import cloudinary from "../utils/cloudinary";

export const CreateUserPost = async (req: Request, res: Response) => {
  try {
    const { title, description, userID } = req.body;

    if (!title || !description || !req.file || !userID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const post = await postModel.create({
      title,
      description,
      postImage: result.secure_url,
      postImageID: result.public_id,
      userID,
    });

    return res.status(201).json({ message: "Post created", data: post });
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).json({ message: "Error creating Post" });
  }
};

export const ReadAllUserPost = async (req: Request, res: Response) => {
  try {
    const posts = await postModel.find().sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json({ message: "All user Post Read ", data: posts, status: 200 });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error Reading All users Post", status: 404 });
  }
};

export const ReadOneUserPost = async (req: Request, res: Response) => {
  try {
    const { postID } = req.params;
    const post = await postModel.findById(postID);

    if (!post) {
      return res.status(404).json({ message: "Post not found", status: 404 });
    }

    return res.status(200).json({
      message: "One user Post Read Successfully",
      data: post,
      status: 200,
    });
  } catch (error) {
    // console.log("Error Reading One user Post", error);
    return res
      .status(500)
      .json({ message: "Error Reading One user Post", status: 500 });
  }
};

export const DeleteOnePost = async (req: Request, res: Response) => {
  try {
    const { postID } = req.params;
    const post = await postModel.findByIdAndDelete(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found", status: 404 });
    }

    // Optionally, remove the post reference from the user's posts array
    await adminModel.updateMany(
      { posts: postID },
      { $pull: { posts: postID } }
    );

    return res
      .status(200)
      .json({ message: "Post Deleted Successfully", status: 200 });
  } catch (error) {
    // console.log("Error deleting post", error);
    return res
      .status(500)
      .json({ message: "Error deleting Post", status: 500 });
  }
};
export const ReadMainFeed = async (req: Request, res: Response) => {
  try {
    const { adminID } = req.params;

    const posts = await postModel
      .find({ userID: adminID })
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this admin" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("ReadMainFeed error:", error);
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

export const searchPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;
    const posts = await postModel.find({
      title: { $regex: search, $options: "i" },
    });
    return res
      .status(200)
      .json({ message: "Search results", data: posts, status: 200 });
  } catch (error) {
    return res.status(404).json({ message: error, status: 404 });
  }
};

export const UpdateUserPost = async (req: any, res: Response) => {
  try {
    const { postID } = req.params;
    const { title } = req.body;

    const post = await postModel.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found", status: 404 });
    }

    // Optional: check if the current user owns this post
    if (post.userID !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized", status: 403 });
    }

    // Delete the old image if updating it
    if (req.file) {
      await cloudinary.uploader.destroy(post.postImageID);
      const { secure_url, public_id }: any = await cloudinary.uploader.upload(
        req.file.path
      );

      post.postImage = secure_url;
      post.postImageID = public_id;
    }

    // Update title if provided
    if (title) {
      post.title = title;
    }

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      status: 200,
      data: post,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating post", status: 500 });
  }
};

export const toggleDownloadable = async (req: Request, res: Response) => {
  try {
    const { postID } = req.params;
    const { downloadable } = req.body;

    const post = await postModel.findByIdAndUpdate(
      postID,
      { downloadable },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Toggle Download Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
