"use strict";
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
exports.toggleDownloadable = exports.UpdateUserPost = exports.searchPost = exports.ReadMainFeed = exports.DeleteOnePost = exports.ReadOneUserPost = exports.ReadAllUserPost = exports.CreateUserPost = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const CreateUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, userID } = req.body;
        if (!title || !description || !req.file || !userID) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const result = yield cloudinary_1.default.uploader.upload(req.file.path);
        const post = yield postModel_1.default.create({
            title,
            description,
            postImage: result.secure_url,
            postImageID: result.public_id,
            userID,
        });
        return res.status(201).json({ message: "Post created", data: post });
    }
    catch (error) {
        console.error("Post creation error:", error);
        return res.status(500).json({ message: "Error creating Post" });
    }
});
exports.CreateUserPost = CreateUserPost;
const ReadAllUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().sort({
            createdAt: -1,
        });
        return res
            .status(200)
            .json({ message: "All user Post Read ", data: posts, status: 200 });
    }
    catch (error) {
        return res
            .status(404)
            .json({ message: "Error Reading All users Post", status: 404 });
    }
});
exports.ReadAllUserPost = ReadAllUserPost;
const ReadOneUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = req.params;
        const post = yield postModel_1.default.findById(postID);
        if (!post) {
            return res.status(404).json({ message: "Post not found", status: 404 });
        }
        return res.status(200).json({
            message: "One user Post Read Successfully",
            data: post,
            status: 200,
        });
    }
    catch (error) {
        // console.log("Error Reading One user Post", error);
        return res
            .status(500)
            .json({ message: "Error Reading One user Post", status: 500 });
    }
});
exports.ReadOneUserPost = ReadOneUserPost;
const DeleteOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = req.params;
        const post = yield postModel_1.default.findByIdAndDelete(postID);
        if (!post) {
            return res.status(404).json({ message: "Post not found", status: 404 });
        }
        // Optionally, remove the post reference from the user's posts array
        yield adminModel_1.default.updateMany({ posts: postID }, { $pull: { posts: postID } });
        return res
            .status(200)
            .json({ message: "Post Deleted Successfully", status: 200 });
    }
    catch (error) {
        // console.log("Error deleting post", error);
        return res
            .status(500)
            .json({ message: "Error deleting Post", status: 500 });
    }
});
exports.DeleteOnePost = DeleteOnePost;
const ReadMainFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const posts = yield postModel_1.default
            .find({ userID: adminID })
            .sort({ createdAt: -1 });
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this admin" });
        }
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error("ReadMainFeed error:", error);
        return res.status(500).json({ message: "Error fetching posts" });
    }
});
exports.ReadMainFeed = ReadMainFeed;
const searchPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.body;
        const posts = yield postModel_1.default.find({
            title: { $regex: search, $options: "i" },
        });
        return res
            .status(200)
            .json({ message: "Search results", data: posts, status: 200 });
    }
    catch (error) {
        return res.status(404).json({ message: error, status: 404 });
    }
});
exports.searchPost = searchPost;
const UpdateUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = req.params;
        const { title } = req.body;
        const post = yield postModel_1.default.findById(postID);
        if (!post) {
            return res.status(404).json({ message: "Post not found", status: 404 });
        }
        // Optional: check if the current user owns this post
        if (post.userID !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized", status: 403 });
        }
        // Delete the old image if updating it
        if (req.file) {
            yield cloudinary_1.default.uploader.destroy(post.postImageID);
            const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
            post.postImage = secure_url;
            post.postImageID = public_id;
        }
        // Update title if provided
        if (title) {
            post.title = title;
        }
        yield post.save();
        return res.status(200).json({
            message: "Post updated successfully",
            status: 200,
            data: post,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error updating post", status: 500 });
    }
});
exports.UpdateUserPost = UpdateUserPost;
const toggleDownloadable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postID } = req.params;
        const { downloadable } = req.body;
        const post = yield postModel_1.default.findByIdAndUpdate(postID, { downloadable }, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Toggle Download Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.toggleDownloadable = toggleDownloadable;
