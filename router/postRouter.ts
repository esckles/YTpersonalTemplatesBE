// import { Router } from "express";
// import {
//   CreateUserPost,
//   ReadAllUserPost,
//   ReadOneUserPost,
//   DeleteOnePost,
//   ReadMainPost,
//   searchPost,
// } from "../controller/postController";
// import { upload } from "../utils/multer";

// const router: any = Router();

// // Post Creation
// router.route("/createpost/:userID").post(upload, CreateUserPost);

// // Read All Posts
// router.route("/readallposts").get(ReadAllUserPost);

// // Read One Post
// router.route("/readonepost/:postID").get(ReadOneUserPost);

// // Delete One Post
// router.route("/deletepost/:postID").delete(DeleteOnePost);

// // Read Main Post (Friends' Posts)
// router.route("/readmainpost/:userID").get(ReadMainPost);

// // Search Posts
// router.route("/searchpost").post(searchPost);

// //  app.use("/api/posts", postRouter);
// export default router;
